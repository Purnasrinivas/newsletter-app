const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('./server/utils/logger');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
let server = null;

// Configure middleware with increased limits
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Job Schema
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: 'Remote',
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: [{
    type: String,
    enum: ['Software Developer', 'DevOps Engineer', 'Data Analyst', 'UI/UX Designer', 'Project Manager']
  }],
  datePosted: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  categories: [{
    type: String,
    enum: ['Software Developer', 'DevOps Engineer', 'Data Analyst', 'UI/UX Designer', 'Project Manager']
  }],
  dateSubscribed: {
    type: Date,
    default: Date.now
  }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// API Routes for jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs' 
    });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    console.log('Received job data:', req.body);
    
    // Map applyLink to link if needed
    const jobData = {...req.body};
    if (jobData.applyLink && !jobData.link) {
      jobData.link = jobData.applyLink;
      delete jobData.applyLink; // Remove the extra field
    }
    
    const job = new Job(jobData);
    const savedJob = await job.save();
    console.log('Job saved:', savedJob);
    res.status(201).json({
      success: true,
      data: savedJob
    });
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save job',
      details: error.message 
    });
  }
});

// Add subscriber route
app.post('/api/subscribers', async (req, res) => {
  try {
    const { email, name, categories } = req.body;
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed'
      });
    }
    
    // Create new subscriber
    const subscriber = new Subscriber({
      email,
      name,
      categories: categories || []
    });
    
    // Save to database
    const savedSubscriber = await subscriber.save();
    console.log('New subscriber saved:', savedSubscriber);
    
    // Send welcome email
    try {
      // Create transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL || 'justsrinivas77@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      
      // Send welcome email
      const mailOptions = {
        from: process.env.GMAIL_EMAIL || 'justsrinivas77@gmail.com',
        to: email,
        subject: 'Welcome to Job Newsletter',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Job Newsletter, ${name}!</h2>
            <p>Thank you for subscribing to our job newsletter. You will receive updates for the following categories:</p>
            <ul>
              ${categories.map(cat => `<li>${cat}</li>`).join('')}
            </ul>
            <p>We'll keep you updated with the latest job opportunities.</p>
            <p>Best regards,<br>Job Newsletter Team</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', email);
      
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Error sending welcome email:', emailError);
    }
    
    res.status(201).json({
      success: true,
      data: savedSubscriber
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add subscriber',
      error: error.message
    });
  }
});

// Create a reusable transporter with proper error handling
const createTransporter = () => {
  // Check if credentials are available
  if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
    console.error('Email credentials missing. Check your .env file.');
    throw new Error('Email credentials are not configured');
  }
  
  console.log(`Creating email transporter for: ${process.env.GMAIL_EMAIL}`);
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Newsletter sending route
app.post('/api/newsletter/send', async (req, res) => {
  try {
    const { subject, intro, jobs, outro, categories = [] } = req.body;
    
    // Find subscribers interested in these job categories
    let query = {};
    if (categories && categories.length > 0) {
      query.categories = { $in: categories };
    }
    
    // Find subscribers
    const subscribers = await Subscriber.find(query);
    console.log(`Found ${subscribers.length} subscribers for categories: ${categories.join(', ')}`);
    
    if (subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No subscribers found for selected categories',
        subscriberCount: 0
      });
    }
    
    try {
      // Create transporter with error handling
      const transporter = createTransporter();
      
      // Send newsletter to each subscriber
      for (const subscriber of subscribers) {
        const mailOptions = {
          from: process.env.GMAIL_EMAIL,
          to: subscriber.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>${subject}</h1>
              <p>${intro}</p>
              
              ${jobs.map(job => `
                <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px;">
                  <h2>${job.title}</h2>
                  <p><strong>Company:</strong> ${job.company}</p>
                  <p><strong>Location:</strong> ${job.location}</p>
                  <div style="margin: 15px 0;">
                    ${job.description.replace(/\n/g, '<br>')}
                  </div>
                  <a href="${job.link}" style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Apply Now</a>
                </div>
              `).join('')}
              
              <p>${outro.replace(/\n/g, '<br>')}</p>
            </div>
          `
        };
        
        await transporter.sendMail(mailOptions);
      }
      
      res.status(200).json({
        success: true,
        message: `Newsletter sent to ${subscribers.length} subscribers`,
        subscriberCount: subscribers.length
      });
    } catch (emailError) {
      console.error('Error sending newsletter:', emailError);
      
      // Return a more specific error message
      if (emailError.code === 'EAUTH') {
        return res.status(500).json({
          success: false,
          message: 'Email authentication failed. Please check your email credentials.',
          error: emailError.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to send newsletter due to email configuration issue',
        error: emailError.message
      });
    }
  } catch (error) {
    console.error('Error processing newsletter request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process newsletter request',
      error: error.message
    });
  }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-newsletter')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('Received shutdown signal');
  
  if (server) {
    console.log('Closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
}

module.exports = { app };
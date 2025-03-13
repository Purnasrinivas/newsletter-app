const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
let server = null;

// Middleware
app.use(cors());
app.use(express.json());

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
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
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
    const jobs = await Job.find().sort({ datePosted: -1 });
    console.log(`Returning ${jobs.length} jobs`);
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch jobs' 
    });
  }
});

// API Routes for jobs
app.post('/api/jobs', async (req, res) => {
  try {
    console.log('Received job data:', req.body);
    
    // Map applyLink to link if needed
    const jobData = {...req.body};
    if (jobData.applyLink && !jobData.link) {
      jobData.link = jobData.applyLink;
      delete jobData.applyLink; // Optional: remove the extra field
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

// Subscriber routes
app.post('/api/subscribers', async (req, res) => {
  try {
    const subscriber = new Subscriber(req.body);
    const savedSubscriber = await subscriber.save();
    res.status(201).json({
      success: true,
      data: savedSubscriber
    });
  } catch (error) {
    console.error('Error saving subscriber:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save subscriber',
      details: error.message 
    });
  }
});

app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch subscribers' 
    });
  }
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { name, email, interests } = req.body;
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    
    if (existingSubscriber) {
      // Update existing subscriber's interests
      existingSubscriber.name = name;
      existingSubscriber.categories = interests;
      await existingSubscriber.save();
      
      return res.status(200).json({
        success: true,
        message: 'Subscription updated successfully'
      });
    }
    
    // Create new subscriber
    const newSubscriber = new Subscriber({
      name,
      email,
      categories: interests
    });
    
    await newSubscriber.save();
    
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully'
    });
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe',
      error: error.message
    });
  }
});

// Newsletter sending route
app.post('/api/send-newsletter', async (req, res) => {
  try {
    const { subject, intro, jobs, outro, categories = [] } = req.body;
    
    // Find subscribers interested in these job categories
    let query = {};
    if (categories && categories.length > 0) {
      query.categories = { $in: categories };
    }
    
    // Find subscribers
    const subscribers = await Subscriber.find(query);
    
    if (subscribers.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No subscribers found for selected categories'
      });
    }
    
    // In a real application, you would send emails here
    // For now, we'll just simulate success
    
    res.status(200).json({
      success: true,
      message: `Newsletter would be sent to ${subscribers.length} subscribers`
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter',
      error: error.message
    });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/newsletter-app')
  .then(() => {
    console.log('Connected to MongoDB');
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

// Important: Add this catch-all route AFTER all API routes
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// This catch-all route handles all client-side routes
// Serve static assets (for both production and development since you've built the app)
app.use(express.static(path.join(__dirname, '../build')));

// This catch-all route handles all client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
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
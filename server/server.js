require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// Move CORS and JSON parsing before any other middleware
app.use(cors());
app.use(express.json());

// Add API routes prefix and move before static files
const apiRouter = express.Router();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'justsrinivas77@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

// API Routes
apiRouter.get('/jobs', (req, res) => {
  try {
    console.log('GET /jobs request received');
    const jobsPath = path.join(__dirname, 'jobs.json');
    console.log('Jobs file path:', jobsPath);
    
    // Ensure file exists
    if (!fs.existsSync(jobsPath)) {
      console.log('Creating new jobs.json file');
      fs.writeFileSync(jobsPath, JSON.stringify([
        {
          id: "1",
          title: "Test Job",
          company: "Test Company",
          location: "Remote",
          description: "Test Description",
          requirements: "Test Requirements",
          applyLink: "https://example.com",
          datePosted: new Date().toISOString()
        }
      ], null, 2));
    }
    
    // Read file content
    const fileContent = fs.readFileSync(jobsPath, 'utf8');
    console.log('Raw file content:', fileContent);
    
    // Parse jobs
    const jobs = JSON.parse(fileContent);
    console.log('Number of jobs:', jobs.length);
    console.log('Jobs data:', jobs);

    // Send response
    res.setHeader('Content-Type', 'application/json');
    res.json(jobs);
  } catch (error) {
    console.error('Error reading jobs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs: ' + error.message 
    });
  }
});

apiRouter.post('/jobs', async (req, res) => {
  try {
    const jobData = req.body;
    console.log('Server received job data:', jobData);

    // Handle both old and new formats
    const normalizedJobData = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location || 'Remote',
      description: jobData.description,
      requirements: jobData.requirements || 'Not specified',
      applyLink: jobData.applyLink || jobData.link || '', // Accept both applyLink and link
    };

    console.log('Normalized job data:', normalizedJobData);

    // Validate required fields
    if (!normalizedJobData.title || !normalizedJobData.company || !normalizedJobData.description) {
      console.log('Missing required fields:', {
        hasTitle: !!normalizedJobData.title,
        hasCompany: !!normalizedJobData.company,
        hasDescription: !!normalizedJobData.description
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, company, or description'
      });
    }

    const jobsPath = path.join(__dirname, 'jobs.json');
    
    // Read existing jobs
    let jobs = [];
    try {
      if (fs.existsSync(jobsPath)) {
        const fileContent = fs.readFileSync(jobsPath, 'utf8');
        jobs = JSON.parse(fileContent);
      }
    } catch (err) {
      console.error('Error reading jobs file:', err);
    }

    // Create new job
    const newJob = {
      id: Date.now().toString(),
      ...normalizedJobData,
      datePosted: new Date().toISOString()
    };

    console.log('New job to be added:', newJob);
    jobs.push(newJob);

    // Save to file
    fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2));
    console.log('Jobs saved successfully');

    res.json({
      success: true,
      message: 'Job posted successfully',
      job: newJob
    });
  } catch (error) {
    console.error('Failed to post job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to post job: ' + error.message 
    });
  }
});

apiRouter.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  console.log('Received subscription request for:', email);
  
  try {
    // Store in file
    const subscribersPath = path.join(__dirname, 'subscribers.json');
    const subscribers = fs.existsSync(subscribersPath) 
      ? JSON.parse(fs.readFileSync(subscribersPath))
      : [];
    
    // Check for duplicate
    if (subscribers.includes(email)) {
      console.log('Duplicate subscription attempt:', email);
      return res.status(400).json({ 
        success: false,
        message: 'This email is already subscribed to our newsletter.' 
      });
    }
    
    // Add new subscriber
    subscribers.push(email);
    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

    try {
      // Send confirmation email
      await transporter.sendMail({
        from: 'justsrinivas77@gmail.com',
        to: email,
        subject: 'Welcome to Job Newsletter!',
        html: `
          <h1>Welcome to Job Newsletter!</h1>
          <p>Thank you for subscribing to our newsletter. You'll receive updates about new job opportunities.</p>
          <p>Best regards,<br>Job Newsletter Team</p>
        `
      });
      console.log('Welcome email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with subscription even if email fails
    }
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to our newsletter!',
      email 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process subscription. Please try again.' 
    });
  }
});

apiRouter.post('/send-newsletter', async (req, res) => {
  const { subject, html } = req.body;
  
  try {
    // Read subscribers
    const subscribersPath = path.join(__dirname, 'subscribers.json');
    const subscribers = fs.existsSync(subscribersPath) 
      ? JSON.parse(fs.readFileSync(subscribersPath))
      : [];

    // Send to all subscribers
    const results = await Promise.all(
      subscribers.map(email => 
        transporter.sendMail({
          from: 'justsrinivas77@gmail.com',
          to: email,
          subject: subject,
          html: html
        })
      )
    );

    console.log(`Newsletter sent to ${results.length} subscribers`);
    res.json({ 
      success: true, 
      message: `Newsletter sent to ${results.length} subscribers` 
    });
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send newsletter' 
    });
  }
});

// Test API endpoint
apiRouter.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Mount API routes
app.use('/api', apiRouter);

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, '../build')));

// Handle React routing - This should be the LAST route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
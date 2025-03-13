const mongoose = require('mongoose');

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
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  category: [{
    type: String,
    required: true,
    enum: ['Software Developer', 'DevOps Engineer', 'Data Analyst', 'UI/UX Designer', 'Project Manager']
  }],
  datePosted: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
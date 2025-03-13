const mongoose = require('mongoose');

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
  interests: [{
    type: String,
    enum: ['Software Developer', 'DevOps Engineer', 'Data Analyst', 'UI/UX Designer', 'Project Manager']
  }],
  dateSubscribed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
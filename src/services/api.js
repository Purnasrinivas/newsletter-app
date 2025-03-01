import { isJobsComponentMounted } from '../state/jobState';

const API_URL = '';  // Empty string since we're serving from the same origin

export const getJobs = async () => {
  try {
    const response = await fetch('/api/jobs');
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Server did not return JSON');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw error;
  }
};

export const subscribeToNewsletter = async (email) => {
  try {
    console.log('Attempting to subscribe:', email);
    
    const response = await fetch(`/api/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);
    return data;
  } catch (error) {
    console.error('Subscription error:', error);
    throw error;
  }
};

export const submitJob = async (jobData) => {
  try {
    // Log the call stack to see where this function is being called from
    console.log('submitJob called from:', new Error().stack);
    
    // Check if being called from Jobs component
    if (!isJobsComponentMounted) {
      console.error('Attempt to submit job while Jobs component not mounted');
      throw new Error('Invalid job submission attempt');
    }

    // Log the incoming data
    console.log('submitJob received:', jobData);

    // Ensure we're sending the correct data structure
    const formattedData = {
      title: jobData.title,
      company: jobData.company,
      location: jobData.location || 'Remote',
      description: jobData.description,
      requirements: jobData.requirements || 'Not specified',
      applyLink: jobData.applyLink // Make sure we're using applyLink, not link
    };

    console.log('Sending formatted data to server:', formattedData);

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    console.log('Server response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server response data:', data);
    return data;
  } catch (error) {
    console.error('Failed to submit job:', error);
    throw error;
  }
}; 
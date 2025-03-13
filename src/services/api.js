const API_BASE_URL = '/api';

export const updateJob = async (job) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${job._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to update job: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error updating job:', error);
    throw error;
  }
};

export const getJobs = async () => {
  try {
    console.log('Fetching jobs from:', `${API_BASE_URL}/jobs`);
    const response = await fetch(`${API_BASE_URL}/jobs`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200) + '...');
      throw new Error('Server did not return JSON');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error fetching jobs:', error);
    throw error;
  }
};

export const submitJob = async (jobData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to submit job: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error submitting job:', error);
    throw error;
  }
};

export const getSubscribers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/subscribers`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscribers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    throw error;
  }
};

export const addSubscriber = async (subscriberData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to add subscriber: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error adding subscriber:', error);
    throw error;
  }
};

export const sendNewsletter = async (newsletterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Failed to send newsletter: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error sending newsletter:', error);
    throw error;
  }
};
const API_BASE_URL = process.env.REACT_APP_API_URL || '';
export const updateJob = async (job) => {
  try {
    const response = await fetch(`/api/jobs/${job._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(job)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error updating job:', error);
    throw error;
  }
};
export const getJobs = async () => {
  try {
    const response = await fetch('/api/jobs');
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    return await response.json();
  } catch (error) {
    console.error('API error fetching jobs:', error);
    throw error;
  }
};

export const submitJob = async (jobData) => {
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit job');
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
    console.log('Submitting subscriber data:', subscriberData);
    
    const response = await fetch(`${API_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData)
    });

    const data = await response.json();
    console.log('Server response:', data);

    if (!response.ok) {
      // Show more detailed error from server
      throw new Error(data.message || 'Failed to add subscriber');
    }

    return data;
  } catch (error) {
    console.error('Failed to add subscriber:', error);
    throw error;
  }
};

export const sendNewsletter = async (newsletterData) => {
  try {
    const response = await fetch('/api/send-newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send newsletter');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error sending newsletter:', error);
    throw error;
  }
};
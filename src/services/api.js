const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const getJobs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    const data = await response.json();
    console.log('API getJobs response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const submitJob = async (jobData) => {
  try {
    console.log('API submitJob called with data:', jobData);
    
    const response = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData)
    });

    const data = await response.json();
    console.log('API submit response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit job');
    }

    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Failed to submit job:', error);
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
    const response = await fetch(`${API_BASE_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add subscriber');
    }

    return data;
  } catch (error) {
    console.error('Failed to add subscriber:', error);
    throw error;
  }
};

export const sendNewsletter = async (newsletterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send newsletter');
    }

    return data;
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
};
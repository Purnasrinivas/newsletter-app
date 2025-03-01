// Shared state for job submission
export let isJobsComponentMounted = false;

export const setJobsComponentMounted = (value) => {
  isJobsComponentMounted = value;
  console.log('isJobsComponentMounted set to:', value);
}; 
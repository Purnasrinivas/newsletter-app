const log = (message, data = null) => {
  const timestamp = new Date().toISOString();
  console.log(`ℹ️ ${message}`);
  if (data) {
    console.log(data);
  }
};

const error = (message, error = null) => {
  const timestamp = new Date().toISOString();
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
};

module.exports = {
  log,
  error
};
const logger = require('./logger');

async function runLogTests() {
  console.log('\n🧪 Starting Logger Tests\n');

  const tests = [
    {
      name: 'Regular logging',
      run: () => logger.log('Simple log message')
    },
    {
      name: 'Data logging',
      run: () => logger.log('Log with data', { type: 'test', value: 42 })
    },
    {
      name: 'Error logging',
      run: () => {
        try {
          throw new Error('Expected test error');
        } catch (error) {
          logger.error('Error test case', error);
        }
      }
    },
    {
      name: 'Debug logging',
      run: () => logger.debug('Debug message', { debugData: 123 })
    }
  ];

  try {
    let testsPassed = 0;
    const totalTests = tests.length;

    for (const test of tests) {
      console.log(`\n📋 Test ${testsPassed + 1}/${totalTests}: ${test.name}`);
      await test.run();
      testsPassed++;
      console.log(`✅ Passed: ${test.name}`);
    }

    console.log(`\n🎉 All ${testsPassed} tests completed successfully!\n`);
    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  } finally {
    console.log('📝 Check server.log for detailed output\n');
  }
}

// Execute tests when run directly
if (require.main === module) {
  (async () => {
    try {
      const success = await runLogTests();
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('Failed to execute tests:', error);
      process.exit(1);
    }
  })();
}

module.exports = runLogTests;
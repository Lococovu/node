const router   = require('express').Router();
const storage  = require('../storage');
const instance = require('../server');

router.get('/', (req, res) => {
  // Building up our response
  let response = storage.get('config').value();

  // Server status
  response.status = {
    players: 0,
    running: instance.isRunning(),
    ready: instance.isReady()
  };

  res.end(JSON.stringify(response));
});

module.exports = router;
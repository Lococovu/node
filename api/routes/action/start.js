const router     = require('express').Router();
const instance   = require('../../server');
const gameTunnel = require('../../actions/tunnels/gameTunnel');

router.get('/', (req, res) => {
  // Starting game instance
  instance.start();

  // Starting game tunnel
  gameTunnel();

  // Returning response
  res.end(JSON.stringify({ action: "start", status: "RUNNING" }));
});

module.exports = router;
const router     = require('express').Router();
const server     = require('../../actions/server/instance');
const gameTunnel = require('../../actions/tunnels/gameTunnel');

router.get('/', (req, res) => {
  // Starting game instance
  server.start();

  // Starting game tunnel
  gameTunnel();

  // Returning response
  res.end(JSON.stringify({ action: "serverStart", status: "RUNNING" }));
});

module.exports = router;
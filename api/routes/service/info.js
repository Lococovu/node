const router = require('express').Router();
const os     = require('os');

router.get('/', (req, res) => {
  res.end(JSON.stringify(
    {
      memory: {
        total: os.totalmem(),
        used: os.freemem()
      }
    }
  ));
});

module.exports = router;
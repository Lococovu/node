const router = require('express').Router();

router.get('/', (req, res) => {
  res.end("Hello there!");
});

module.exports = router;
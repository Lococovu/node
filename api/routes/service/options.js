const router  = require('express').Router();
const storage = require('../../storage');

router.get('/', (req, res) => {
  res.end(JSON.stringify(storage.get('config')));
});

module.exports = router;
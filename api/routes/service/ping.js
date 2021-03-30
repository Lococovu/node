const router = require('express').Router();

router.get('/', (req, res) => res.end("Pong!"));

module.exports = router;
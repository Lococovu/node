const Server  = require('./instance');
const storage = require('../storage');

const instance = new Server({
  core: {
    jar: './server.jar',
  }
});

instance.on('console', (line) => {
  storage.get('console').push(line).write();
});

module.exports = instance;
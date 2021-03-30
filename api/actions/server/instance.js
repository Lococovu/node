const Server  = require('scriptserver');
const storage = require('../../storage');

const game = new Server({
  core: {
    jar: './server.jar',
    // args: ['-Xmx2G'],
  }
});

game.on('console', (line) => {
  storage.get('console').push(line).write();
});

module.exports = game;
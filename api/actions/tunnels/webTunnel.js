const { spawn } = require('child_process');
const storage   = require('../../storage');

module.exports = (port) => {
  // Tunnel options
  let options = {
    subdomain: storage.get('config.node.subdomain')
  };

  if (!options.subdomain) return;
  const web = spawn('./pgrok', ['-log=stdout', '-config=tunnel', `-subdomain=${options.subdomain}`, '8080']);

  web.stdout.on('data', (data) => {
    console.log(`[WEB/${options.subdomain}] ${data}`);
  });
};
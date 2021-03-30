const { spawn } = require('child_process');
const storage   = require('../../storage');

module.exports = () => {
  const tunnel = spawn('./pgrok', ['-log=stdout', '-config=tunnel', `-proto=tcp`, '25565']);

  tunnel.stdout.on('data', (d) => {
    // Getting tunnel port
    let data = `${d}`;
    if (storage.get('config.server.port') == null || storage.get('config.server.address')) {
      let lines = data.split("\n");

      lines.forEach((line) => {
        if (line.includes("Tunnel established at")) {
          let prep = line.split("tcp://");

          storage
            .set('config.server', {
              port: prep[1].split(':')[1],
              address: `play.${prep[1]}`
            })
            .write();
        };
      });
    };

    if (storage.get('config.server.port') != null) console.log(`[TUNNEL/${storage.get('config.server.port')}] ${data}`);
  });
};
// 
// Packages
const server    = require('express')();
const { spawn } = require('child_process');

const git       = require('simple-git');
const SServer   = require('scriptserver');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
  console: []
}).write();

const game      = new SServer({
  core: {
    jar: './server.jar',
    args: ['-Xmx2G'],
  }
});

game.on('console', (line) => {
  db.get('console').push(line).write();
});

// 
// Options object
let options = {
  subdomain: process.env.subdomain,
  tunnel: {
    port: null,
    url: null
  }
};

// 
// REST-API
server.get('/', (req, res) => {
  res.end(JSON.stringify({ hello: "there" }));
});

server.get('/options', (req, res) => {
  res.end(JSON.stringify(options));
});

server.get('/start', (req, res) => {
  game.start();

  // And now let's open new pgrok connection
  const tunnel = spawn('./pgrok', ['-log=stdout', '-config=tunnel', `-proto=tcp`, '25565']);

  tunnel.stdout.on('data', (d) => {
    // Getting tunnel port
    let data = `${d}`;
    if (options.tunnel.port == null || options.tunnel.url == null) {
      let lines = data.split("\n");

      lines.forEach((line) => {
        if (line.includes("Tunnel established at")) {
          let prep = line.split("tcp://");
          options.tunnel.url  = `play.${prep[1]}`;
          options.tunnel.port = prep[1].split(':')[1];

          console.log('OPTIONS:');
          console.log(options);
        };
      });
    };

    // console.log(`[TUNNEL/${options.tunnel.port}] ${data}`);
  });

  res.end(JSON.stringify({ task: "startServer", status: "RUNNING" }));
});

server.get('/console', (req, res) => {
  res.end(JSON.stringify(db.get('console')));
});

// 
// Start web server and tunnel
server.listen(8080, () => {
  console.log("[WEB] Server listening on 8080");

  if (!options.subdomain) return;
  const web = spawn('./pgrok', ['-log=stdout', '-config=tunnel', `-subdomain=${options.subdomain}`, '8080']);

  web.stdout.on('data', (data) => {
    console.log(`[WEB/${options.subdomain}] ${data}`);
  });
});
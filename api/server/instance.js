const EventsEmitter = require('events');
const { spawn } = require('child_process');
const defaultsDeep = require('lodash.defaultsdeep');

const defaultConfig = {
  flavor: 'vanilla',
  core: {
    jar: 'minecraft_server.jar',
    args: ['-Xmx2G'],
    pipeIO: true,
    spawnOpts: {
      stdio: ['pipe', 'pipe', 'inherit'],
    },
  }
};

class Instance extends EventsEmitter {
  constructor(config = {}) {
    super();
    this.config = defaultsDeep({}, config, defaultConfig);
    this.modules = [];
    this.ready = false;

    process.on('exit', () => this.stop());
    process.on('close', () => this.stop());
  }

  start() {
    if (this.spawn) throw new Error('Server already started');

    const args = this.config.core.args.concat('-jar', this.config.core.jar, 'nogui');
    this.spawn = spawn('java', args, this.config.core.spawnOpts);

    if (this.config.core.pipeIO) {
      this.spawn.stdout.pipe(process.stdout);
      process.stdin.pipe(this.spawn.stdin);
    }

    this.spawn.stdout.on('data', (d) => {
      // Data handler
      d.toString().split('\n').forEach((l) => {
        if (l) {
          // Checking if server is started
          if (l.toLowerCase().includes('timings')) {
            this.ready = true;
          };

          // Emit console
          this.emit('console', l.trim());
        };
      });
    });

    return this;
  }

  isRunning() {
    return this.spawn ? true : false;
  }

  isReady() {
    return this.ready;
  }

  stop() {
    if (this.spawn) {
      this.spawn.kill();
      this.spawn = null;
    }

    return this;
  }

  use(module) {
    if (typeof module !== 'function') throw new Error('A module must be a function');

    if (this.modules.filter(m => m === module).length === 0) {
      this.modules.push(module);
      module.call(this);
    }

    return this;
  }

  send(command) {
    return new Promise((resolve) => {
      this.spawn.stdin.write(`${command}\n`, () => resolve());
    });
  }
}

module.exports = Instance;
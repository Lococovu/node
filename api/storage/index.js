const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
  config: {
    node: {
      subdomain: null,
    },
    server: {
      port: null,
      address: null
    }
  },
  console: []
}).write();

module.exports = db;
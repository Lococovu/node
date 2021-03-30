const storage = require('../storage');
const uuid4   = require('uuid4');

module.exports = (options) => {
  storage
    .set('config', {
      node: {
        subdomain: `${uuid4()}.service`
      }
    })
    .write();
};
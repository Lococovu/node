// Packages
const app            = require('express')();
const populateConfig = require('./api/config/populate');
const webTunnel      = require('./api/actions/tunnels/webTunnel');

const walk           = require('./api/helpers/walk.js');
const path           = require('path');

// Routes
walk('./api/routes', (error, files) => {
  files.forEach((element) => {
    let route = require(element);
    let filePath = path.relative(__dirname + '/api/routes', element);
    let url = filePath.split('.').shift();

    if (!url.includes("_")) {
      try {
        if (url.includes("index")) {
          url = path.dirname(filePath);
        };

        app.use(`/${url == "." ? "" : url}`, route)
      }

      // Lock at this! It's a very complicated logging system!1!!
      catch(error) {
        console.log(error);
      }
    }
  })
});
 
// Start web server and tunnel
app.listen(8080, () => {
  console.log("[WEB] Server listening on 8080");

  // Populating configs
  populateConfig();

  // Starting web tunnel
  webTunnel();
});
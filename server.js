const express = require('express');
const path = require('path');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const host = process.env.APP_HOST || 'localhost';
const port = process.env.PORT || 3000;
const bundler = require('./bundler');
const publicPath = path.resolve(__dirname, 'public');

if (!isProduction) {
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server
  app.all(['/assets/*', '*.hot-update.json'], (req, res) => {
    proxy.web(req, res, {
      target: `http://${host}:3001`,
    });
  });
  bundler();
}

app.use(express.static(publicPath));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

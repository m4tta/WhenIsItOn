const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3000;

const webpack = require('webpack');
const config = require('../webpack.config.dev');
const compiler = webpack(config);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ limit: '500kb', extended: false }));
app.use(bodyParser.json({limit: '500kb', strict: false}));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// Static files
app.use('/public', express.static(path.resolve(__dirname, '../public')))

// API endpoints
app.use('/api', require('./api/tv'));

// Catch all to send everything to the client-side to be handled.
app.get('*', function(req, res) {
  res.sendFile(path.resolve(__dirname, './views/index.dev.html'));
});

app.listen(PORT, function () {
  console.log('[Development Mode]');
  console.log(`Express app listening on port ${PORT}!`);
});

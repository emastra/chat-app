const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public') // __dirname equals to this file folder
const port = process.env.PORT || 3000;

var app = express();

app.use(express.static(publicPath));

app.listen(port, function() {
  console.log(`App is up on port ${port}`);
});

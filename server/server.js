const path = require('path');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000; //process.env.port is for heroku(3000 is for local)


var app = express();
app.use(express.static(publicPath));
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

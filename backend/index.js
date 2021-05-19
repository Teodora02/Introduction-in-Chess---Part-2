const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static('../frontend'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Started on http://localhost:${port}`);
});
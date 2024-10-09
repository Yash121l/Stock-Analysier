const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from my Node.js backend!');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
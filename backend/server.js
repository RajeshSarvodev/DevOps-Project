const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/message', (req, res) => {
  res.json({
    message: 'Backend running successfully from AWS EC2'
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
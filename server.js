const express = require('express');
const cors = require('cors');

const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();   

app.use(cors());
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

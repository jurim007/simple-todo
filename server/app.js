// server/app.js
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());          // allows requests from your React dev server (different origin)
app.use(express.json());  // parses JSON request bodies into req.body

app.use('/api/tasks', taskRoutes); // all routes above are now prefixed with /api/tasks
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
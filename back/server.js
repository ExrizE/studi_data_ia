const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db/db');
const initializeDatabase = require('./db/initialize');

// Import routes
const expensesRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');

// Setting up the express server
const app = express();
app.use(cors());
app.use(express.json());

// For now, let's check if our connection is working
db.connect()
  .then(obj => {
    obj.done(); // success, release the connection
    console.log('Database connected successfully!');
  })
  .catch(error => {
    console.log('ERROR:', error.message);
  });

// Call this function when your server starts
initializeDatabase()
    .then(() => console.log('Database initialized successfully'))
    .catch(error => console.log('ERROR:', error.message));

// ROUTES
app.use('/expenses', expensesRoutes);
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

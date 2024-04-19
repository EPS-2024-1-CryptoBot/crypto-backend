const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000; // Choose the port you want to use

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
// Define your routes here

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;

// Connect to MongoDB Atlas
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOSTNAME}/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Start the server after successfully connecting to the database
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB Atlas:', error);
  });
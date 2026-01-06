//include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log('Server running on port', port);
});

//Example Route: Get all malls
app.get('/allmalls', async (req, res) => {
  try {
    let connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM defaultdb.malls');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error for allmalls' });
  }
});

// Example Route: Create a new mall
app.post('/addmall', async (req, res) => {
  const { mall_name, mall_location } = req.body;
  try {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'INSERT INTO malls (mall_name, mall_location) VALUES (?, ?)',
      [mall_name, mall_location]
    );
    res.status(201).json({ message: 'Mall ' + mall_name + mall_location + ' added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error - could not add mall ' + mall_name + mall_location});
  }
});

// Update an existing mall
app.put('/malls/:id', async (req, res) => {
  const { mall_name, mall_location } = req.body;
  const { id } = req.params; // mall id in the URL

  try {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'UPDATE malls SET mall_name = ?, mall_location = ? WHERE id = ?',
      [mall_name, mall_location, id]
    );
    res.status(200).json({ message: 'Mall ' + id + ' updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error - could not update mall' + id });
  }
});

// Delete a mall
app.delete('/malls/:id', async (req, res) => {
  const { id } = req.params;

  try {
    let connection = await mysql.createConnection(dbConfig);
    await connection.execute(
      'DELETE FROM malls WHERE id = ?',
      [id]
    );
    res.status(200).json({ message: 'Mall ' + id + ' deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error - could not delete mall ' + id });
  }
});
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Note = require('./models/Note');

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });
  isConnected = true;
  console.log('MongoDB connected');
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.log('MongoDB error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('hello backend');
});

app.get('/api/notes', async (req, res) => {
  const allNotes = await Note.find();
  res.json(allNotes);
});

app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: 'invalid id' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'note not found' });
    res.json({ message: 'note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'invalid id' });
  }
});

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => {
    console.log('server runing');
  });
}
// const express = require('express');
// const app = express();
// app.use(express.json())

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/Note');
const app = express();
 const cors = require('cors');
  const note= require('./models/Note');

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err.message));

 




// app.get('/',(req, res)=>{
//     res.send('hello backend')
// });

app.get('/api/hello',(req,res)=>{
    res.json({message: 'from api hello'});
});

// app.get('/api/about',(req,res)=>{
//     res.json({name:'saba', role : 'frontend developer'})
// });

let notes = [
  { id: 1, title: 'saba', description: 'first note' },
  { id: 2, title: 'ahmad', description: 'second note' },
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes', async (req, res) => {
  const allNotes = await Note.find();
  res.json(allNotes);
});

app.post('/api/notes', async (req, res) => {
  const note = await Note.create({
    title: req.body.title,
    description: req.body.description,
  });
  res.status(201).json(note);
});

// app.post('/api/notes',(req, res)=>{
//     const newnotes= req.body;
//     notes.push(newnotes);
//     res.status(201).json(newnotes);
// });

app.get('/api/notes/:id',(req,res)=>{
    const id =Number(req.params.id);
    const note = notes.find((n)=>n.id===id);

    if(!note){
        return res.status(404).json({message: 'note not found'});
    }
    res.json(note);
})

// app.delete('/api/notes/:id',(req, res)=>{
//     let id =Number(req.params.id);
//    let  note = notes.find((n)=>n.id===id);

//    if(!note){
//     return res.status(404).json({message: 'not founed'});
//    }

//    notes=notes.filter((n)=>n.id !== id);
//    res.json({message:'deleted'})
// })


app.delete('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'note not found' });
    }

    res.json({ message: 'note deleted' });
  } catch (err) {
    res.status(400).json({ message: 'invalid id' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, description: req.body.description },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'note not found' });
    }

    res.json(note);
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


// app.listen(3000, ()=>{
//     console.log('server runing')
// });







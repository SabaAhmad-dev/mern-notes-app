import { useEffect, useState } from 'react';

const API = 'http://localhost:3000';

function App() {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const loadNotes = () => {
    fetch(`${API}/api/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data));
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const addNote = async (e) => {
    e.preventDefault();

    await fetch(`${API}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    setTitle('');
    setDescription('');
    loadNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/api/notes/${id}`, { method: 'DELETE' });
    loadNotes();
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditDescription(note.description || '');
  };

  const saveEdit = async (id) => {
    await fetch(`${API}/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    });

    setEditingId(null);
    loadNotes();
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="container">
      <div className="header">
        <h1>My Notes</h1>
        <p>{notes.length} notes saved in MongoDB</p>
      </div>

      <form className="note-form" onSubmit={addNote}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          + Add Note
        </button>
      </form>

      {notes.length === 0 && <p className="empty">Abhi koi note nahi hai</p>}

      {notes.map((note) => (
        <div className="note-card" key={note._id}>
          {editingId === note._id ? (
            <div>
              <div className="edit-fields">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div className="actions">
                <button className="btn-primary" onClick={() => saveEdit(note._id)}>
                  Save
                </button>
                <button className="btn-cancel" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              {note.createdAt && (
                <span className="date">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              )}
              <div className="actions">
                <button className="btn-edit" onClick={() => startEdit(note)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
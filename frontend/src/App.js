import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", subject: "" });
  const [auth, setAuth] = useState({ email: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  /* ================= AUTH ================= */

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, auth);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  const register = async () => {
    try {
      await axios.post(`${API}/register`, auth);
      alert("Registered! Now login.");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  /* ================= NOTES ================= */

  const fetchNotes = async () => {
    if (!token) return;

    const res = await axios.get(`${API}/notes`, {
      headers: { Authorization: token }
    });

    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const addOrUpdateNote = async () => {
    try {
      if (editingId) {
        await axios.put(`${API}/notes/${editingId}`, form, {
          headers: { Authorization: token }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/notes`, form, {
          headers: { Authorization: token }
        });
      }

      setForm({ title: "", content: "", subject: "" });
      fetchNotes();
    } catch {
      alert("Error saving note");
    }
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, {
      headers: { Authorization: token }
    });
    fetchNotes();
  };

  const startEdit = (note) => {
    setForm({
      title: note.title,
      content: note.content,
      subject: note.subject
    });
    setEditingId(note._id);
  };

  /* ================= LOGIN UI ================= */

  if (!token) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>Login</h2>

          <input
            style={styles.input}
            placeholder="Email"
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />

          <button style={styles.primary} onClick={login}>Login</button>
          <button style={styles.secondary} onClick={register}>Register</button>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div style={styles.center}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1>My Notes</h1>
          <button style={styles.logout} onClick={logout}>Logout</button>
        </div>

        <input
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <input
          style={styles.input}
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <button style={styles.primary} onClick={addOrUpdateNote}>
          {editingId ? "Update Note" : "Add Note"}
        </button>

        {notes.length === 0 && <p>No notes yet 🚀</p>}

        {notes.map((n) => (
          <div key={n._id} style={styles.note}>
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <small>{n.subject}</small>

            <div style={styles.actions}>
              <button style={styles.edit} onClick={() => startEdit(n)}>Edit</button>
              <button style={styles.delete} onClick={() => deleteNote(n._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px"
  },
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  primary: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer"
  },
  secondary: {
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer"
  },
  logout: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  note: {
    marginTop: "15px",
    padding: "15px",
    borderRadius: "10px",
    background: "#f8f9fa",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between"
  },
  edit: {
    background: "#ffc107",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  },
  delete: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default App;
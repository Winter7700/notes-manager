const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  subject: String
});

const Note = mongoose.model("Note", NoteSchema);

// Routes
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.json(note);
});

app.put("/notes/:id", async (req, res) => {
  const updated = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
  res.json(updated);
});

app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({msg: "Deleted"});
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running");
});
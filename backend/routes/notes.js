const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Note = require('../models/Note');

// Create note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const note = new Note({ user: req.user.id, title, content, tags });
    await note.save();
    res.json(note);
  } catch (err) { res.status(500).send('Server error'); }
});

// Get notes (with optional query: tag, search, pinned)
router.get('/', auth, async (req, res) => {
  try {
    const { tag, q, pinned } = req.query;
    const filter = { user: req.user.id };
    if (tag) filter.tags = tag;
    if (pinned === 'true') filter.isPinned = true;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } }
    ];
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) { res.status(500).send('Server error'); }
});

// Get single note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Note not found' });
    res.json(note);
  } catch (err) { res.status(500).send('Server error'); }
});

// Update note
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Note not found' });
    const updates = ['title','content','tags','isPinned','isArchived'].reduce((acc,key)=>{
      if (req.body[key] !== undefined) acc[key] = req.body[key];
      return acc;
    }, {});
    Object.assign(note, updates);
    await note.save();
    res.json(note);
  } catch (err) { res.status(500).send('Server error'); }
});


// Delete note (HARD FIX)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedNote) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    res.json({ msg: 'Note deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;

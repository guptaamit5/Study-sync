const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  sourceType: { 
    type: String, 
    default: "notes" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Summary", summarySchema);

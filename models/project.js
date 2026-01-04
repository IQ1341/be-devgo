import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  phase: String,
  status: { type: String, enum: ["pending", "active", "completed"], default: "pending" },
  date: String
});

const teamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  avatar: String
});

const documentSchema = new mongoose.Schema({
  name: String,
  size: String,
  url: String
});

const projectSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  title: String,
  client: String,
  status: { type: String, enum: ["Planning", "On Progress", "Selesai"], default: "Planning" },
  progress: { type: Number, default: 0 },
  description: String,
  duration: String,
  team: String,
  deadline: String,
  budget: String,
  email: String,
  phone: String,
  timeline: [timelineSchema],
  technologies: [String],
  team_members: [teamMemberSchema],
  documents: [documentSchema]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);

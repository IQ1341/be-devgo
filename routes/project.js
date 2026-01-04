import express from "express";
import Project from "../models/project.js";

const router = express.Router();

// Fungsi generate kode unik berdasarkan timestamp
const generateProjectCode = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `DEVGO-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
};

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET project by code
router.get("/code/:code", async (req, res) => {
  try {
    const project = await Project.findOne({ code: req.params.code });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new project
router.post("/", async (req, res) => {
  try {
    const { client, contact, service, deadline, description } = req.body;

    // Generate kode unik
    let code;
    let exists = true;
    while (exists) {
      code = generateProjectCode();
      exists = await Project.findOne({ code });
    }

    const newProject = new Project({
      code,
      title: service,
      email: "muhammadiqb4l03@gmail.com",
      phone: "08884913919",
      client,
      contact,
      description,
      deadline,
      status: "Planning",
      progress: 0,
      team: 1,
      team_members: [
        { name: "Muhammad Iqbal", role: "Project Manager", avatar: "👨‍💼" }
      ],
      timeline: [
        { phase: "plening awal", status: "pending", date: "_" },
      ],
      technologies: [],
      documents: []
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

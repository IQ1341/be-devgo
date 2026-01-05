import express from "express";
import Project from "../models/project.js";

const router = express.Router();

// Fungsi generate kode unik
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
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error("❌ Error:", err);
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
    console.error("❌ Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST new project
router.post("/", async (req, res) => {
  try {
    const { client, contact, service, deadline, description } = req.body;

    if (!client || !service) {
      return res.status(400).json({ 
        message: "Client dan Service wajib diisi" 
      });
    }

    let code;
    let exists = true;
    while (exists) {
      code = generateProjectCode();
      exists = await Project.findOne({ code });
    }

    const newProject = new Project({
      code,
      title: service,
      service,
      email: "muhammadiqb4l03@gmail.com",
      phone: "08884913919",
      client,
      contact,
      description: description || "",
      deadline: deadline || "",
      duration: "",
      budget: "",
      status: "Planning",
      progress: 0,
      team: "",
      team_members: [
        { name: "Muhammad Iqbal", role: "Project Manager", avatar: "👨‍💼" }
      ],
      timeline: [
        { phase: "Planning Awal", status: "pending", date: new Date().toISOString().split('T')[0] }
      ],
      technologies: [],
      documents: []
    });

    const savedProject = await newProject.save();
    console.log("✅ Project created:", savedProject.code);
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update project by code - ✅ SIMPLIFIED
router.put("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const updateData = req.body;

    // Cari project
    const project = await Project.findOne({ code });
    
    if (!project) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }

    // Update basic fields
    const basicFields = [
      'title', 'service', 'client', 'contact', 'email', 'phone',
      'description', 'status', 'deadline', 'duration', 'budget', 'team'
    ];

    basicFields.forEach(field => {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        project[field] = updateData[field];
      }
    });

    // Update progress dengan validasi
    if (updateData.progress !== undefined) {
      const progress = Number(updateData.progress);
      if (progress < 0 || progress > 100) {
        return res.status(400).json({ 
          message: "Progress harus antara 0-100" 
        });
      }
      project.progress = progress;

      // Auto update status
      if (progress === 100) {
        project.status = "Selesai";
      } else if (progress > 0) {
        project.status = "On Progress";
      } else {
        project.status = "Planning";
      }
    }

    // ✅ Update arrays - GANTI SELURUH ARRAY
    if (Array.isArray(updateData.team_members)) {
      console.log("📝 Updating team_members:", updateData.team_members.length, "items");
      project.team_members = updateData.team_members;
    }

    if (Array.isArray(updateData.timeline)) {
      console.log("📝 Updating timeline:", updateData.timeline.length, "items");
      project.timeline = updateData.timeline;
    }

    if (Array.isArray(updateData.technologies)) {
      console.log("📝 Updating technologies:", updateData.technologies.length, "items");
      project.technologies = updateData.technologies;
    }

    if (Array.isArray(updateData.documents)) {
      console.log("📝 Updating documents:", updateData.documents.length, "items");
      project.documents = updateData.documents;
    }

    // Save project
    const updatedProject = await project.save();

    console.log("✅ Project saved successfully");
    console.log("📊 Final state:");
    console.log("   - Title:", updatedProject.title);
    console.log("   - Team Members:", updatedProject.team_members.length);
    console.log("   - Timeline:", updatedProject.timeline.length);
    console.log("   - Technologies:", updatedProject.technologies.length);
    console.log("   - Documents:", updatedProject.documents.length);
    console.log("=========================================\n");

    res.json(updatedProject);
  } catch (err) {
    console.error("\n❌ ============ UPDATE ERROR ============");
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);
    console.error("=========================================\n");
    res.status(500).json({ message: err.message });
  }
});

// PATCH update partial
router.patch("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const updateData = req.body;

    console.log("📝 Patch update for:", code);

    const project = await Project.findOneAndUpdate(
      { code },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("❌ Patch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE project
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const project = await Project.findOneAndDelete({ code });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("✅ Project deleted:", code);
    res.json({ 
      message: "Project berhasil dihapus",
      deletedProject: project 
    });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const total = await Project.countDocuments();
    const completed = await Project.countDocuments({ status: "Selesai" });
    const onProgress = await Project.countDocuments({ status: "On Progress" });
    const planning = await Project.countDocuments({ status: "Planning" });

    const projects = await Project.find();
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
      : 0;

    res.json({
      total,
      completed,
      onProgress,
      planning,
      avgProgress
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST add team member
router.post("/:code/team", async (req, res) => {
  try {
    const { code } = req.params;
    const { name, role, avatar } = req.body;

    if (!name || !role) {
      return res.status(400).json({ 
        message: "Name dan role wajib diisi" 
      });
    }

    const project = await Project.findOne({ code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.team_members.push({
      name,
      role,
      avatar: avatar || "👤"
    });

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("❌ Add team member error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST add timeline
router.post("/:code/timeline", async (req, res) => {
  try {
    const { code } = req.params;
    const { phase, status, date } = req.body;

    if (!phase) {
      return res.status(400).json({ 
        message: "Phase wajib diisi" 
      });
    }

    const project = await Project.findOne({ code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.timeline.push({
      phase,
      status: status || "pending",
      date: date || new Date().toISOString().split('T')[0]
    });

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("❌ Add timeline error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST add technology
router.post("/:code/technologies", async (req, res) => {
  try {
    const { code } = req.params;
    const { technology } = req.body;

    if (!technology) {
      return res.status(400).json({ 
        message: "Technology wajib diisi" 
      });
    }

    const project = await Project.findOne({ code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.technologies.includes(technology)) {
      project.technologies.push(technology);
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(400).json({ message: "Technology sudah ada" });
    }
  } catch (err) {
    console.error("❌ Add technology error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST add document
router.post("/:code/documents", async (req, res) => {
  try {
    const { code } = req.params;
    const { name, url, type } = req.body;

    if (!name || !url) {
      return res.status(400).json({ 
        message: "Name dan URL wajib diisi" 
      });
    }

    const project = await Project.findOne({ code });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.documents.push({
      name,
      url,
      type: type || "other",
      uploadedAt: new Date()
    });

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("❌ Add document error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
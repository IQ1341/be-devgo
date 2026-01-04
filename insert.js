import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./models/project.js";

dotenv.config();

const projects = [
  {
    code: "DEVGO-2026-001",
    title: "Website Company Profile Premium",
    client: "PT. Teknologi Maju Bersama",
    status: "On Progress",
    progress: 65,
    description: "Pengembangan website company profile...",
    duration: "3 Bulan",
    team: "6 Orang",
    deadline: "15 Mar 2026",
    budget: "Rp 75 Jt",
    email: "pm.webapp@devgo.id",
    phone: "+62 812-3456-7890",
    timeline: [
      { phase: "Planning & Design", status: "completed", date: "05 Jan - 15 Jan 2026" },
      { phase: "UI/UX Development", status: "completed", date: "16 Jan - 30 Jan 2026" },
      { phase: "Backend Development", status: "active", date: "01 Feb - 20 Feb 2026" }
    ],
    technologies: ["React", "Node.js", "MongoDB"],
    team_members: [
      { name: "Budi Santoso", role: "Project Manager", avatar: "👨‍💼" },
      { name: "Ani Wijaya", role: "UI/UX Designer", avatar: "👩‍🎨" }
    ],
    documents: [
      { name: "Project Brief.pdf", size: "2.4 MB", url: "/docs/project-brief.pdf" }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Project.deleteMany({});
    await Project.insertMany(projects);
    console.log("✅ Projects inserted");
    mongoose.disconnect();
  })
  .catch(err => console.error(err));

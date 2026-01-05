import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  phase: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  date: String
}, { _id: false });

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "👤"
  }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "other"
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const projectSchema = new mongoose.Schema(
  {
    // Identitas Project
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      trim: true
    },

    // Informasi Client
    client: {
      type: String,
      required: true,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },

    // Deskripsi & Status
    description: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["Planning", "On Progress", "Selesai"],
      default: "Planning"
    },

    // Progress & Timeline
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    deadline: {
      type: String,
      default: ""
    },
    duration: {
      type: String,
      default: ""
    },

    // Budget & Team
    budget: {
      type: String,
      default: ""
    },
    team: {
      type: String,
      default: ""
    },

    // Team & Timeline Data
    team_members: [teamMemberSchema],
    timeline: [timelineSchema],

    // Technologies & Documents
    technologies: [
      {
        type: String,
        trim: true
      }
    ],
    documents: [documentSchema]
  },
  {
    timestamps: true
  }
);

// Update timestamp sebelum save
projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Project", projectSchema);
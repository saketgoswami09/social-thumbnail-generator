import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to ALL routes in this file
router.use(protect);

// Route to create a new project
// POST /api/projects
router.post("/", createProject);
router.get("/", getProjects);
router.patch("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;

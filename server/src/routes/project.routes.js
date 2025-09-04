const express = require("express");
const router = express.Router();
const projectController = require("../controllers/project.controller");
const authMiddleware = require("../middleware/auth.middleware");

// This line applies the authentication middleware to ALL routes defined in this file.
// No one can access any project routes without a valid token.
router.use(authMiddleware);

// Route to create a new project
// POST /api/projects
router.post("/", projectController.createProject);
router.get("/", projectController.getProjects);

router.patch("/:id", projectController.updateProject);

router.delete("/:id", projectController.deleteProject);

module.exports = router;

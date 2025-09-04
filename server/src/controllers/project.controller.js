const Project = require("../models/project.model");
const { z } = require("zod");

// Schema for validating the "create project" request body
const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  platform: z.enum(["youtube", "instagram", "twitter"]),
});

const createProject = async (req, res) => {
  try {
    const { name, platform } = createProjectSchema.parse(req.body);

    const newProject = new Project({
      name,
      platform,
      user: req.user.id, // This is the ID of the logged-in user from the auth middleware
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(projects);
  } catch (error) {}
};

const updateProject = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id,
      },
      {
        name,
      },
      {
        new: true,
      }
    );

    if (!project) {
      return res
        .status(404)
        .json({ message: "project not found or yser not authorised" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the project by its ID AND the logged-in user's ID
    const project = await Project.findOneAndDelete({ _id: id, user: req.user.id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or user not authorized' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };

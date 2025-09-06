import Project from "../models/Project.js";
import { z } from "zod";

// Schema for validating the "create project" request body
const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  platform: z.enum(["youtube", "instagram", "twitter"]),
});

export const createProject = async (req, res) => {
  try {
    const { name, platform } = createProjectSchema.parse(req.body);

    const newProject = new Project({
      name,
      platform,
      user: req.user.id, // from auth middleware
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

export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilter = { user: req.user.id };

    const [projects, total] = await Promise.all([
      Project.find(queryFilter).sort({ createdAt: -1 }).limit(limit).skip(skip),
      Project.countDocuments(queryFilter),
    ]);

    res.status(200).json({
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error while fetching projects." });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const project = await Project.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { name },
      { new: true }
    );

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or user not authorized" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or user not authorized" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

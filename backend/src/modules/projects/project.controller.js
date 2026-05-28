const projectService = require('./project.service');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('./project.validation');

// Create Project
const createProject = async (req, res, next) => {
  try {

    const { error } = createProjectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const project = await projectService.createProject(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });

  } catch (err) {
    next(err);
  }
};

// Get All Projects
const getProjects = async (req, res, next) => {
  try {

    const projects = await projectService.getProjects();

    res.json({
      success: true,
      data: projects,
    });

  } catch (err) {
    next(err);
  }
};

// Get Project By ID
const getProjectById = async (req, res, next) => {
  try {

    const project = await projectService.getProjectById(req.params.id);

    res.json({
      success: true,
      data: project,
    });

  } catch (err) {
    next(err);
  }
};

// Update Project
const updateProject = async (req, res, next) => {
  try {

    const { error } = updateProjectSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const project = await projectService.updateProject(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: project,
    });

  } catch (err) {
    next(err);
  }
};

// Delete Project
const deleteProject = async (req, res, next) => {
  try {

    const result = await projectService.deleteProject(req.params.id);

    res.json(result);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
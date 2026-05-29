const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create Project
const createProject = async ({
  name,
  description,
  vendorId,
  deadline,
  status,
  progress,
}) => {

  // Check Vendor
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorId,
    },
  });

  if (!vendor) {
    throw createError('Vendor not found.', 404);
  }

  // Generate Project ID
  const count = await prisma.project.count();

  const projectDisplayId =
    `AA-PRJ-${String(count + 1).padStart(4, '0')}`;

  const project = await prisma.project.create({
    data: {
      name,
      description,
      vendorId,

      // Normalize date before Prisma
      deadline: deadline ? new Date(deadline) : null,

      status: status || 'PLANNING',
      progress: progress || 0,

      projectDisplayId,
    },

    include: {
      vendor: true,
    },
  });

  return project;
};


// Get All Projects
const getProjects = async () => {
  return prisma.project.findMany({
    include: {
      vendor: true,
      tasks: true,
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
};


// Get Single Project
const getProjectById = async (id) => {

  const project = await prisma.project.findUnique({
    where: {
      id,
    },

    include: {
      vendor: true,
      tasks: {
        include: {
          assignedTo: true,
        },
      },
    },
  });

  if (!project) {
    throw createError('Project not found.', 404);
  }

  return project;
};

// Update Project
const updateProject = async (id, data) => {

  const existing = await prisma.project.findUnique({
    where: { id },
  });

  if (!existing) {
    throw createError('Project not found.', 404);
  }

  return prisma.project.update({
    where: { id },
    data: {
      ...data,

      // Convert date string to Date object
      deadline: data.deadline
        ? new Date(data.deadline)
        : null,
    },
  });
};

// Delete Project
const deleteProject = async (id) => {

  const existing = await prisma.project.findUnique({
    where: { id },
  });

  if (!existing) {
    throw createError('Project not found.', 404);
  }

  await prisma.project.delete({
    where: { id },
  });

  return {
    success: true,
    message: 'Project deleted successfully.',
  };
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
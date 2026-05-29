const Joi = require('joi');

const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  description: Joi.string().allow('', null),

  vendorId: Joi.string().required(),

  deadline: Joi.date().optional(),

  status: Joi.string().valid(
    'PLANNING',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'CANCELLED'
  ).optional(),

  progress: Joi.number().min(0).max(100).optional()
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100),

  description: Joi.string().allow('', null),

  vendorId: Joi.string(),

  deadline: Joi.date(),

  status: Joi.string().valid(
    'PLANNING',
    'ACTIVE',
    'ON_HOLD',
    'COMPLETED',
    'DELAYED',
    'CANCELLED'
  ),

  progress: Joi.number().min(0).max(100)
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
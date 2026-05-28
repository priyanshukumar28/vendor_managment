const Joi = require('joi');

const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  description: Joi.string().allow('', null),

  vendorId: Joi.string().required(),

  deadline: Joi.date().optional(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100),

  description: Joi.string().allow('', null),

  status: Joi.string().valid(
    'PENDING',
    'IN_PROGRESS',
    'ON_HOLD',
    'COMPLETED',
    'DELAYED'
  ),

  deadline: Joi.date(),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
};
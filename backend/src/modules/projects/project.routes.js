const express = require('express');

const router = express.Router();

const controller = require('./project.controller');

const {
    authenticate,
    authorize,
  ROLES,
} = require('../auth');

/** 
* @swagger 
* tags: 
*name: Projects 
* description: Project management APIs 
*/

/** 
* @swagger 
* /projects: 
*       post: 
*           summary: Create a new project 
*           tags: [Projects] 
*           security: 
*               - bearerAuth: [] 
*           requestBody: 
*               required: true 
*               content: 
*                    application/json: 
*                        schema: 
*                           type: object 
*                           required: 
*                               - name 
*                               - vendorId 
*                            properties: 
*                                name: 
*                                   type: string 
*                                description:  
*                                   type: string 
*                                vendorId: 
*                                   type: string 
*                                deadline: 
*                                   type: string 
*                                   format: date 
* responses: 
*   201: 
*       description: Project created successfully 
*/

/** 
* @swagger 
* /projects: 
*   get: 
*       summary: Get all projects 
*       tags: [Projects] 
*       security: 
*           - bearerAuth: [] 
*       responses: 
*           200: 
*               description: Projects fetched successfully 
*/

/** 
*  @swagger 
* /projects/{id}: 
*   get: 
*       summary: Get project by ID 
*       tags: [Projects] 
*       security: 
*           - bearerAuth: [] 
*       parameters: 
*           - in: path 
*           name: id 
*           required: true 
*           schema: 
*                type: string 
*   responses: 
*       200: 
*           description: Project fetched successfully 
*/

/** 
* @swagger 
* /projects/{id}: 
*   put: 
*       summary: Update project 
*       tags: [Projects] 
*       security: 
*           - bearerAuth: [] 
*       parameters: 
*           - in: path 
*           name: id 
*           required: true 
*           schema: 
*               type: string 
*           requestBody: 
*                required: true 
*                content: 
*                    application/json: 
*                       schema: 
*                           type: object 
*                           properties: 
*                               name: 
*                                    type: string 
*                               description: 
*                                    type: string 
*                               status: 
*                                    type: string 
*                               deadline: 
*                                    type: string 
*                                    format: date 
*   responses: 
*      200: 
*         description: Project updated successfully 
*/

/**
*  @swagger 
* /projects/{id}: 
*    delete: 
*        summary: Delete project 
*        tags: [Projects] 
*        security: 
*            - bearerAuth: [] 
*        parameters: 
*            - in: path 
*              name: id 
*              required: true 
*              schema: 
*                  type: string 
*        responses: 
*              200: 
*                 description: Project deleted successfully 
*/

// Create Project
router.post(
  '/',
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.VENDOR_ADMIN
  ),
  controller.createProject
);

// Get All Projects
router.get(
  '/',
  authenticate,
  controller.getProjects
);

// Get Single Project
router.get(
  '/:id',
  authenticate,
  controller.getProjectById
);

// Update Project
router.put(
  '/:id',
  authenticate,
  authorize(
    ROLES.SUPER_ADMIN,
    ROLES.VENDOR_ADMIN
  ),
  controller.updateProject
);

// Delete Project
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN),
  controller.deleteProject
);

module.exports = router;
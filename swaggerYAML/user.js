/* istanbul ignore file */

// Define schema
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userID:
 *           type: string
 *           required: true
 *         userName:
 *           type: string
 *         password:
 *           type: string
 *         phone:
 *           type: string
 *         avatar:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: object
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Define schema for response/requestBody/parameters api
/**
 * @swagger
 * definitions:
 *   requestBodyLogin:
 *     required:
 *       - userName
 *       - password
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 *
 *   responseLogin:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *       data:
 *         type: object
 *         properties:
 *           userID:
 *             type: string
 *           userName:
 *             type: string
 *           phone:
 *             type: string
 *           email:
 *            type: string
 *           avatar:
 *            type: string
 *           role:
 *             type: object
 *           accessToken:
 *             type: string
 *       error:
 *         type: string
 *
 *   requestBodyRegister:
 *     required:
 *       - userName
 *       - password
 *     properties:
 *       userName:
 *         type: string
 *       password:
 *         type: string
 *       phone:
 *         type: string
 *       email:
 *         type: string
 *       avatar:
 *         type: string
 *
 *   responseRegister:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *       data:
 *         type: object
 *         properties:
 *           userID:
 *             type: string
 *           userName:
 *             type: string
 *           phone:
 *             type: string
 *           email:
 *            type: string
 *           avatar:
 *            type: string
 *           role:
 *             type: object
 *           accessToken:
 *             type: string
 *       error:
 *         type: string
 *
 *   responseRefreshToken:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *       data:
 *         type: object
 *         properties:
 *           accessToken:
 *             type: string
 *       error:
 *         type: string
 *
 */

// Define tags
/**
 * @swagger
 * tags:
 *   name: Authentication
 */

// Define api
/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/requestBodyLogin'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/responseLogin'
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/requestBodyRegister'
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/responseRegister'
 */

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/refreshToken:
 *   get:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/responseRefreshToken'
 */

/**
 * @swagger
 * /api/resetPassword:
 *   post:
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/* istanbul ignore file */

// Define schema for response/requestBody/parameters api
/**
 * @swagger
 * definitions:
 *   requestUpdateAvatar:
 *     type: object
 *     properties:
 *       file:
 *         type: string
 *         format: binary
 *
 *   responseUpdateAvatar:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 *       data:
 *         type: object
 *         properties:
 *           avatar:
 *             type: string
 *       error:
 *         type: string
 *
 */

// Define tags
/**
 * @swagger
 * tags:
 *   name: Image
 */

// Define api
/**
 * @swagger
 * /api/updateAvatar:
 *   post:
 *     tags: [Image]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/requestUpdateAvatar'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/responseUpdateAvatar'
 */

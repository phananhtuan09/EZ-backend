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
 *       userID:
 *         type: string
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
 *   requestForgotPassword:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *
 *   responseForgotPassword:
 *     type: object
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 *       data:
 *         type: object
 *       error:
 *         type: string
 *
 *
 *   requestVerifyOtpForgotPassword:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       otp:
 *         type: string
 *
 *   responseVerifyOtpForgotPassword:
 *     type: object
 *     properties:
 *       success:
 *         type: boolean
 *       data:
 *         type: object
 *         properties:
 *           userID:
 *             type: string
 *           accessToken:
 *             type: string

 *
 *       error:
 *         type: string
 *
 */

// Define tags
/**
 * @swagger
 * tags:
 *   name: User
 */

// Define api
/**
 * @swagger
 * /api/updateAvatar:
 *   post:
 *     tags: [User]
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

/**
 * @swagger
 * /api/forgotPassword:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/requestForgotPassword'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#definitions/responseForgotPassword'
 *
 */

/**
 * @swagger
 * /api/verifyOtpForgotPassword:
 *   post:
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/requestVerifyOtpForgotPassword'
 *
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/responseVerifyOtpForgotPassword'
 *
 */

import express from 'express';
const router = express.Router();

const controller = require('../controllers/refreshToken.controller');

router.get('/', controller.refreshToken);

export default router;

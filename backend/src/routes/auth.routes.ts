import express from 'express';
const router = express.Router();

const controller = require('../controllers/auth.controller');

router.get('/me', controller.me);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

export default router;

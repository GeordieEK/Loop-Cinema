import express from 'express';
const router = express.Router();

const controller = require('../controllers/token.controller');

router.get('/', controller.all);
router.get('/:id', controller.one);
router.post('/', controller.create);

export default router;

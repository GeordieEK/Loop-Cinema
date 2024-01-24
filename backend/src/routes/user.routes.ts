import express from 'express';
const controller = require('../controllers/user.controller');

const protectedRouter = express.Router();
const unprotectedRouter = express.Router();

// Unprotected routes
unprotectedRouter.post('/', controller.create);
unprotectedRouter.get('/exists/:email', controller.exists)

// Protected routes
protectedRouter.get('/', controller.all);
protectedRouter.get('/:id', controller.one);
protectedRouter.put('/:id', controller.update);
protectedRouter.delete('/:id', controller.remove);

export { protectedRouter, unprotectedRouter };

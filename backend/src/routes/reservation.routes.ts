import express from "express";
const router = express.Router();

const controller = require('../controllers/reservation.controller');

router.get('/', controller.all);
// router.get("/:id", controller.one);
router.get('/available', controller.allAvailable);
router.get('/available/:id', controller.available);
router.get('/user/:id', controller.user);

router.post('/', controller.create);

export default router;
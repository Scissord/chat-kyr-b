import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as controller from '../controllers/userController.js';

const router = express.Router();

router.post("", protectRoute, controller.get);

export default router;

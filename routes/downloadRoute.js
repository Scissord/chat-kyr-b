import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as controller from '../controllers/downloadController.js';

const router = express.Router();

router.post("/file", protectRoute, controller.download);

export default router;

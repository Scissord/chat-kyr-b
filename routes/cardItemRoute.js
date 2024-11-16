import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as controller from '../controllers/cardItemController.js';

const router = express.Router();

router.patch("/:card_item_id", protectRoute, controller.updateCardItem);

export default router;

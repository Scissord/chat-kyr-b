import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as controller from '../controllers/cardController.js';

const router = express.Router();

router.get("/:card_id", protectRoute, controller.getCard);
router.post("/:column_id", protectRoute, controller.createCard);
router.patch("/:card_id/move", protectRoute, controller.moveCard);
router.patch("/:card_id/toggle_fix", protectRoute, controller.toggleFixCard);
router.delete("/:card_id", protectRoute, controller.deleteCard);

export default router;

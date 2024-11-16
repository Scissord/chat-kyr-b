import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import * as controller from '../controllers/boardController.js';

const router = express.Router();

router.get("/columns", protectRoute, controller.getColumns);
router.post("/cards", protectRoute, controller.getCards);
router.post("/more-cards", protectRoute, controller.getMoreCards);
router.post("/get_customer_info", protectRoute, controller.getCustomerInfo);
router.post("/cache", controller.cacheBoard);

export default router;

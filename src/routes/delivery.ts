import { Router } from "express";
import * as deliveryController from '../controllers/delivery';


const router = Router();

router.get("/", deliveryController.getAllDeliveries);
router.get("/:id", deliveryController.getDeliveryById);
router.post("/", deliveryController.createDelivery); 
router.put("/:id", deliveryController.updateDelivery);
router.delete("/:id", deliveryController.deleteDelivery);

export default router;
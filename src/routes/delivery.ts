import { Router } from "express";
import * as deliveryController from '../controllers/delivery';
import { PackageValidator } from '../middleware/inputValidator';


const router = Router();

router.get("/", deliveryController.getAllDeliveries);
router.get("/:id", deliveryController.getDeliveryById);
router.post("/", PackageValidator.validateCreateDelivery, deliveryController.createDelivery); 
router.put("/:id", deliveryController.updateDelivery);
router.delete("/:id", deliveryController.deleteDelivery);

export default router;
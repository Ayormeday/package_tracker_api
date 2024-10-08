import express from "express";
import authRoutes from "./auth";
import packageRoutes from "./package";
import deliveryRoutes from "./delivery"

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the package tracker application!");
});

router.use(`/api/auth`, authRoutes);
router.use(`/api/package`, packageRoutes);
router.use(`/api/delivery`, deliveryRoutes);

export default router;

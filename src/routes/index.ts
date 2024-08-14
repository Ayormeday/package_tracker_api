import express from "express";
import authRoutes from "./auth";
import packageRoutes from "./package";


const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the application!");
});

router.use(`/auth`, authRoutes);
router.use(`/delivery`, packageRoutes);

export default router;

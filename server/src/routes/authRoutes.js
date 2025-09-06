import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

// Debugging (optional)
console.log("--- FROM ROUTER --- Functions imported:", { register, login, getMe });

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;

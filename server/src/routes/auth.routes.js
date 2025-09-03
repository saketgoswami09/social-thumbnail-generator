const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middleware/auth.middleware');
console.log('--- FROM ROUTER --- Keys being imported:', Object.keys(authController));


router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.getMe); 

module.exports = router;

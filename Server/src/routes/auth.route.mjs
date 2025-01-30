import express from 'express'
import { Router } from 'express'
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.mjs'
import { protect } from '../middleware/auth.middleware.mjs'
import multer from 'multer'
const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protect, upload.single("profileImage"), updateProfile);
router.get('/check', protect, checkAuth);
export default router;
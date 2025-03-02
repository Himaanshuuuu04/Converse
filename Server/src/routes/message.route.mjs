import express from 'express'
import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.mjs'
import { getUsersForSideBar, getMessages, sendMessage,getAiResponse } from '../controllers/message.controller.mjs'
import multer from 'multer'
import { get } from 'mongoose'
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.get('/users', protect, getUsersForSideBar);
router.get('/:id', protect, getMessages);
router.post('/send-message/:id', protect, upload.single("file"), sendMessage);
router.post('/getAiResponse',protect, getAiResponse);

export default router;
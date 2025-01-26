import express from 'express'
import { Router } from 'express'
import { protect } from '../middleware/auth.middleware.mjs'
import { getUsersForSideBar, getMessages, sendMessage } from '../controllers/message.controller.mjs'

const router = Router();

router.get('/users', protect, getUsersForSideBar);
router.get('/:id', protect, getMessages);
router.post('/send-message/:id', protect, sendMessage);

export default router;
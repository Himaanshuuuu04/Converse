import express from 'express'
import { Router } from 'express'
import { signup, login, logout } from '../controllers/auth.controller.mjs'

const router = Router()

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
export default router;
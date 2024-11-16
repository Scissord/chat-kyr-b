import { Router } from 'express';
import express from "express";
import authRoutes from './authRoute.js';
import boardRoutes from './boardRoute.js';
import cardRoutes from './cardRoute.js';
import cardItemRoutes from './cardItemRoute.js';
import customerRoutes from './customerRoute.js';
import messageRoutes from './messageRoute.js';
import adminRoutes from './adminRoute.js';
import downloadRoutes from './downloadRoute.js'
import userRoutes from './userRoute.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/board', boardRoutes);
router.use('/cards', cardRoutes);
router.use('/cardItems', cardItemRoutes);
router.use('/customers', customerRoutes);
router.use('/messages', messageRoutes);
router.use('/admin', adminRoutes);
router.use('/download', downloadRoutes);
router.use('/users', userRoutes);
router.use('/uploads', express.static('uploads'));

export default router;
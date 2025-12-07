// routes/forumRoutes.js
import express from 'express';
import {
    createPost,
    getAllPosts,
    getPostById,
    getPostsByUser,
    getMyPosts,
    updatePost,
    deletePost,
    answerQuestion
} from '../controllers/forumController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.get('/user/:userId', getPostsByUser);

// Protected routes
router.post('/', protect, createPost);
router.get('/my-posts', protect, getMyPosts);
router.put('/:id', protect, updatePost);
router.post('/:id/answer', protect, answerQuestion);
router.delete('/:id', protect, deletePost);

export default router;


import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createScheme, getAllSchemes } from '../controllers/schemeController.js';

const router = express.Router();

router.route('/')
    .get(getAllSchemes)
    .post(createScheme);

export default router;

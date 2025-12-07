// controllers/forumController.js
import ForumPost from '../models/ForumPost.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create a new forum post
// @route   POST /api/forum
// @access  Private
export const createPost = async (req, res, next) => {
    try {
        const { title, description, category, image, images, tags, crops } = req.body;

        // Validate required fields
        if (!title || !description || !category) {
            return next(new ErrorResponse('Please provide title, description, and category', 400));
        }

        // Create post
        const post = await ForumPost.create({
            author: req.user.id,
            title,
            content: description, // Using description as content
            description,
            category,
            image: image || (images && images.length > 0 ? images[0] : null),
            images: images || [],
            isAnswered: false,
            tags: tags || [],
            crops: crops || []
        });

        // Populate author details
        await post.populate('author', 'name email phone role location');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Public
export const getAllPosts = async (req, res, next) => {
    try {
        const { category, search, isAnswered, author } = req.query;

        // Build query
        const query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (isAnswered !== undefined) {
            query.isAnswered = isAnswered === 'true';
        }

        if (author) {
            query.author = author;
        }

        // Get posts with pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await ForumPost.find(query)
            .populate('author', 'name email phone role location')
            .populate('answer.expert', 'name email phone role location')
            .populate('upvotes', 'name')
            .populate('downvotes', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ForumPost.countDocuments(query);

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get single forum post
// @route   GET /api/forum/:id
// @access  Public
export const getPostById = async (req, res, next) => {
    try {
        const post = await ForumPost.findById(req.params.id)
            .populate('author', 'name email phone role location')
            .populate('answer.expert', 'name email phone role location')
            .populate('upvotes', 'name')
            .populate('downvotes', 'name');

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        res.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get posts by user
// @route   GET /api/forum/user/:userId
// @access  Public
export const getPostsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await ForumPost.find({ author: userId })
            .populate('author', 'name email phone role location')
            .populate('answer.expert', 'name email phone role location')
            .populate('upvotes', 'name')
            .populate('downvotes', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ForumPost.countDocuments({ author: userId });

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's posts
// @route   GET /api/forum/my-posts
// @access  Private
export const getMyPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const posts = await ForumPost.find({ author: req.user.id })
            .populate('author', 'name email phone role location')
            .populate('answer.expert', 'name email phone role location')
            .populate('upvotes', 'name')
            .populate('downvotes', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ForumPost.countDocuments({ author: req.user.id });

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update post (mark as answered or add answer)
// @route   PUT /api/forum/:id
// @access  Private (Author, Expert, or Admin)
export const updatePost = async (req, res, next) => {
    try {
        const { isAnswered, answer } = req.body;
        let post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is author, expert, or admin
        const isAuthor = post.author.toString() === req.user.id;
        const isExpert = req.user.role === 'expert';
        const isAdmin = req.user.role === 'admin';

        if (!isAuthor && !isExpert && !isAdmin) {
            return next(new ErrorResponse('Not authorized to update this post', 403));
        }

        // Update fields
        if (isAnswered !== undefined) {
            post.isAnswered = isAnswered;
        }

        // Add answer (only experts can answer)
        if (answer && (isExpert || isAdmin)) {
            post.answer = {
                content: answer,
                expert: req.user.id,
                answeredAt: new Date()
            };
            post.isAnswered = true;
        }

        await post.save();

        await post.populate('author', 'name email phone role location');
        if (post.answer && post.answer.expert) {
            await post.populate('answer.expert', 'name email phone role location');
        }

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Answer a question (expert only)
// @route   POST /api/forum/:id/answer
// @access  Private (Expert or Admin)
export const answerQuestion = async (req, res, next) => {
    try {
        const { answer } = req.body;

        if (!answer || !answer.trim()) {
            return next(new ErrorResponse('Please provide an answer', 400));
        }

        // Check if user is expert or admin
        if (req.user.role !== 'expert' && req.user.role !== 'admin') {
            return next(new ErrorResponse('Only experts can answer questions', 403));
        }

        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        if (post.isAnswered) {
            return next(new ErrorResponse('This question has already been answered', 400));
        }

        // Add answer
        post.answer = {
            content: answer,
            expert: req.user.id,
            answeredAt: new Date()
        };
        post.isAnswered = true;

        await post.save();

        await post.populate('author', 'name email phone role location');
        await post.populate('answer.expert', 'name email phone role location');

        res.status(200).json({
            success: true,
            message: 'Answer submitted successfully',
            data: post
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/forum/:id
// @access  Private (Author or Admin)
export const deletePost = async (req, res, next) => {
    try {
        const post = await ForumPost.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Check if user is author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this post', 403));
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};


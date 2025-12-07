import GovernmentScheme from '../models/GovernmentScheme.js';

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Private
export const getAllSchemes = async (req, res) => {
    try {
        const schemes = await GovernmentScheme.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(schemes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new scheme
// @route   POST /api/schemes
// @access  Private (Government/Admin only ideally)
export const createScheme = async (req, res) => {
    try {
        console.log('Received scheme creation request:', req.body);
        const { title, state, eligibility, details, steps, documentLink, tags, benefits } = req.body;

        // Basic validation
        if (!title || !state || !details) {
            console.error('Validation failed: Missing title, state, or details');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const scheme = new GovernmentScheme({
            title,
            state,
            eligibility,
            details,
            steps: Array.isArray(steps) ? steps : [steps],
            documentLink,
            tags: Array.isArray(tags) ? tags : [],
            benefits: Array.isArray(benefits) ? benefits : [],
            deadline
        });

        const createdScheme = await scheme.save();
        res.status(201).json(createdScheme);
    } catch (error) {
        console.error('Error creating scheme:', error);
        res.status(400).json({ message: error.message });
    }
};

import User from '../models/User.js';

// Get all experts
export const getExperts = async (req, res) => {
    try {
        const experts = await User.find({ role: 'expert' }).select('-password');
        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

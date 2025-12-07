
import User from '../models/User.js';

export const subscribeUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.isSubscribed = true;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isSubscribed: user.isSubscribed,
                token: req.headers.authorization.split(' ')[1] // simplify for now or just success msg
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

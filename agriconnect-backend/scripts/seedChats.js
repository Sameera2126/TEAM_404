import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

dotenv.config();

const seedChats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find specific test users
        const farmer = await User.findOne({ email: 'farmer1@agriconnect.com' });
        const expert = await User.findOne({ email: 'expert1@agriconnect.com' });

        if (!farmer || !expert) {
            console.log('Specific test users (farmer1/expert1) not found. Checking for any users...');
            // Fallback logic
            const f = await User.findOne({ role: 'farmer' });
            const e = await User.findOne({ role: 'expert' });

            if (f && e) {
                console.log(`Fallback: Using ${f.name} and ${e.name}`);
                return createChat(f, e); // Helper function
            }

            console.log('No users found. Please run "npm run seed" first.');
            process.exit(1);
        } else {
            console.log(`Using Farmer: ${farmer.name}`);
            console.log(`Using Expert: ${expert.name}`);
            await createChat(farmer, expert);
        }

    } catch (error) {
        console.error('General Error:', error);
        process.exit(1);
    }
};

const createChat = async (farmer, expert) => {
    try {
        // Prepare participants array
        const participants = [farmer._id, expert._id];

        // Wipe existing chats for these two to be clean
        await Chat.deleteMany({
            participants: { $all: participants }
        });
        console.log('Cleared existing chats for these participants.');

        // Verify IDs
        if (!mongoose.Types.ObjectId.isValid(farmer._id) || !mongoose.Types.ObjectId.isValid(expert._id)) {
            throw new Error("Invalid ObjectIDs");
        }

        const chatData = {
            participants: participants,
            messages: [
                {
                    sender: farmer._id,
                    text: "Hello Dr. Sharma, I have a question about my cotton crop.",
                    createdAt: new Date(Date.now() - 86400000)
                },
                {
                    sender: expert._id,
                    text: "Hello! Usage of pesticides should be minimized. Send me a picture.",
                    createdAt: new Date(Date.now() - 80000000)
                },
                {
                    sender: farmer._id,
                    text: "Sure, updating soon. What about the watering schedule?",
                    createdAt: new Date(Date.now() - 70000000)
                }
            ]
        };

        const chat = await Chat.create(chatData);
        console.log('Mock chat conversation created successfully!');
        console.log('Chat ID:', chat._id);
        process.exit(0);

    } catch (createError) {
        console.error('Error creating chat (JSON):', JSON.stringify(createError, null, 2));
        if (createError.errors) {
            Object.keys(createError.errors).forEach(key => {
                console.error(`Validation Error [${key}]: ${createError.errors[key].message}`);
            });
        }
        process.exit(1);
    }
}

seedChats();

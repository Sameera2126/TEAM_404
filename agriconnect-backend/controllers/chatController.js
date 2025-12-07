
import Chat from '../models/Chat.js';
import User from '../models/User.js';

// Access or create a one-on-one chat
// Access or create a one-on-one chat
export const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send("UserId param not sent with request");
    }

    try {
        // Check if chat exists
        let chat = await Chat.findOne({
            participants: { $all: [req.user._id, userId] },
        })
            .populate("participants", "-password")
            .populate("messages.sender", "name email avatar");

        if (chat) {
            // If chat exists, we might want to ensure lastMessage is set in the response object
            // equivalent to what the frontend expects
            const chatObj = chat.toObject();
            if (chatObj.messages && chatObj.messages.length > 0) {
                chatObj.lastMessage = chatObj.messages[chatObj.messages.length - 1];
            }
            res.send(chatObj);
        } else {
            // Create new chat
            var chatData = {
                participants: [req.user._id, userId],
            };

            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("participants", "-password");

            res.status(200).json(FullChat);
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// Fetch all chats for the user
// Fetch all chats for the user
export const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("messages.sender", "name email avatar")
            .sort({ updatedAt: -1 });

        const results = chats.map(chat => {
            const c = chat.toObject();
            if (c.messages && c.messages.length > 0) {
                c.lastMessage = c.messages[c.messages.length - 1];
            }
            return c;
        });

        res.status(200).send(results);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        return res.status(400).json({ message: "Invalid data passed into request" });
    }

    try {
        const chat = await Chat.findById(chatId);

        // Check message limit for farmers
        if (req.user.role === 'farmer' && !req.user.isSubscribed) {
            // Count messages sent by this user in this chat
            // Note: In a real app efficiently, we might want to store a counter or check differently
            // For now, let's just count from the messages array if populate or perform a query
            // The Chat model has messages embedded? Yes, looks like it based on schema

            // Wait, looking at the Chat model again from Step 19
            // messages: [messageSchema]

            const myMessagesCount = chat.messages.filter(msg => msg.sender.toString() === req.user._id.toString()).length;

            if (myMessagesCount >= 2) {
                return res.status(403).json({
                    message: "Basic plan limit reached. Subscribe to continue chatting.",
                    code: "LIMIT_REACHED"
                });
            }
        }

        const newMessage = {
            sender: req.user._id,
            text: content,
        };

        // Push to chat messages
        chat.messages.push(newMessage);
        chat.lastMessage = chat.messages[chat.messages.length - 1]; // logic might need adjustment if using subdoc id, but usually it works if we save
        // actually lastMessage is a Ref to Message, but here messages are embedded. 
        // The schema in Step 19 says: 
        // messages: [messageSchema],
        // lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }

        // This is a bit inconsistent in the schema provided (embedded vs ref).
        // Let's assume we maintain the embedded array and we want to allow querying lastMessage.
        // Ideally if embedded, lastMessage might just be a cached copy or ID of the embedded one.
        // However, since we can't easily Ref an embedded doc from another collection in standard ways without parent ID,
        // let's just save the chat.

        await chat.save();

        // Populate the last added message to return it
        // We need to get the last message object from the array we just saved
        const sentMessage = chat.messages[chat.messages.length - 1];

        // To return fully populated message we might need to manually construct or re-fetch
        // simpler to just return the whole chat or the message with sender populated

        // specific population for the return
        const populatedChat = await Chat.findById(chatId).populate("messages.sender", "name avatar");
        const newMsgPopulated = populatedChat.messages[populatedChat.messages.length - 1];

        res.json(newMsgPopulated);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

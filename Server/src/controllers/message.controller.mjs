import User from '../models/user.models.mjs';
import Message from '../models/message.models.mjs';
export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedUserId } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getUsersForSideBar controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatWithId } = req.params;
        const loogedUserId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderID: loogedUserId, receiverID: userToChatWithId },
                { senderID: userToChatWithId, receiverID: loogedUserId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image, audio } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;
        let imageUrl;
        let audioUrl;
        if (image) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'chat-images'
            });
            imageUrl = result.url;
        }
        if (audio) {
            const result = await cloudinary.uploader.upload(audio, {
                folder: 'chat-audio',
                resource_type: 'video'
            });
            audioUrl = result.url;
        }
        const message = new Message({ senderID, receiverID, text, image: imageUrl, audio: audioUrl });
        await message.save();

        // real time functionality using socket.io

        res.status(201).json(message);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
import User from '../models/user.models.mjs';
import Message from '../models/message.models.mjs';
import cloudinary from '../lib/cloudinary.mjs';
import { getReceiverSocketID } from '../lib/socket.mjs';
import { io } from '../lib/socket.mjs';
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
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        const { text, audio } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;
        if (!receiverID) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }
        let audioUrl;
        let imageUrl;
        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: "profile_pictures",
            });
            imageUrl = result.secure_url;
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

        const receiverSocketID = getReceiverSocketID(receiverID);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit('message', message);
        }
        

        res.status(201).json(message);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
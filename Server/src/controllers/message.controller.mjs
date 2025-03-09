import User from '../models/user.models.mjs';
import Message from '../models/message.models.mjs';
import cloudinary from '../lib/cloudinary.mjs';
import { getReceiverSocketID } from '../lib/socket.mjs';
import { io } from '../lib/socket.mjs';
import { GoogleGenerativeAI } from "@google/generative-ai";


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
        // console.log("Request Body:", req.body);
        // console.log("Request File:", req.file);
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

export const getAiResponse = async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ message: "GEMINI_API_KEY not found in environment variables" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp", // Use the correct model name here
    });
    const generationConfig = {
        temperature: 0.75,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain", // Changed to markdown
    };

    try {
        const { userInput } = req.body; // Assuming the user's prompt is sent in the request body as 'userInput'
        if (!userInput) {
            return res.status(400).json({ message: "Prompt is required in the request body", userInput });
        }

        // Add a prompt to encourage Markdown output (optional but recommended)
        const markdownPrompt = `${userInput}\n\n Please format your response using Markdown.`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: markdownPrompt }] }], // Send as generateContentRequest
            generationConfig,
        });
        const response = await result.response;
        const text = response.text();
        res.status(200).json({ message: text });

    } catch (err) {
        console.error("Error in getAiResponse controller: ", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { _id } = req.body;
        const message = await Message.findByIdAndDelete(_id).exec();

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.image) {
            const public_id = message.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`profile_pictures/${public_id}`);
        }
        if (message.audio) {
            const public_id = message.audio.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`chat-audio/${public_id}`);
        }
        await Message.findByIdAndDelete(_id).exec();
        const receiverSocketID = getReceiverSocketID(message.receiverID);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit('messageDeleted', { _id });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (error) {
        console.log("Error in deleteMessage controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const generateCall = (req,res) => {
    try{
        const {id,offer,senderData} = req.body;
        const receiverSocketID = getReceiverSocketID(id);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('incomingCall', {senderID: req.user._id,senderData:senderData,offer});
        }
        res.status(200).json({
            message: "Call initiated",
            receiverID: id
        });
    }catch(error){
        console.log("Error in call controller: ", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export const acceptCall = (req,res) => {
    try{
        const {id,answer} = req.body;
        const receiverSocketID = getReceiverSocketID(id);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('callAccepted', {senderID: req.user._id, answer});
        }
        res.status(200).json({message: "Call accepted"});
    }catch(error){
        console.log("Error in acceptCall controller: ", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}


export const rejectCall = (req,res) => {
    try{
        const {id} = req.body;
        const receiverSocketID = getReceiverSocketID(id);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('callRejected', {senderID: req.user._id});
        }
        res.status(200).json({message: "Call rejected"});
    }catch(error){
        console.log("Error in rejectCall controller: ", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

export const endCall = (req,res) => {
    try{
        const {id} = req.body;
        const receiverSocketID = getReceiverSocketID(id);
        if(receiverSocketID){
            io.to(receiverSocketID).emit('callEnded', {senderID: req.user._id});
        }
        res.status(200).json({message: "Call ended"});
    }catch(error){
        console.log("Error in endCall controller: ", error);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

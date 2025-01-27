import User from '../models/user.models.mjs';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.mjs';
import cloudinary from '../lib/cloudinary.mjs';

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
}
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Email format is invalid' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, fullName, password: hashedPassword, profileImage, about });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ message: 'User created successfully', user: newUser });
        }
        else {
            return res.status(400).json({ message: 'Invalid User Credentials' });
        }
    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Email format is invalid' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found, Invalid credentials' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(user._id, res);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log("Error in logout controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    res.send('logout');
};
export const updateProfile = async (req, res) => {
    try {
        const { fullName, about, profileImage } = req.body;
        const userId = req.user._id;
        if (!profileImage && !fullName && !about) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        if (profileImage) {
            const result = cloudinary.uploader.upload(profileImage);
            const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: result.url, fullName, about }, { new: true });
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        }
        else if (fullName) {
            const updatedUser = await User.findByIdAndUpdate(userId, { fullName, about }, { new: true });
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        }
        else if (about) {
            const updatedUser = await User.findByIdAndUpdate(userId, { about }, { new: true });
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        }
    } catch (error) {
        console.log("Error in updateProfile controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
import User from '../models/user.models.mjs';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.mjs';
export const signup = async (req, res) => {
    const { email, fullName, password, profileImage } = req.body;
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(String(email).toLowerCase());
    }
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
        const newUser = new User({ email, fullName, password: hashedPassword, profileImage });
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

export const login = (req, res) => {
    res.send('login');
};

export const logout = (req, res) => {
    res.send('logout');
};
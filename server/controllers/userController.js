import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_Secret = process.env.JWT_SECRET;

const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES;

const createToken = (userId) => jwt.sign({userId}, JWT_Secret, {expiresIn: TOKEN_EXPIRES});

// Register
export async function registerUser(req, res) {
    const {name, email, password} = req.body;


    if(!name || !email || !password) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    if(!validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "Invalid email format"});
    }
    if(password.length < 8) {
        return res.status(400).json({success: false, message: "Password must be at least 8 characters long"});
    }
    
    try {
        if(await User.findOne({email})) {
            return res.status(409).json({success: false, message: "Email already exists"});
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        const token = createToken(user._id);

        res.status(201).json({success: true, data: {token,user: {id:user._id,name: user.name, email: user.email}}});
    } catch (error) {
        res.status(500).json({success: false, message: "Error creating user", error});
    }
}

// Login
export async function loginUser(req, res) {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({success: false, message: "Invalid email or password"});
        }

        const token = createToken(user._id);
        res.status(200).json({success: true, data: {token, user: {id: user._id, name: user.name, email: user.email}}});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error logging in", error});
    }
}

// Get current user
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("name email");
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, data: {user: {id: user._id, name: user.name, email: user.email}}});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error fetching user", error});  
    }
}

// Update user
export async function updateProfile(req, res) {
    const {name, email} = req.body;

    if(!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({success: false, message: "At least one field is required"});
    }

    try {
        const exists = await User.findOne({email, _id: {$ne: req.user.id}});
        if (exists) {
            return res.status(409).json({success: false, message: "Email already exists"});
        }

        const user = await User.findByIdAndUpdate(req.user.id, {name, email}, {new: true , runValidators:true, select: "name email"});
        res.status(200).json({success: true, data: {user: {id: user._id, name: user.name, email: user.email}}});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error updating user", error});
    }
}

// Change password
export async function changePassword(req, res) {
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({success: false, message: "All fields are required and password must be at least 8 characters long"});
    }

    try {
        const user = await User.findById(req.user.id).select("password");
        if(!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch) {
            return res.status(401).json({success: false, message: "Invalid current password"});
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({success: true, message: "Password changed successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error changing password", error});
    }
}

import userModel from "../models/user.model";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_Secret = process.env.JWT_SECRET;

const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES;

const createToken = (userId) => jwt.sign({userId}, JWT_Secret, {expiresIn: TOKEN_EXPIRES});

export async function createUser(req, res) {
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
        if(await userModel.findOne({email})) {
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


import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_Secret = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
    // get bearer token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_Secret);
        const user = await User.findById(payload.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}
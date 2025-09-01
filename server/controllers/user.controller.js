import userModel from "../models/user.model";

export async function createUser(req, res) {
    const {name, email, password} = req.body;

    try {
        const newUser = await userModel.create({name, email, password});
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({message: "Error creating user", error});
    }
}
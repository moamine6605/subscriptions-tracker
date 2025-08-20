import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expired = process.env.JWT_EXPIRES_AT;


export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        const token = jwt.sign(
            { userId: newUsers[0]._id },
            secret,
            { expiresIn: expired }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    } finally {
        session.endSession();
    }
};


export const signIN = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({email});

        if(!existingUser){
            const error = new Error("User not found");
            error.statusCode = 400;
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordValid){
            const error = new Error("wrong password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: existingUser._id}, secret, { expiresIn: expired })

        res.status(200).json({
            success: true,
            message: 'User signed in succesfully',
            data: {
                token,
                existingUser,
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}

export const signOut = async (req, res, next) => {
    res.send({title: "signout"})
}
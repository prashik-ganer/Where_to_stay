import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { username, email, password } = req.body;


    try {

        // HASH PASSWORD
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(hashPassword)

        // CREATE A NEW USER AND SAVE TO DATABASE
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            }
        })

        console.log(newUser)

        res.status(201).json({ message: " User created successfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to create user"
        })
        // console.log(req.body)
    }

}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        // CHECK IF USER EXISTS
        const user = await prisma.user.findUnique({
            where: { username: username }
        })

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // COMPARE IF PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // GENERATE COOKIE TOKEN AND SEND TO THE USER
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("Success")

        const age = 1000 * 60 * 60 * 24 * 7;

        const token = jwt.sign({ id: user.id, isAdmin: false }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPaassword, ...userInfo } = user

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age
        }).status(200).json(userInfo)



    } catch (error) {
        console.log(error)
        res.send(500).json({
            message: "Failed to login"
        })
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({ message: "Logout successful" });
}








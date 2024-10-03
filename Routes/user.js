const { Router } = require("express");
const userRouter = Router();
const { userModel, purchasesModel } = require("../db");
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {JWT_SECRET_USER} = require("../config")
const {userMiddleware} = require("../Middleware/user")

userRouter.post("/signup", async function (req, res) {
    // input check
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(60),
        firstName: z.string().min(3).max(40),
        lastName: z.string().min(3).max(40),
    })
    const safeParse = requireBody.safeParse(req.body)
    if (!safeParse.success) {
        res.status(403).json({
            msg: "Incorrect Format ",
            error: safeParse.error
        })
        return;
    }

    // password hashing and storing 
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 7);
    try {
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        })
        res.status(200).json({
            msg: "You are Signed Up "
        })
    } catch (e) {
        res.status(403).json({
            msg: "Something Went Wrong",
            err: e
        })
    }

})

userRouter.post("/signin", async function (req, res) {
    // input check
    const requireBody = z.object({
        email: z.string().email(),
        password: z.string().min(8).max(60)
    })
    const safeParse = requireBody.safeParse(req.body)
    if (!safeParse.success) {
        res.status(403).json({
            msg: "Incorrect Format "
        })
        return;
    }

    // Checking email is present or not  
    const { email, password } = req.body;
    const response = await userModel.findOne({ // return either user or undefined
        email: email
    });
    console.log(response);
    if (!response) {
        res.status(403).json({
            msg: "Invalid Credentials User Not Found"
        })
        return;
    }

    // checking password is correctly give by user or not 
    const passwordCheck = await bcrypt.compare(password, response.password)
    if (!passwordCheck) {
        res.status(403).json({
            msg: "Wrong Password"
        })
        return;
    }

    // if password is correct return them a token 
    const token = jwt.sign({
        id: response._id.toString() // database objectId of user it is unique 
    }, JWT_SECRET_USER);

    res.status(200).json({
        msg: "You are Signed In",
        token: token
    })
})

userRouter.get("/purchases", userMiddleware ,async function (req, res) {
    const userId = req.userId;
    const purchases = await purchasesModel.findOne({
        userId,
    })
    res.json({
        purchases
    })
})

module.exports = {
    userRouter: userRouter
}
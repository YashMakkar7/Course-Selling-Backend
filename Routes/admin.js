const { Router } = require("express")
const adminRouter = Router();
const { adminModel } = require("../db")
const { courseModel } = require("../db")
const z = require("zod")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_SECRET_ADMIN } = require("../config")
const { adminMiddleware } = require("../Middleware/admin")



adminRouter.post("/signup", async function (req, res) {
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
        await adminModel.create({
            email,
            password:hashedPassword,
            firstName,
            lastName
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

adminRouter.post("/signin", async function (req, res) {
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
    const response = await adminModel.findOne({ // return either user or undefined
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
    }, JWT_SECRET_ADMIN);

    res.status(200).json({
        msg: "You are Signed In",
        token: token
    })
})

adminRouter.use(adminMiddleware);

adminRouter.post("/course", async function (req, res) {
    const adminId = req.adminId
    const { title, description, price, imageUrl } = req.body;
    try {
        const course = await courseModel.create({
            title, description, price, imageUrl,
            creatorId: adminId
        })
        res.status(200).json({
            msg: "Course created",
            courseId: course._id
        })

    } catch (e) {
        res.status(401).json({
            msg: "Course Creation failed"
        })
    }
})
adminRouter.put("/course", async function (req, res) {
    const adminId = req.adminId
    console.log(adminId)
    const { title, description, price, imageUrl, courseId } = req.body;
    console.log(courseId)
    const find = await courseModel.findOne({
        _id: courseId,
        creatorId: adminId
    })
    console.log(find);
    if (!find) {
        res.status(403).json({
            msg: "You is not the owner"
        })
        return;
    }

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId //only update the course if creator id and admin id are same warna koi bhi admin aake dusre admin ke course meh ched kahni karega
    },
        {
            title, description, price, imageUrl
        })
    res.status(200).json({
        msg: "Course Updated",
        courseId: course._id
    })


})
adminRouter.get("/course/bulk", async function (req, res) {
    const adminId = req.adminId
    const { courseId } = req.body;
    try {
        const course = await courseModel.findOne({
            _id: courseId,
            creatorId: adminId
        })

        res.status(200).json({
            course: course,
        })

    } catch (e) {
        res.status(401).json({
            msg: "Failed"
        })
    }
})

module.exports = {
    adminRouter: adminRouter
}
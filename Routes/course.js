const { Router } = require("express");
const courseRouter = Router();
const { userMiddleware } = require("../Middleware/user");
const { purchasesModel, courseModel } = require("../db")
const user = require("./user");

courseRouter.post("/purchase", userMiddleware,async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;

    // should check that user have already paid the price 
    await purchasesModel.create({
        userId,
        courseId
    })
    res.json({
        msg:"Succesfull Purchased the course "
    })
})

courseRouter.get("/preview", async function (req, res) { // no need for authentication here
    const courses = await courseModel.findOne({});
    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}
const { ObjectId, Schema, default: mongoose } = require("mongoose");
console.log("Connect ...");
require('dotenv').config()
mongoose.connect(process.env.DB_CONNECTION_STRING)

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
})
const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
})

// creating a web3 saas in 6hr -> how can you build a pipeline for user to upload image 
const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})
const purchasesSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
})

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchasesModel = mongoose.model("purchase", purchasesSchema);

module.exports = {
    userModel: userModel,
    adminModel: adminModel,
    courseModel: courseModel,
    purchasesModel: purchasesModel,
}
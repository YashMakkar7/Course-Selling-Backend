require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const {userRouter} = require("./Routes/user")
const {courseRouter} = require("./Routes/course")
const {adminRouter} = require("./Routes/admin")
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING
app.use(express.json())

app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);
app.use("/api/v1/admin",adminRouter);

async function main(){
    // .env - enviornment file where all the keys / imp data stored 
    await mongoose.connect(DB_CONNECTION_STRING)
    app.listen(port,function(){
        console.log("Server is Started ..");
    }) 
}
main();

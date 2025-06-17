require("dotenv").config();
const path = require("path");
const fs = require("fs");
const upload = require("./multer");
const config = require("../backend/config.json");
const bcryptjs = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors({origin:"*"}));
const User = require("./models/user.model");
const Memory = require("./models/story.model");
const {authenticateToken} = require("../backend/utilities");

mongoose.connect(config.connectionString);
mongoose.connection.once("open", () => {
    console.log("✅ MongoDB Atlas connected successfully!");
});


//Create account
app.post("/create-account",async (req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName||!email||!password){
        return res.status(400).json({error:true,message:"All fields are mandatory to enter"});
    }

    const isUser = await User.findOne({email});
    if(isUser){
        return res.status(400).json({error:true,message:"User Already Exists.Please Login."});
    }

    const hashedPassword = await bcryptjs.hash(password,10);

    const user = new User({
        fullName,
        email,
        password:hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:"72h",
        }
);
return res.status(201).json({
    error:false,
    user:{fullName:user.fullName,email:user.email},
    accessToken,
    message:"Registration Successful"
});

});

//Login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        res.status(400).json({message:
            "Please enter all details"
        });
    }

    const user = await User.findOne({email});
    if(!user){
        res.status(400).json({message:"user does not exist"});
    }

    //check password authentication
    const isPasswordValid = await bcryptjs.compare(password,user.password);
    if(!isPasswordValid){
        res.status(400).json({message:"Invalid credentials"});
    }

    const accessToken = jwt.sign(
        {userId:user._id},
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"72h",
        }
    );

    return res.json({
        error:false,
        message:"Login Successful",
        user:{fullName:user.fullName,email:user.email},
        accessToken,

    });

});

//get user
app.get("/get-user",authenticateToken,async (req,res)=>{
    const {userId} = req.user;
    const isUser = await User.findOne({_id:userId});

    if(!isUser){
        res.sendStatus(401);
    }

    return res.json({
        user:isUser,
        message:"",
    })
});

//add memory
app.post("/add-story",authenticateToken,async (req,res)=>{
    const {title,story,visitedLocation,imageUrl,visitedDate} =req.body;
    const {userId} = req.user;
    if(!title||!story||!visitedLocation||!imageUrl||!visitedDate){
        return res.status(400).json({error:true,message:"All fields are mandatory"});
    }

    const parseVisitedDate = new Date(parseInt(visitedDate));

    try{
        const Story = new Memory(
            {
                title,
                story,
                visitedLocation,
                imageUrl,
                visitedDate:parseVisitedDate,
                userId,
            }
        );

        const savedStory = await Story.save();
        res.status(201).json({
            story:savedStory,
            message:"added successfully"
        });
    }
        catch(error){
            res.status(400).json({error:true,message:error.message});
        }
    
});

//get all stories
app.get("/get-all-stories",authenticateToken,async (req,res)=>{
    const {userId} = req.user;

    try{
        const Stories = await Memory.find({userId:userId}).sort({isFavourite:-1,});
        res.status(200).json({stories:Stories});
    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

//Route to handle images upload
app.post("/image-upload",upload.single("image"),async (req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({error:true,message:"No image uploaded"});
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({imageUrl});
    }
    catch{
        res.status(500).json({error:true,message:"error.message"});
    }
    
});

app.delete("/delete-image",async (req,res)=>{
    const {imageUrl} = req.query;
    if(!imageUrl){
        res.status(400).json({error:true,message:"imageUrl is required"});
    }

    try{
        //extract the filename
        const filename  = path.basename(imageUrl);

        //define the file path
        const filePath = path.join(__dirname,'uploads',filename);

        if(fs.existsSync(filePath)){
            //delete the file from uploads folder
            fs.unlinkSync(filePath);
            res.status(200).json({message:"image deleted successfully"});
        }
        else{
            res.status(200).json({error:true,message:"image not found"});
        }

    }catch(error){
        res.status(500).json({error:true,message:error.message});
    }
});

app.put("/edit-story/:id",authenticateToken,async (req,res)=>{
    const {id} = req.params;
    const {title,story,visitedLocation,imageUrl,visitedDate} = req.body;
    const {userId} = req.user;

    if(!title||!story||!visitedLocation||!imageUrl||!visitedDate){
        return res.status(400).json({error:true,message:"All fields are mandatory"});
    }

    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try{
        //find the  story by id and ensure it belongs to the authenticated user
        const Story = await Memory.findOne({_id:id,userId:userId});
        if(!Story){
            return res.status(404).json({error:true,message:"memory not found"});
        }

        const placeHolderImage = `http://localhost:8000/assets/placeholder.png`;
        Story.title = title;
        Story.story = story;
        Story.visitedLocation = visitedLocation;
        Story.imageUrl = imageUrl||placeHolderImage;
        Story.visitedDate = parsedVisitedDate;

        await Story.save();
        res.status(200).json({
            story:Story,
            message:'Update successful'
        });

    }catch(error){
        res.status(500).json({error:true,message:error.message});
    } 

});
//working well but wrong message printed correct that later
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // Find the story by id and ensure it belongs to the authenticated user
        const story = await Memory.findOne({ _id: id, userId: userId });
        if (!story) {
            return res.status(404).json({ error: true, message: "Memory not found" });
        }

        await Memory.deleteOne({ _id: id ,userId:userId});
        const imageUrl = story.imageUrl;
        const fileName = path.basename(imageUrl);

        const filePath = path.join(__dirname,'uploads',fileName);
        fs.unlink(filePath,(err)=>{
            if(err){
                console.error("failed to delete");

            }

        });

        res.status(200).json({
            message: "Story deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//update is favourite story
// Update isFavourite
app.patch("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        const Story = await Memory.findOne({ _id: id, userId: userId });

        if (!Story) {
            return res.status(404).json({ error: true, message: " story not found" });
        }

        Story.isFavourite = isFavourite;

        await Story.save();
        res.status(200).json({ story: Story, message: "Update Successful" });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//search stories
app.get("/search-stories/",authenticateToken,async (req,res)=>{
    const {query} = req.query;
    const {userId} = req.user;
    if(!query){
        return res.status(404).json({error:true,message:"query is required"});
    }
    try{
        const searchResults = await Memory.find({
            userId:userId,
            $or :[
                {title:{$regex:query,$options:"i"}},
                {story:{$regex:query,$options:"i"}},
                {visitedLocation:{$regex:query,$options:"i"}},

            ]
        }).sort({isFavourite:-1});
        res.status(200).json({stories:searchResults});
    }catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//filter by date range
app.get("/stories/filter/",authenticateToken,async (req,res)=>{
    const {startDate,endDate} = req.query;
    const {userId} = req.user;
    try{
        //convert date from millis to date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));
        const searchResults = await Memory.find({
            userId:userId,
            visitedDate:{$gte:start,$lte:end},
        }).sort({isFavourite:-1});
        res.status(200).json({stories:searchResults});

    }catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

//serve static files from uploads and assets directory
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));


app.listen(8000, () => {
  console.log("🚀 Server running on http://localhost:8000");
});

module.exports = app;

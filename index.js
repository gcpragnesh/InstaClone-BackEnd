const express= require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const app=express()
const bodyParser=require("body-parser")



const dotenv =require("dotenv").config()

const {v4:uniqueKeyGenerate}=require("uuid")

//cloudinary to upload images in my cloud storage
const cloudinary = require("../server/Cloudinary/cloudinary")

const previewSchema=require("./schema/preview")
const key=uniqueKeyGenerate()
console.log(key)
const PORT=8082||process.env.PORT ;
mongoose.set("strictQuery",true)
mongoose.connect("mongodb+srv://gcpragnesh:Pragnesh@cluster0.jaoxg25.mongodb.net/?retryWrites=true&w=majority")
.then((res) => console.log("MONGODB connected"))
.catch((e) => console.log(e));
app.use(cors())
app.use(express.json())
//app.use(express.limit(100000000));
app.use(bodyParser.json({ limit: "50mb" }));
//app.use(express.bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true,parameterLimit:50000 }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));




app.post("/uploads", async(req,res)=>{
  console.log(req.body);
  const { name, location, description, imageUrl } = req.body;
  try {
    console.log(req.body)
    res.send(req.body)
    const responseForUpload = await cloudinary.v2.uploader.upload(
      imageUrl,
      { upload_preset: "insta-clone-post" },
      function (error, result) {
        if (error) {
          console.log(error, "Connot upload");
          res.sendStatus(500);
        } else console.log(result);
        return { url: result.secure_url, public_id: result.public_id };
      }
    );
    if (responseForUpload) {
      console.log(responseForUpload);
      
      const posts = await previewSchema.create({
        name,
        location,
        description,
        imageUrl: {
          imageUrl: responseForUpload.url,
          public_id: responseForUpload.public_id,
        },
      });
      console.log(posts);
      res.json({
        status: "success",
        posts,
      });
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});




app.get("/all", async (req,res)=>{
  try {
    console.log(req.body);
    const posts = await previewSchema.find().sort({ _id: "-1" });
    res.json({
      status: "success",
      posts,
    });
    console.log(posts);
  } catch (error) {
    res.json({
      status: "Failed",
      message: error.message,
    });
  }
});





app.listen(PORT,()=>{
    console.log("running on port",PORT)

})
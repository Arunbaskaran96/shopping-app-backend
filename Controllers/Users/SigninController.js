const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const jwt_secert="project2"
const nodemailer=require("nodemailer")


const UserModel=require("../../Models/Usermodel")

router.post("/login",async(req,res)=>{
    try {
        const user=await UserModel.findOne({email:req.body.email})

        if(user){
            const compare=await bcrypt.compare(req.body.password,user.password)
            if(compare){
                const userdata={
                    email:user.email,
                    _id:user._id
                }
                const token=jwt.sign(userdata,jwt_secert,{expiresIn:"50m"})
                res.status(200).json({message:"Logged in",token,user})
            }else{
                res.status(400).json({message:"Incorrect username/password"})
            }
        }else{
            res.status(400).json({message:"user not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"something went wrong"})
    }
})


router.post("/forgot", async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const forgotSec = jwt_secert + user.password;
      const token = jwt.sign({ email: user.email, id: user._id }, forgotSec, {
        expiresIn: "10m",
      });
      const link = `https://motorcycle-service-app.onrender.com/reset/${user._id}/${token}`;
    //   console.log(link)
      if (link) {
        const sender = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "bbaa64903@gmail.com",
            pass: "ejzisgonigwvvzko",
          },
        });
  
        const composemail = {
          from: "bbaa64903@gmail.com",
          to: user.email,
          subject: "for changing the password",
          html: link,
        };
  
        sender.sendMail(composemail, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("sent");
          }
        });
      }
    } else {
      res.status(400).json({ message: "user not found" });
    }
  });


  router.get("/reset/:id/:token", async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (user) {
      const forgotSec = jwt_secert + user.password;
  
      try {
        const verify = jwt.verify(req.params.token, forgotSec);
        res.render("index", { email: verify.email, status: "not verified" });
      } catch (error) {
        res.json(error);
      }
    } else {
      res.status(400).json({ message: "user not exists" });
    }
  });
  
  router.post("/reset/:id/:token", async (req, res) => {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (user) {
      const forgotSec = jwt_secert + user.password;
  
      try {
        const verify = jwt.verify(req.params.token, forgotSec);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        const user = await UserModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              password: req.body.password,
            },
          }
        );
        res.render("home");
      } catch (error) {
        res.json({ message: "something went wrong" });
        console.log(error);
      }
    } else {
      res.status(400).json({ message: "user not existss" });
    }
  });



module.exports=router
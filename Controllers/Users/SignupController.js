const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")

const mongoose=require("mongoose")

const Usermodel=require("../../Models/Usermodel")
const Authverify=require("../middleware/Verify")
const UserVerify=require("../middleware/Userid")

router.post("/register",async(req,res)=>{

    const salt=await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(req.body.password,salt)
    req.body.password=hash

    const newUser=new Usermodel({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        city:req.body.city,
        address:req.body.address,
        pincode:req.body.pincode,
        password:req.body.password
    })

    newUser.save().then(result=>{
        res.status(200).json({message:"created"})
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.get("/users",(req,res)=>{
    Usermodel.find().then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.put("/editprofile",Authverify,UserVerify,(req,res)=>{
    const id=req.Uniqueid
    Usermodel.findOneAndUpdate({_id:id},{
        $set:req.body
    }).then((result)=>{
        res.status(200).json({message:"updated"})
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})

router.get("/user",Authverify,UserVerify,(req,res)=>{
    const id=req.Uniqueid

    Usermodel.findOne({_id:id}).then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(400).json({message:"no user found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.get("/users",Authverify,(req,res)=>{

    Usermodel.find().then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(400).json({message:"no user found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


router.get("/user/:id",Authverify,(req,res)=>{

    Usermodel.findOne({_id:req.params.id}).then((result)=>{
        if(result){
            res.status(200).json(result)
        }else{
            res.status(400).json({message:"no user found"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(500).json({message:"something went wrong"})
    })
})


// router.get("/user",Authverify,UserVerify,(req,res)=>{
//     id=req.Uniqueid
//     Usermodel.findOne({_id:id}).then((result)=>{
//         if(result){
//             res.status(200).json(result)
//         }else{
//             res.status(400).json({message:"no user found"})
//         }
//     }).catch(err=>{
//         console.log(err)
//         res.status(500).json({message:"something went wrong"})
//     })
// })


module.exports=router
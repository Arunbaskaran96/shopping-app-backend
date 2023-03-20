const jwt=require("jsonwebtoken")
const jwt_secert="project2"


module.exports=(req,res,next)=>{
    if(req.headers.authorization){
        try {
            const verify=jwt.verify(req.headers.authorization,jwt_secert)
            req.Token=verify
            next()
        } catch (error) {
            console.log(error)
            res.status(400).json({message:"Auth failed"})
        }
    }else{
        res.status(500).json({message:"Auth failed"})
    }
}
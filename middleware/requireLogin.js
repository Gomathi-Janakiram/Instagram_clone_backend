const jwt=require("jsonwebtoken")
const JWT_SECRET="ertygcvbmjjhgvvfxdxfgcv"
const mongoose=require("mongoose")
const User=mongoose.model("User")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers 
    if(!authorization){
        res.status(401).json({error:"you must be logged in"})
    }
    const token=authorization.replace("Bearer ","")   //authorization will look like Bearer secret_key.we replace "Bearer " with space so we can take only secret_key
    jwt.verify(token,JWT_SECRET,(err,payload)=>{      //comparing their token and the actual token
        if(err){
            return res.status(401).json({error:"You must be logged in"})
        }
        const {_id}=payload  //payload contains the user's information which we specified during jwt.sign()
        User.findById(_id).then(userdata=>{
            req.user=userdata
            next()
        })
    })

}
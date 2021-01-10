const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Post=mongoose.model("Post")
const requireLogin=require("../middleware/requireLogin")
const User=mongoose.model("User")

// viewing profile of others
router.get("/user/:id",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")          //selecting everything except password
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.json({error:"User not found"})
    })
})

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.json({error:err})
        })
    })
})
router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        }).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.json({error:err})
        })
    })
})

module.exports=router
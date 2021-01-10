const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Post=mongoose.model("Post")
const requireLogin=require("../middleware/requireLogin")

// listing all the posts
router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    // .populate("postedBy")   if we dont use this method,the value of  postedby will be id alone ...To expand it we use populate()
    .populate("postedBy","_id name")  //this will expand the postedBy and will display only id and name alone
    .populate("comments.postedBy","_id name")  //
    .then(posts=>{
        res.json({posts:posts})
    }).catch(err=>{
        console.log(err)
    })
})


// creating posts
router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,pic}=req.body
    console.log(body,title,pic)
    if(!title||!body||!pic){
        return res.status(400).json({error:"Please add all the fields"})
    }
    console.log(req.user)
    
    req.user.password=undefined    //we do this to not display the password under postedby
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })

    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err)
    })

})

// listing the posts created by signed in user alone
router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost:mypost})
    }).catch(err=>{
        console.log(err)
    })
})

router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{       //id of the post
        $push:{likes:req.user._id}      //push will add the user to likes array
    },{
        new:true        //we have to specify new:true otherwise mongodb will throw us old data
    }).exec((err,result)=>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json(result)
            console.log(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}          //pull will remove the user from likes array
    },{
        new:true        //we have to specify new:true otherwise mongodb will throw us old data
    }).exec((err,result)=>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json(result)
        }
    })
})

router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
     .populate("comments.postedBy","_id name")
     .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.json({error:err})
        }else{
            return res.json(result)
        }
    })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post){
            return res.json({error:err})
        }
        else if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get("/getsubpost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    // .populate("postedBy")   if we dont use this method,the value of  postedby will be id alone ...To expand it we use populate()
    .populate("postedBy","_id name")  //this will expand the postedBy and will display only id and name alone
    .populate("comments.postedBy","_id name")  //
    .then(posts=>{
        res.json({posts:posts})
    }).catch(err=>{
        console.log(err)
    })
})



module.exports=router
const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{          //we are bulding relation with user schema.so we using objectId and giving the ref to "User"
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model("Post",postSchema)
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = mongoose.model("User")
const bcrypt = require("bcryptjs")
const jwt=require("jsonwebtoken")
const requireLogin=require("../middleware/requireLogin")

const JWT_SECRET="ertygcvbmjjhgvvfxdxfgcv"

router.get("/", (req, res) => {
    res.send("hello")
})

router.get("/protected",requireLogin,(req,res)=>{
    res.send("hiiiiiii")
})


router.post("/signup",(req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.json({ error: "User already exists" })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        name,
                        email,
                        password:hashedPassword
                    })
                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(422).json({error:"Please fill all the information"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(400).json({error:"User not found! Please Register"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(isPasswordValid=>{
            if(isPasswordValid){
                // return res.status(200).json({message:"Login successfull"})
                // we generate the token based on the person's id
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)//after the person is logged in we give him a token only with which he can access the protected resource
                const {_id,name,email,followers,following}=savedUser
                res.json({token:token,user:{_id,name,email,followers,following}})
            }else{
                return res.status(400).json({error:"Invalid email or password"})
            }
        }).catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router
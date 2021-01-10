const express=require("express")
const mongoose=require("mongoose")
const app=express()
const cors=require("cors")

const port=process.env.PORT||5000
const mongoUrl="mongodb+srv://user:TDQjyvo8fBPsYfzT@cluster0.zcigu.mongodb.net/<dbname>?retryWrites=true&w=majority"
mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on("connected",()=>{
    console.log("connected to db")
})
mongoose.connection.on("error",()=>{
    console.log("error")
})

app.use(cors())

require("./models/user")
require("./models/post")

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))

app.listen(port,()=>{
    console.log(`listening to ${port}`)
})
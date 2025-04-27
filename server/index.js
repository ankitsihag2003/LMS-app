import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/DB.js"
import userRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js"
import purchaseRoute from "./routes/coursePurchase.route.js"
import progressRoute from "./routes/courseProgress.route.js"

const app = express()

dotenv.config({})

const port = process.env.PORT

// database connection
connectDB()   

//default middleware
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:5173',                 //  local dev
    'https://lms-app-frontend.onrender.com'   //  deployed frontend
];
  
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

//api
app.use("/api/v1/media",mediaRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/purchase",purchaseRoute);
app.use("/api/v1/progress", progressRoute);

app.listen(port , ()=>{
    console.log(`server is listening at port ${port}`)
})

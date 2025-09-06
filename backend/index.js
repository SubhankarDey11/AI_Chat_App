import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';
import path from "path";

const app = express()
dotenv.config();


const port =process.env.PORT || 3000

//middleware
app.use(express.json());
app.use(cors());


//Database connection code 
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("connected to mongodb")
}).catch((error) => {
    console.log("error connecting to mongodb:", error)
})


//Defining Routes
app.use('/bot/v1/', chatbotRoutes)

//............... code for deployment .....................
// ...existing code...
if (process.env.NODE_ENV === 'production') {
  const dirpath = path.resolve();

  app.use(express.static(path.join(dirpath, "frontend", "dist")));

  // Use a regex for the catch-all route
  app.get(/^\/(?!bot\/v1\/).*/, (req, res) => {
    res.sendFile(path.join(dirpath, "frontend", "dist", "index.html"));
  });
}
// ...existing code...



app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})



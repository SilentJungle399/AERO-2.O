const express = require('express');
const { emailVerification, otpcheck, Signup, Login, logout, googleSignup } = require('../controllers/Authentication');
const { uploadMiddleware } = require('../controllers/uploadMiddleware');
const multer = require("multer");
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

const authRoutes = express.Router();

authRoutes.post("/check-admin", authMiddleware(['admin']), (req, res) => {
    res.status(200).json({ isAdmin: true });
});
authRoutes.post("/profileupload", upload.single("profile"), uploadMiddleware)
authRoutes.post("/emailverification", emailVerification);
authRoutes.post("/otpcheck", otpcheck);
authRoutes.post('/signup',Signup)
authRoutes.post('/google-signin',googleSignup)

authRoutes.post("/login", Login);
authRoutes.post("/logout", logout);

const updatechatbot=async(req,res)=>{
    const {pro_city,pro_locality,pro_amt,pro_area_size,pro_desc,link}=req.body;


    const response=await fetch('http://127.0.0.1:5000/home/update',{
        method:'post',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            pro_city,
            pro_locality,
            pro_amt,
            pro_area_size,
            pro_desc,
            link
        }),
        credentials:'include'
    });
    if(response.ok){
        
        console.log("model updated successfully");
        return res.json(response)
    }else{
        console.log(response.data)
        console.log("Error while recompliling");
        return res.json("Error while recompliling")

    }

}

authRoutes.post("/chatbotupdate", updatechatbot);


module.exports = authRoutes;
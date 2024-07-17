const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Your SMTP host
    port: 587, // Your SMTP port
    secure: false, // Set to true if your SMTP provider requires TLS
    auth: {
        user: process.env.USER_EMAIL, // Your email address
        pass: process.env.USER_PASS // Your email password
    }
});

// Function to send an email notification
const sendSignupEmailNotification = (full_name,email,) => {
    // Email content
    const message=`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333333;
            }
    
            p {
                color: #666666;
                line-height: 1.5;
            }
    
            ul {
                color: #666666;
            }
    
            li {
                margin-bottom: 10px;
            }
    
            .footer {
                margin-top: 20px;
                color: #999999;
                font-size: 12px;
            }
    
            .footer a {
                color: #999999;
                text-decoration: none;
            }
    
            .footer a:hover {
                color: #555555;
            }
        </style>
    </head>
    <body>
    
        <div class="container">
            <h1>Welcome to Our Hms!!</h1>
            <p>Dear ${full_name},</p>
            <p>We're thrilled to welcome you to our community! You've successfully onboarded to our service.</p>
            <p>This is your details :</p>
            <p>Name : ${full_name}</p>
            <p>Email : ${email}</p>
            <p>Here are a few things you can do to get started:</p>
            <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Connect with other users</li>
            </ul>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            <p>Thank you for choosing us. We're excited to have you on board!</p>
            <p class="footer">Best regards,<br>The Hms Team<br><a href="#">Visit our website</a></p>
        </div>
    
    </body>
    </html>
    `
    console.log(full_name,email)
    const mailOptions = {
        from: 'hms.nitkkr@gmail.com', // Sender address
        to: email, // Recipient address
        subject: 'Thankyou for signing up', // Subject line
        html: message // Plain text body
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};


const sendVerificationEmail = (email, otp) => {
   
    // Email content
    const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
                color: #333333;
            }
    
            p {
                color: #666666;
                line-height: 1.5;
            }
    
            .otp {
                margin-top: 20px;
                padding: 10px;
                background-color: #f0f0f0;
                border-radius: 5px;
                font-size: 18px;
            }
    
            .footer {
                margin-top: 20px;
                color: #999999;
                font-size: 12px;
            }
    
            .footer a {
                color: #999999;
                text-decoration: none;
            }
    
            .footer a:hover {
                color: #555555;
            }
        </style>
    </head>
    <body>
    
        <div class="container">
            <h1>Email Verification</h1>
            <p>Dear User!!,</p>
            <p>Please use the following OTP to verify your email address : ${email}</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request this verification, you can safely ignore this email.</p>
            <p class="footer">Best regards,<br>The Hms Team<br><a href="#">Visit our website</a></p>
        </div>
    
    </body>
    </html>
    `;

    const mailOptions = {
        from: 'hms.nitkkr@gmail.com', // Sender address
        to: email, // Recipient address
        subject: 'Email Verification OTP', // Subject line
        html: message // HTML content
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:1', error);
 
        } else {
            console.log('Email sent:', info.response);

        }
    });
};

module.exports = {sendVerificationEmail,sendSignupEmailNotification};

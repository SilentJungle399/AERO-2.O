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


const sendSelectionConfirmationEmail = (uid,name,email, inductionName, selectionDate, rollNumber, branch, year, phoneNumber, teamPreference, fileDownloadURLs) => {
    
    const fileHtml = fileDownloadURLs.map(url => {
        // Extract file extension
        const fileType = url.file_type.contentType;
        console.log(url)

        // Generate appropriate HTML based on file type
        if (fileType.includes('image')) {
            return `
                <div style="text-align: center; margin-bottom: 15px;">
                    <img src="${url.downloadURL}" alt="Uploaded image" style="width: 100%; height: auto; border-radius: 5px; margin-bottom: 10px;" />
                    <div>
                        <a href="${url.downloadURL}" download style="color: #0066cc; text-decoration: none; font-weight: bold;">Download Image</a>
                    </div>
                </div>`;
        } else if (fileType.includes('pdf')) {
            return `
                <div style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden; margin-bottom: 15px;">
                    <iframe src="${url.downloadURL}" style="width: 100%; height: 400px;" frameborder="0"></iframe>
                    <div style="text-align: center; margin-top: 10px;">
                        <a href="${url.downloadURL}" download style="color: #0066cc; text-decoration: none; font-weight: bold;">Download PDF</a>
                    </div>
                </div>`;
        } else if (fileType.includes('video')) {
            return `
                <div style="text-align: center; margin-bottom: 15px;">
                    <video src="${url.downloadURL}" controls style="width: 100%; height: auto; border-radius: 5px;">
                        Your browser does not support the video tag.
                    </video>
                </div>`;
        } else {
            return `<p>Unsupported file type: ${url.downloadURL}</p>`;
        }
        
    }).join('');
    // Email content
    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🎉🎉Congratulations on Your Selection!</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f7f9fc;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    overflow: hidden;
                }
                .header {
                    background-color: #0066cc;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 32px;
                }
                .content {
                    padding: 20px;
                }
                .content h2 {
                    color: #0066cc;
                    font-size: 24px;
                    margin-top: 0;
                }
                .content p {
                    font-size: 18px;
                    line-height: 1.6;
                }
                .info-box {
                    background-color: #f0f8ff;
                    border: 1px solid #0066cc;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .info-box ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                .info-box li {
                    margin-bottom: 10px;
                    font-size: 18px;
                }
                .info-box strong {
                    color: #0066cc;
                }
                .badge-box {
                    text-align: center;
                    margin: 20px 0;
                }
                .badge-box a {
                    display: inline-block;
                    padding: 15px 30px;
                    background-color: #0066cc;
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                }
                .badge-box a:hover {
                    background-color: #004b99;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #f1f1f1;
                    font-size: 16px;
                    color: #666;
                }
                .footer a {
                    color: #0066cc;
                    text-decoration: none;
                }
                .footer a:hover {
                    text-decoration: underline;
                }
                @media only screen and (max-width: 600px) {
                    .content p, .info-box li {
                        font-size: 16px;
                    }
                    .header h1 {
                        font-size: 28px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏅Congratulations, ${name}!</h1>
                </div>
                <div class="content">
                    <h2>Welcome to the AeroModelliing Club 🛩️🛩️🛩️!</h2>
                    <p>We're thrilled to inform you that you've been selected for the <strong>${inductionName}</strong> held on <strong>${selectionDate}</strong>. Your journey with us has just begun, and we're excited to see the amazing things you'll accomplish!</p>
                    
                    <div class="info-box">
                        <h2>Your Details:</h2>
                        <ul>
                            <li><strong>Roll Number:</strong> ${rollNumber}</li>
                            <li><strong>Branch:</strong> ${branch}</li>
                            <li><strong>Year:</strong> ${year}</li>
                            <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                            <li><strong>Team Preference:</strong> ${teamPreference}</li>
                        </ul>
                    </div>

                    <div class="badge-box">
                        <p>Share your achievement with your friends!</p>
                        <a href="process.env.BACKEND_ROUTE/aero-pride-of-houner/${uid}" target="_blank">Get Your Instagram Share Badge</a>
                    </div>

                    <div class="info-box">
                        <h2>Downloadable Files:</h2>
                        ${fileHtml}
                    </div>

                    <p>A big cheers 👏 for your enthusiasm and dedication🔥. If you have any questions, feel free to reach out to us.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The Aeromodelling Induction Team</p>
                    <p><a href="#">Visit our website</a> | <a href="#">Follow us on Instagram</a></p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'hms.nitkkr@gmail.com', // Sender address
        to: email, // Recipient address
        subject: '🎉 Congratulations on Your Selection! 🎉', // Subject line
        html: message, // HTML body
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


const sendParticipationConfirmationEmail = (name, email, inductionName, inductionDate, rollNumber, branch, year, phoneNumber, queries, teamPreference, hobbies, skills, inductionImagePath) => {
    // Email content
    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aeromodelling Induction Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    color: #0066cc;
                    text-align: center;
                    font-size: 28px;
                    margin-bottom: 20px;
                }
                img {
                    width: 100%;
                    height: auto;
                    margin-bottom: 20px;
                    border-radius: 10px;
                }
                .info-box {
                    background-color: #f0f8ff;
                    border: 1px solid #0066cc;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .info-box h2 {
                    color: #0066cc;
                    margin-top: 0;
                }
                ul {
                    list-style-type: none;
                    padding-left: 0;
                }
                li {
                    margin-bottom: 10px;
                }
                strong {
                    color: #0066cc;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 14px;
                    color: #666;
                }
                a {
                    color: #0066cc;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                @media only screen and (max-width: 600px) {
                    body {
                        padding: 10px;
                    }
                    h1 {
                        font-size: 24px;
                    }
                }
            </style>
        </head>
        <body>
            <h1>🛩️ Aeromodelling Induction Confirmation 🛩️</h1>
            
            <img src="${inductionImagePath}" alt="Aeromodelling Induction" />
            
            <div class="info-box">
                <h2>Dear ${name},</h2>
                <p>We're thrilled to confirm your successful participation in the <strong>${inductionName}</strong> held on <strong>${inductionDate}</strong>. Welcome to the exciting world of aeromodelling!</p>
            </div>
            
            <div class="info-box">
                <h2>Your Details:</h2>
                <ul>
                    <li><strong>Roll Number:</strong> ${rollNumber}</li>
                    <li><strong>Branch:</strong> ${branch}</li>
                    <li><strong>Year:</strong> ${year}</li>
                    <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                    <li><strong>Team Preference:</strong> ${teamPreference}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h2>Your Interests:</h2>
                <ul>
                    <li><strong>Hobbies:</strong> ${hobbies}</li>
                    <li><strong>Skills:</strong> ${skills}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h2>Your Queries:</h2>
                <p>${queries}</p>
            </div>
            
            <p>Thank you for your enthusiasm! We're excited to have you on board. If you have any further questions, don't hesitate to reach out.</p>
            
            <div class="footer">
                <p>Best regards,<br>The Aeromodelling Induction Team</p>
                <p><a href="#">Visit our website</a> | <a href="#">Follow us on Instagram</a></p>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: 'hms.nitkkr@gmail.com', // Sender address
        to: email, // Recipient address
        subject: '🛩️ Welcome to Aeromodelling! Induction Participation Confirmed', // Subject line
        html: message // HTML body
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

module.exports = {sendVerificationEmail,sendSignupEmailNotification,sendParticipationConfirmationEmail,sendSelectionConfirmationEmail};

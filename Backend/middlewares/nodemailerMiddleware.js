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

const sendTeamJoiningConfirmationEmail = (name, email, groupToken, groupName, eventDetails, leaderName, leaderContact, collegeName, branch, year, rollNumber, phoneNumber, paymentScreenshot) => {
  // Email content
  const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Team Joining Confirmation</title>
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
                    color: #28a745;
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
                    background-color: #e6ffed;
                    border: 1px solid #28a745;
                    border-radius: 5px;
                    padding: 15px;
                    margin-bottom: 20px;
                }
                .info-box h2 {
                    color: #28a745;
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
                    color: #28a745;
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
                    color: #28a745;
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
            <h1> Welcome to the Team!!</h1>
            
            
            <div class="info-box">
                <h2>Dear ${name},</h2>
                <p>Congratulations! You have successfully joined the team <strong>${groupName}</strong> under group token <strong>${groupToken}</strong>. We are excited to have you onboard and be a part of our journey in <strong>${eventDetails}</strong>.</p>
                <p className="text-gray-300 text-lg">
              Make sure to join this whatsapp group for staying connected and further details. <br /> <a href="https://chat.whatsapp.com/DeF1JHnE4dkFWEgPeWkZWJ" className="text-blue-800 font-mono font-bold mr-5" >**Join whatsapp group**</a>
            </p>
            </div>
            
            <div class="info-box">
                <h2>Your Team Details:</h2>
                <ul>
                    <li><strong>Group Leader:</strong> ${leaderName} (${leaderContact})</li>
                    <li><strong>Event:</strong> ${eventDetails}</li>
                    <li><strong>Group Token:</strong> ${groupToken}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h2>Your Details:</h2>
                <ul>
                    <li><strong>Roll Number:</strong> ${rollNumber}</li>
                    <li><strong>Branch:</strong> ${branch}</li>
                    <li><strong>Year:</strong> ${year}</li>
                    <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                    <li><strong>College Name:</strong> ${collegeName}</li>
                </ul>
            </div>
            
            <p>We are thrilled to have you as part of the prestigeous workshop. The path ahead is filled with exciting challenges, and we are confident that, together, we will achieve great things. Should you have any questions or need any support, please feel free to reach out to your group leader or us directly.</p>
            
            <div class="footer">
                <p>Best regards,<br>The Aeromodelling Team</p>
                <p><a href="#">Visit our website</a> | <a href="#">Follow us on Instagram</a></p>
            </div>
        </body>
        </html>
    `;

  const mailOptions = {
    from: `${process.env.USER_EMAIL}`, // Sender address
    to: email, // Recipient address
    subject: '🎉 Welcome to the Team! 🎉', // Subject line
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


const sendPasswordResetEmail = async (email, resetToken) => {
  // Create the reset URL
  const resetUrl = `https://${process.env.BACKEND_PROD_ROUTE}/forgotpassword/${resetToken}`;

  // Email content
  const message = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
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
    
            .reset-link {
                margin-top: 20px;
                padding: 10px;
                background-color: #f0f0f0;
                border-radius: 5px;
                font-size: 18px;
                text-align: center;
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
            <h1>Password Reset</h1>
            <p>Dear User,</p>
            <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
            <div class="reset-link">
                <a href="${resetUrl}" target="_blank">Reset Your Password</a>
            </div>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p class="footer">Best regards,<br>The Aeromodelling Team<br><a href="#">Visit our website</a></p>
        </div>
    
    </body>
    </html>
    `;

  const mailOptions = {
    from: `${process.env.USER_EMAIL}`,
    to: email,
    subject: 'Aeronitkkr.in Password Reset Mail',
    html: message
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

const sendSelectionConfirmationEmail = (uid, Iid, name, email, inductionName, selectionDate, rollNumber, branch, year, phoneNumber, teamPreference, fileDownloadURLs) => {

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
        <h1>🏅 Congratulations, ${name}!</h1>
    </div>
    <div class="content">
        <h2>Welcome to the AeroModelling Club!!</h2>
        <p>We're absolutely delighted to announce that you have been selected for the <strong>${inductionName}</strong> held on <strong>${selectionDate}</strong>. Your skills, dedication, and enthusiasm have earned you a place in this prestigious club, and we can’t wait to see how you’ll soar as part of our team. You’re now joining a legacy of creativity, innovation, and engineering excellence. Get ready for an exciting journey where the sky is truly the limit!</p>
        
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
            <h2>What Comes Next:</h2>
            <p>We are excited to see your active participation in upcoming projects, workshops, and events. As a member, you’ll have the chance to work with cutting-edge technologies, build incredible models, and compete in national and international competitions. Don’t hesitate to reach out to your team leads and mentors, who are here to guide you every step of the way. Make the most of this opportunity to collaborate with like-minded peers and hone your technical and leadership skills.</p>
        </div>

        <div class="info-box">
            <h2>Downloadable Files:</h2>
            <p>We’ve attached some important files below that will help you get started. Please go through the guidelines and onboarding material to get familiar with our processes:</p>
            ${fileHtml}
        </div>

        <div class="info-box">
            <h2>Stay Connected:</h2>
            <p>As part of the AeroModelling family, communication is key. Stay updated with the latest news, events, and team discussions by following us on our social media channels and website:</p>
            <ul>
                <li><a href="https://aeronitkkr.in">Visit our official website</a></li>
                <li><a href="https://www.instagram.com/aeroclub.nitkkr/">Follow us on Instagram</a></li>
            </ul>
        </div>

        <p>A big round of applause 👏 for your efforts and energy! We can’t wait to see you in action and be part of this fantastic journey ahead. If you have any queries or need support, our team is always here to assist you. Feel free to reach out to us at any time.</p>
    </div>
    
    <div class="footer">
        <p>Best regards,<br>The Aeromodelling Induction Team,<br>Nit kurukshetra</p>
    </div>
</div>

        </body>
        </html>
    `;

  const mailOptions = {
    from: `${process.env.USER_EMAIL}`, // Sender address
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
    from: `${process.env.USER_EMAIL}`, // Sender address
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

const sendWorkshopConfirmationEmail = (gLeaderName, gLeaderEmail, teamName, workshopName, groupToken, gLeaderMobile, gLeaderBranch, gLeaderYear, gLeaderRollNo, gLeaderCollegeName) => {
  // Email content
  const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Workshop Confirmation</title>
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
            </style>
        </head>
        <body>
            <h1> Aeromodelling Workshop Confirmation  </h1>
            
            <div class="info-box">
                <h2>Dear ${gLeaderName},</h2>
                <p>We are pleased to confirm your team's participation in the <strong>${workshopName}</strong> hosted by Aeromodelling club, Nit Kurukshetra. We appreciate your enthusiasm and look forward to an engaging experience!</p>
            </div>

            <div class="info-box">
                <h2>Next Steps:</h2>
                <p>Please share the TEAM TOKEN <strong>${groupToken}</strong> with your teammates. They will need to use this token to join your team for the workshop by entering it and filling in their details.</p>
                <p>It is important to keep this token secure within your team.</p>
                <p>If you need additional team members to meet the team size requirements, please join our WhatsApp group for assistance: <a href="https://chat.whatsapp.com/Los35zqZ6O31YKzcQHyPSh">Join here</a>.</p>
            </div>
            
            <div class="info-box">
                <h2>Your Team Details:</h2>
                <ul>
                    <li><strong>Team Name:</strong> ${teamName}</li>
                    <li><strong>Group Leader ID:</strong> ${groupToken}</li>
                </ul>
            </div>
            
            <div class="info-box">
                <h2>Group Leader Information:</h2>
                <ul>
                    <li><strong>Mobile:</strong> ${gLeaderMobile}</li>
                    <li><strong>Branch:</strong> ${gLeaderBranch}</li>
                    <li><strong>Year:</strong> ${gLeaderYear}</li>
                    <li><strong>Roll Number:</strong> ${gLeaderRollNo}</li>
                    <li><strong>College Name:</strong> ${gLeaderCollegeName}</li>
                </ul>
            </div>
            
            <p>We look forward to welcoming you and your team at the workshop. Should you have any questions, feel free to reach out to us.</p>
            
            <div class="footer">
                <p>Best regards,<br>The Workshop Coordination Team</p>
                <p><a href="https://aeronitkkr.in/">Visit our website</a> | <a href="https://www.instagram.com/aeroclub.nitkkr/">Follow us on Instagram</a></p>
            </div>
        </body>
        </html>
    `;

  const mailOptions = {
    from: `${process.env.USER_EMAIL}`, // Sender address
    to: gLeaderEmail, // Recipient address
    subject: ' Workshop Participation Confirmed', // Subject line
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
const sendSignupEmailNotification = (full_name, email,) => {
  // Email content
  const message = `<!DOCTYPE html>
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
            <p class="footer">Best regards,<br>The Aeromodelling Team<br><a href="#">Visit our website</a></p>
        </div>
    
    </body>
    </html>
    `
  console.log(full_name, email)
  const mailOptions = {
    from: `${process.env.USER_EMAIL}`, // Sender address
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
            <p class="footer">Best regards,<br>The Aeromodelling Team<br><a href="#">Visit our website</a></p>
        </div>
    
    </body>
    </html>
    `;

  const mailOptions = {
    from: `${process.env.USER_EMAIL}`, // Sender address
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


module.exports = {
  sendTeamJoiningConfirmationEmail,
  sendWorkshopConfirmationEmail,
  sendVerificationEmail,
  sendSignupEmailNotification,
  sendParticipationConfirmationEmail,
  sendSelectionConfirmationEmail,
  sendPasswordResetEmail
};

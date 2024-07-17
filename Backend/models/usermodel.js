const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        default:""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        default: "M"
    },
    date_of_joining: {
        type: Date,
        required: true
    },
    profile_pic: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'blogger', 'alumni', 'student'],
        default: 'user'
    },
    team_name: {
        type: String,
        default: "none"
    },
    branch: {
        type: String,
        default: ""
    },
    session: {
        type: String,
        default: ""
    },
    aadhar_no: {
        type: String,
        default: ""
    },
    college_name: {
        type: String,
        default: ""
    },
    mobile_no: {
        type: String,
        default: ""
    },
    ifsc_code: {
        type: String,
        default: ""
    },
    account_no: {
        type: String,
        default: ""
    },
    company_name: {
        type: String,
        default: ""
    },
    job_location: {
        type: String,
        default: ""
    },
    current_post: {
        type: String,
        default: ""
    },
    is_verified: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Generate JWT
userSchema.methods.generateAuthToken = function () {
    
    return jwt.sign({ id: this._id, email: this.email, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

};

// Compare passwords
userSchema.methods.comparePassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

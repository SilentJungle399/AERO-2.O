const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();
app.use(cors({
    origin: [
        'https://51.79.161.11',
        'http://localhost:3000'
    ],
    credentials: true // Enable credentials (cookies)
}));

app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.urlencoded({ extended: true }));


// console.log(process.env.MONGO_URI)

const connectToMongo = async () => {
    try {
        // Replace 'mongodb://localhost:27017/your_database_name' with your MongoDB connection URI
        
        const uri =process.env.MONGO_URI;
      await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Exit the process if MongoDB connection fails
        process.exit(1);
    }
};
connectToMongo();

// Regular User Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Authentication Routes
const authRoutes = require('./routes/authroutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
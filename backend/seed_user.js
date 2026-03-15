const mongoose = require('mongoose');
const Member = require('./models/Member');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gfg_rit');
        
        const existing = await Member.findOne({ email: 'test@ritchennai.edu.in' });
        if (existing) {
            console.log('Test user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await Member.create({
            name: 'Test Student',
            email: 'test@ritchennai.edu.in',
            password: hashedPassword,
            branch: 'CSE',
            year: '3rd Year'
        });

        console.log('Test user seeded! Email: test@ritchennai.edu.in, Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedUser();

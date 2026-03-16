const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gfg_rit');
        
        const existing = await Admin.findOne({ username: 'admin' });
        if (existing) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await Admin.create({
            username: 'admin',
            password: hashedPassword
        });

        console.log('Admin seeded! Username: admin, Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedAdmin();

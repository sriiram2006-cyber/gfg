const mongoose = require('mongoose');
const Resource = require('../models/Resource');
require('dotenv').config();

const resources = [
    {
        title: "DSA Self-Paced Course",
        category: "DSA Preparation",
        link: "https://www.geeksforgeeks.org/courses/dsa-self-paced",
        level: "Beginner",
        description: "The most popular course to master Data Structures and Algorithms."
    },
    {
        title: "Java Programming Foundation",
        category: "Beginner Programming",
        link: "https://www.geeksforgeeks.org/courses/java-programming-foundation",
        level: "Beginner",
        description: "Master Java from scratch with this comprehensive foundation course."
    },
    {
        title: "C++ Programming Foundation",
        category: "Beginner Programming",
        link: "https://www.geeksforgeeks.org/courses/cpp-programming-foundation",
        level: "Beginner",
        description: "Learn C++ fundamentals and object-oriented programming."
    },
    {
        title: "Complete Interview Preparation",
        category: "Interview Prep",
        link: "https://www.geeksforgeeks.org/courses/complete-interview-preparation",
        level: "Advanced",
        description: "All-in-one package for product-based company interviews."
    },
    {
        title: "System Design Strategy",
        category: "Interview Prep",
        link: "https://www.geeksforgeeks.org/courses/system-design-strategy",
        level: "Advanced",
        description: "Learn to design scalable systems for top tech companies."
    },
    {
        title: "Python Foundation Batch",
        category: "Beginner Programming",
        link: "https://www.geeksforgeeks.org/courses/python-foundation",
        level: "Beginner",
        description: "Start your coding journey with Python's easy-to-learn syntax."
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gfg_rit');
        console.log('Connected to MongoDB');

        // Optional: Clear existing resources if restoring
        // await Resource.deleteMany({});

        for (const res of resources) {
            await Resource.findOneAndUpdate(
                { title: res.title },
                res,
                { upsert: true, new: true }
            );
        }

        console.log('Successfully seeded resources with GfG course links!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding resources:', err);
        process.exit(1);
    }
}

seed();

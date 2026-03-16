const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');

dotenv.config();

const resources = [
    // Beginner Programming
    {
        title: 'C++ Foundation with DSA',
        category: 'Beginner Programming',
        link: 'https://www.geeksforgeeks.org/c-plus-plus/',
        level: 'Beginner',
        description: 'Master the basics of C++ and foundational programming concepts.'
    },
    {
        title: 'Java Programming Foundation',
        category: 'Beginner Programming',
        link: 'https://www.geeksforgeeks.org/java/',
        level: 'Beginner',
        description: 'Learn Java from scratch with clear examples and practice problems.'
    },
    {
        title: 'Python for Beginners',
        category: 'Beginner Programming',
        link: 'https://www.geeksforgeeks.org/python-programming-language/',
        level: 'Beginner',
        description: 'Start your coding journey with one of the most popular languages.'
    },

    // DSA Preparation
    {
        title: 'DSA Self-Paced Course',
        category: 'DSA Preparation',
        link: 'https://practice.geeksforgeeks.org/courses/dsa-self-paced',
        level: 'Intermediate',
        description: 'Complete Data Structures and Algorithms preparation for top tech companies.'
    },
    {
        title: 'Essential Data Structures',
        category: 'DSA Preparation',
        link: 'https://www.geeksforgeeks.org/data-structures/',
        level: 'Beginner',
        description: 'Deep dive into fundamental data structures like Arrays, Linked Lists, and stacks.'
    },
    {
        title: 'Mastering Algorithms',
        category: 'DSA Preparation',
        link: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/',
        level: 'Intermediate',
        description: 'Learn crucial algorithms from sorting to dynamic programming.'
    },

    // Interview Prep
    {
        title: 'GfG SDE Sheet',
        category: 'Interview Prep',
        link: 'https://www.geeksforgeeks.org/sde-sheet-a-complete-guide-for-sde-preparation/',
        level: 'Advanced',
        description: 'The ultimate collection of problems asked in top product-based companies.'
    },
    {
        title: 'System Design Tutorial',
        category: 'Interview Prep',
        link: 'https://www.geeksforgeeks.org/system-design-tutorial/',
        level: 'Advanced',
        description: 'Learn how to design scalable and reliable systems.'
    },
    {
        title: 'Core CS Subjects Notes',
        category: 'Interview Prep',
        link: 'https://www.geeksforgeeks.org/last-minute-notes-operating-systems/',
        level: 'Intermediate',
        description: 'Quick revision notes for OS, DBMS, and Networking.'
    }
];

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gfg_rit');
        
        // Clear existing resources
        await Resource.deleteMany({});
        console.log('Cleared existing resources');

        // Insert new resources
        await Resource.insertMany(resources);
        console.log('Seeded resources successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding resources:', error);
        process.exit(1);
    }
};

seedResources();

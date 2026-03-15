const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const seedProblem = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gfg_rit');
        
        const existing = await Problem.findOne({ title: 'Two Sum' });
        if (existing) {
            console.log('Problem already exists');
            process.exit(0);
        }

        await Problem.create({
            title: 'Two Sum',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
            difficulty: 'Easy',
            inputFormat: 'Line 1: Array of integers (comma separated)\nLine 2: Target integer',
            outputFormat: 'Indices of the two numbers in brackets [i, j]',
            constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9',
            testCases: [
                {
                    input: '[2,7,11,15]\n9',
                    expectedOutput: '[0,1]',
                    isSample: true
                }
            ],
            tags: ['Array', 'Hash Table']
        });

        console.log('Sample problem seeded!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedProblem();

const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const Member = require('../models/Member');
const judge0 = require('../services/judge0.service');

// @desc    Get all problems (User view)
// @route   GET /api/challenges
exports.getChallenges = async (req, res) => {
    try {
        const problems = await Problem.find({}, 'title difficulty tags').sort({ difficulty: 1 });
        res.status(200).json({ success: true, count: problems.length, data: problems });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single problem details
// @route   GET /api/challenges/:id
exports.getChallenge = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }
        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Submit code for a challenge
// @route   POST /api/challenges/:id/submit
exports.submitChallenge = async (req, res) => {
    try {
        const { code, language } = req.body;
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }

        // 1. Get sample test cases for initial feedback
        const sampleTestCase = problem.testCases.find(tc => tc.isSample) || problem.testCases[0];

        // 2. Submit to Judge0
        const result = await judge0.submitCode(
            code,
            language,
            sampleTestCase.input,
            sampleTestCase.expectedOutput
        );

        // 3. Save submission to DB
        const submission = await Submission.create({
            userId: req.user.id,
            problemId: problem._id,
            code,
            language,
            status: result.status.description,
            runtime: result.time,
            memory: result.memory,
            token: result.token
        });

        // 4. Update user score and solved problems if Accepted
        if (result.status.description === 'Accepted') {
            const member = await Member.findById(req.user.id);
            if (!member.solvedProblems.includes(problem._id)) {
                member.solvedProblems.push(problem._id);
                // Difficulty based scoring
                const scores = { 'Easy': 10, 'Medium': 30, 'Hard': 50 };
                member.score += scores[problem.difficulty] || 10;
                await member.save();
            }
        }

        res.status(200).json({
            success: true,
            data: {
                status: result.status.description,
                stdout: Buffer.from(result.stdout || '', 'base64').toString('utf-8'),
                stderr: Buffer.from(result.stderr || '', 'base64').toString('utf-8'),
                compile_output: Buffer.from(result.compile_output || '', 'base64').toString('utf-8'),
                time: result.time,
                memory: result.memory
            }
        });

    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};

// @desc    Generate an AI roadmap
// @route   POST /api/roadmap
// @access  Public
exports.generateRoadmap = async (req, res) => {
    try {
        const { skillLevel, language, goal, hoursPerDay } = req.body;

        if (!skillLevel || !language || !goal || !hoursPerDay) {
            return res.status(400).json({ success: false, error: 'Please provide all fields' });
        }

        // Mock AI Generation Engine
        let responseWeeks = [];

        if (goal === 'placement' || goal === 'cp') {
            responseWeeks = [
                {
                    week: 1,
                    title: `Foundations & Arrays in ${language}`,
                    tasks: [
                        'Time & Space Complexity Analysis',
                        'Array operations, Two Pointers Technique',
                        'Sliding Window basics'
                    ]
                },
                {
                    week: 2,
                    title: 'Strings & Hashing',
                    tasks: [
                        'String manipulations & Pattern matching',
                        'HashMaps & HashSets implementation',
                        'Weekly Revision Contest'
                    ]
                },
                {
                    week: 3,
                    title: 'Linked Lists',
                    tasks: [
                        'Singly & Doubly Linked Lists',
                        'Reversal, Tortoise & Hare algorithm',
                        'Standard Interview Questions'
                    ]
                },
                {
                    week: 4,
                    title: 'Trees & Recursion',
                    tasks: [
                        'Binary Tree Traversals',
                        'Recursion Depth First Search',
                        'Mock Interview Practice'
                    ]
                }
            ];
        } else if (goal === 'dev') {
            responseWeeks = [
                {
                    week: 1,
                    title: `Advanced ${language} Syntax`,
                    tasks: ['ES6+ Features', 'Asynchronous Programming', 'DOM Manipulation']
                },
                {
                    week: 2,
                    title: 'Framework Basics',
                    tasks: ['Component Architecture', 'State Management', 'Routing']
                },
                {
                    week: 3,
                    title: 'Backend Integration',
                    tasks: ['REST APIs', 'Authentication', 'Database Basics']
                },
                {
                    week: 4,
                    title: 'Deployment & CI/CD',
                    tasks: ['Hosting Platforms', 'Docker Basics', 'Project Showcase']
                }
            ];
        } else {
             responseWeeks = [
                {
                    week: 1,
                    title: `${language} Fundamentals`,
                    tasks: ['Variables & Data Types', 'Control Flow', 'Functions']
                },
                {
                    week: 2,
                    title: 'Data Structures',
                    tasks: ['Arrays', 'Objects/Dictionaries', 'Sets']
                },
                {
                    week: 3,
                    title: 'Algorithms',
                    tasks: ['Sorting', 'Searching', 'Recursion']
                },
                {
                    week: 4,
                    title: 'Project Building',
                    tasks: ['CLI App', 'Simple Web App', 'Code Review']
                }
            ];
        }

        // Artificial delay to simulate AI processing
        setTimeout(() => {
            res.status(200).json({
                success: true,
                data: {
                    profile: { skillLevel, language, goal, hoursPerDay },
                    roadmap: responseWeeks
                }
            });
        }, 1500);

    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

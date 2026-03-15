// Language IDs for Judge0
const LANGUAGE_IDS = {
    'python': 71,
    'java': 62,
    'cpp': 54,
    'javascript': 63
};

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

exports.submitCode = async (sourceCode, language, stdin, expectedOutput) => {
    try {
        // If no API key, simulate execution (for development)
        if (!RAPIDAPI_KEY) {
            console.log('No RapidAPI Key found, simulating Judge0 response...');
            return {
                stdout: Buffer.from(expectedOutput || '').toString('base64'),
                time: '0.01',
                memory: '1024',
                status: { id: 3, description: 'Accepted' }
            };
        }

        const url = `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            body: JSON.stringify({
                language_id: LANGUAGE_IDS[language] || 71,
                source_code: Buffer.from(sourceCode).toString('base64'),
                stdin: stdin ? Buffer.from(stdin).toString('base64') : null,
                expected_output: expectedOutput ? Buffer.from(expectedOutput).toString('base64') : null
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Judge0 Error:', errData);
            throw new Error('Code execution failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Judge0 Service Error:', error.message);
        throw error;
    }
};

exports.getSubmission = async (token) => {
    try {
        const url = `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            const errData = await response.json();
            console.error('Judge0 Error:', errData);
            throw new Error('Failed to fetch submission status');
        }

        return await response.json();
    } catch (error) {
        console.error('Judge0 Service Error:', error.message);
        throw error;
    }
};

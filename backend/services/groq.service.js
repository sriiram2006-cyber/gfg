const Groq = require('groq-sdk');

// @desc    Generate content using Groq Llama 3
// @param   {string} prompt - The prompt to send to the AI
// @returns {Promise<string>} - The AI generated response
exports.generateAIResponse = async (prompt) => {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
        throw new Error('AI service configuration missing. Please add GROQ_API_KEY to your .env file.');
    }

    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
    });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert AI coding mentor for the GeeksforGeeks Campus Club at RIT. Explain concepts clearly for college students. Help with DSA, competitive programming, web development, and placement preparation. Provide code examples when relevant (use markdown formatting). Be encouraging and supportive. Keep responses concise but thorough.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        return chatCompletion.choices[0].message.content;
    } catch (error) {
        console.error('Groq AI Service Error:', error.message);
        throw new Error('AI service unavailable via Groq.');
    }
};

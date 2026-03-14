const http = require('http');
const data = JSON.stringify({ question: 'Hello AI Mentor!' });
const req = http.request({
    hostname: '127.0.0.1', port: 5000, path: '/api/mentor',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
}, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const json = JSON.parse(body);
            console.log('Response Body:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Response Body (Non-JSON):', body);
        }
    });
});
req.on('error', (e) => console.error('Connection Error:', e.message));
req.write(data);
req.end();

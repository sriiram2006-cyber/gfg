const dns = require('dns');
const mongoose = require('mongoose');
require('dotenv').config();

// Explicitly use Google DNS servers for this process
dns.setServers(['8.8.8.8', '8.8.4.4']);

console.log('Testing DNS resolution for Atlas with Google DNS (8.8.8.8)...');
dns.resolveSrv('_mongodb._tcp.cluster0.isyjafw.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('DNS Resolve SRV Error:', err);
    } else {
        console.log('SRV Records found:', addresses);
    }
});

console.log('Attempting Mongoose connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Mongoose connected successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('Mongoose Connection Error:', err);
        process.exit(1);
    });

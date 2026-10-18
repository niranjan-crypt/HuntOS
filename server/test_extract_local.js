require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: 'test@example.com', name: 'Test' }, process.env.JWT_SECRET);

fetch('http://localhost:4000/api/ai/extract', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: 'This is a software engineer job at Google. Apply before Jan 1st. Package 10LPA.',
    title: 'Google Careers',
    url: 'https://careers.google.com'
  })
}).then(res => res.json()).then(console.log).catch(console.error);

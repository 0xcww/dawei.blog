const fs = require('fs');
const https = require('https');

const url = 'https://strovi.art/';
const outputFile = 'strovi-art.html';

console.log(`Fetching HTML from ${url}...`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    fs.writeFileSync(outputFile, data);
    console.log(`✓ HTML saved to ${outputFile}`);
    console.log(`File size: ${(data.length / 1024).toFixed(2)} KB`);
  });
}).on('error', (err) => {
  console.error('Error fetching HTML:', err.message);
  process.exit(1);
});

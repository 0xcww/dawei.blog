const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const baseUrl = 'https://curtis.art/';
const outputDir = 'curtis-art-assets';

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper function to download a file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    console.log(`Downloading: ${url}`);

    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirects
        downloadFile(res.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        console.log(`  ✗ Failed (${res.statusCode})`);
        resolve(false);
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`  ✓ Saved to ${outputPath}`);
        resolve(true);
      });
    }).on('error', (err) => {
      console.log(`  ✗ Error: ${err.message}`);
      resolve(false);
    });
  });
}

// Helper function to download text file (HTML, CSS, JS)
function downloadText(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadText(res.headers.location).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(null));
  });
}

async function main() {
  console.log('Starting download of curtis.art assets...\n');

  // Download main HTML
  console.log('1. Downloading main HTML...');
  const html = await downloadText(baseUrl);
  if (html) {
    fs.writeFileSync(path.join(outputDir, 'index.html'), html);
    console.log(`  ✓ Saved main HTML\n`);
  }

  // Download CSS
  console.log('2. Downloading CSS...');
  const cssUrl = new URL('indexstyle.css', baseUrl).href;
  const css = await downloadText(cssUrl);
  if (css) {
    fs.writeFileSync(path.join(outputDir, 'indexstyle.css'), css);
    console.log(`  ✓ Saved CSS\n`);
  }

  // Download JS
  console.log('3. Downloading JavaScript...');
  const jsUrl = new URL('img.js', baseUrl).href;
  const js = await downloadText(jsUrl);
  if (js) {
    fs.writeFileSync(path.join(outputDir, 'img.js'), js);
    console.log(`  ✓ Saved JavaScript\n`);
  }

  // Download images
  console.log('4. Downloading images...');
  const imagesDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const images = [
    'https://curtis.neocities.org/flair/CURTIS%20BANNER.png',
    'https://curtis.neocities.org/flair/button.png'
  ];

  for (const imgUrl of images) {
    const filename = path.basename(decodeURIComponent(imgUrl));
    await downloadFile(imgUrl, path.join(imagesDir, filename));
  }

  // Download additional pages referenced in HTML
  console.log('\n5. Downloading linked pages...');
  const pages = ['home.html', 'about.html', 'diary.html', 'funstuff.html', 'helpfulthings.html'];

  for (const page of pages) {
    const pageUrl = new URL(page, baseUrl).href;
    const pageContent = await downloadText(pageUrl);
    if (pageContent) {
      fs.writeFileSync(path.join(outputDir, page), pageContent);
      console.log(`  ✓ Saved ${page}`);
    }
  }

  console.log('\n✓ Download complete!');
  console.log(`All files saved to: ${outputDir}/`);
  console.log('\nYou can now:');
  console.log('- Open index.html in your browser');
  console.log('- Use the assets as reference for your Photoshop designs');
  console.log('- Study the CSS and layout structure');
}

main().catch(console.error);

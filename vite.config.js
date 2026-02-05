import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

function copyRecursiveSync(src, dest) {
  try {
    const exists = statSync(src, { throwIfNoEntry: false });
    if (exists && exists.isDirectory()) {
      mkdirSync(dest, { recursive: true });
      readdirSync(src).forEach(childItemName => {
        copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
      });
    } else if (exists) {
      copyFileSync(src, dest);
    }
  } catch(e) {
    console.log(`Error copying ${src} to ${dest}: ${e.message}`);
  }
}

export default defineConfig({
  // root: '.', // default
  server: {
    port: 3000,
    open: true
  },
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  plugins: [{
    name: 'copy-static-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      try {
          mkdirSync(distDir, { recursive: true });
      } catch(e){}

      const staticFiles = [
        'indexstyle.css',
        'indexstyle-dark.css',
        'galleriastyle.css',
        'galleriastyle-dark.css',
        'iframe.css',
        'iframe-dark.css',
        'img.js',
        'counter.js'
      ];

      const htmlFiles = [
        'home-light.html',
        'home-zh.html',
        'about-light.html',
        'about-zh.html',
        'blog-light.html',
        'blog-zh.html',
        'art-light.html',
        'art-zh.html',
        'guestbook-light.html',
        'guestbook-zh.html',
        'index-zh.html'
      ];

      [...staticFiles, ...htmlFiles].forEach(file => {
        try {
          copyFileSync(
            resolve(__dirname, file),
            join(distDir, file)
          );
        } catch (e) {
          console.log(`Failed to copy ${file}: ${e.message}`);
        }
      });

      // Directories
      copyRecursiveSync(resolve(__dirname, 'images'), join(distDir, 'images'));
      copyRecursiveSync(resolve(__dirname, 'flair'), join(distDir, 'flair'));
      copyRecursiveSync(resolve(__dirname, 'art'), join(distDir, 'art'));
      
      // Music (copy mp3s from root to dist/music)
      const musicDest = join(distDir, 'music');
      try { mkdirSync(musicDest, { recursive: true }); } catch(e){}
      try {
        readdirSync(__dirname).filter(f => f.endsWith('.mp3')).forEach(f => {
            copyFileSync(resolve(__dirname, f), join(musicDest, f));
        });
      } catch(e) {
          console.log(`Failed to copy music: ${e.message}`);
      }
    }
  }]
});
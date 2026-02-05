import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function copyRecursiveSync(src, dest) {
  const exists = statSync(src, { throwIfNoEntry: false });
  const isDirectory = exists && exists.isDirectory();

  if (isDirectory) {
    mkdirSync(dest, { recursive: true });
    readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else if (exists) {
    copyFileSync(src, dest);
  }
}

export default defineConfig({
  root: './curtis-art-assets',
  server: {
    port: 3000,
    open: true
  },
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './curtis-art-assets/index.html'
    }
  },
  plugins: [{
    name: 'copy-static-files',
    closeBundle() {
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

      try {
        [...staticFiles, ...htmlFiles].forEach(file => {
          try {
            copyFileSync(
              join('curtis-art-assets', file),
              join('curtis-art-assets', 'dist', file)
            );
          } catch (e) {}
        });

        copyRecursiveSync('curtis-art-assets/images', 'curtis-art-assets/dist/images');
        copyRecursiveSync('curtis-art-assets/flair', 'curtis-art-assets/dist/flair');
        copyRecursiveSync('curtis-art-assets/music', 'curtis-art-assets/dist/music');
        copyRecursiveSync('curtis-art-assets/ART', 'curtis-art-assets/dist/ART');
      } catch (e) {}
    }
  }]
});

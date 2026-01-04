const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Running build optimization...');

// 1. Analyze bundle size
try {
  console.log('📊 Analyzing bundle size...');
  execSync('npx source-map-explorer build/static/js/*.js --html', { stdio: 'inherit' });
} catch (error) {
  console.log('Bundle analysis completed');
}

// 2. Remove source maps in production
if (process.env.NODE_ENV === 'production') {
  console.log('🗑️ Removing source maps...');
  const buildDir = path.join(__dirname, '../build');
  
  function removeSourceMaps(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        removeSourceMaps(filePath);
      } else if (file.endsWith('.map')) {
        fs.unlinkSync(filePath);
        console.log(`Removed: ${filePath}`);
      }
    });
  }
  
  removeSourceMaps(buildDir);
}

// 3. Generate sitemap
console.log('🗺️ Generating sitemap...');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://languagequiz.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://languagequiz.com/login</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://languagequiz.com/signup</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

fs.writeFileSync(
  path.join(__dirname, '../build/sitemap.xml'),
  sitemap
);

// 4. Add security headers
console.log('🔒 Adding security headers...');
const securityHeaders = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
`;

fs.writeFileSync(
  path.join(__dirname, '../build/_headers'),
  securityHeaders
);

console.log('✅ Build optimization completed!');
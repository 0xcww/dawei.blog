# Custom Domain Setup Guide for WordPress.com Domain

## Important Note

This is a Vite-based static site project. If your domain is registered with WordPress.com, you'll need to point it to where this Vite site is actually hosted (Netlify, Vercel, GitHub Pages, etc.).

**You cannot host a Vite project directly on WordPress.com** - you need to deploy this project to a static hosting platform first.

## Common Hosting Platforms & Their DNS Records

### Option 1: If hosted on Netlify
Add these DNS records in your domain registrar:

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | 75.2.60.5                      | 3600 |
| CNAME | www  | your-site-name.netlify.app     | 3600 |

### Option 2: If hosted on Vercel
Add these DNS records:

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | 76.76.21.21                    | 3600 |
| CNAME | www  | cname.vercel-dns.com           | 3600 |

### Option 3: If hosted on GitHub Pages
Add these DNS records:

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | 185.199.108.153                | 3600 |
| A     | @    | 185.199.109.153                | 3600 |
| A     | @    | 185.199.110.153                | 3600 |
| A     | @    | 185.199.111.153                | 3600 |
| CNAME | www  | username.github.io             | 3600 |

### Option 4: If you have a custom server
Add these DNS records:

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | YOUR_SERVER_IP_ADDRESS         | 3600 |
| CNAME | www  | yourdomain.com                 | 3600 |

## Steps to Add DNS Records

### Most Domain Registrars (GoDaddy, Namecheap, Google Domains, etc.):

1. Log into your domain registrar account
2. Find "DNS Management" or "DNS Settings" for your domain
3. Add the records from the table above for your hosting platform
4. Save changes
5. Wait 24-48 hours for DNS propagation (usually faster, 1-2 hours)

### WordPress.com Domain Setup:

If your domain is registered with WordPress.com:

#### Step 1: Deploy Your Vite Site
First, deploy this project to a hosting platform:
- **Recommended**: Netlify, Vercel, or GitHub Pages
- Build command: `npm run build`
- Publish directory: `dist`

#### Step 2: Configure DNS in WordPress.com
1. Log in to WordPress.com
2. Go to **My Sites → Upgrades → Domains**
3. Click on your domain name
4. Click **Name Servers and DNS** (or **DNS Records**)
5. Add the DNS records for your hosting platform:

**For Netlify:**
- A Record: @ → 75.2.60.5
- CNAME: www → your-site-name.netlify.app

**For Vercel:**
- A Record: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com

**For GitHub Pages:**
- A Records: @ → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- CNAME: www → yourusername.github.io

#### Step 3: Configure Custom Domain in Hosting Platform
After DNS is set up, add your custom domain in your hosting platform's settings:
- **Netlify**: Site Settings → Domain Management → Add Custom Domain
- **Vercel**: Project Settings → Domains → Add Domain
- **GitHub Pages**: Repository Settings → Pages → Custom Domain

## After DNS is Set Up

1. **On your hosting platform** (Netlify/Vercel/etc):
   - Add your custom domain in the platform's settings
   - Enable HTTPS/SSL (usually automatic)

2. **Test your domain**:
   - Visit yourdomain.com in a browser
   - Check both with and without www

## Troubleshooting

- **DNS not working?** Use https://dnschecker.org to verify propagation
- **SSL errors?** Wait a few hours for SSL certificate generation
- **404 errors?** Make sure you added the domain in your hosting platform settings

## Need the BIND file?

The `dns-records.zone` file contains the same information in BIND zone file format, but most modern DNS providers use a web interface instead of importing BIND files.

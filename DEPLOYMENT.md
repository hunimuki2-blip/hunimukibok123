# ClipVibe Deployment Guide

## Overview
ClipVibe is a fully-featured TikTok-like video sharing platform. This guide covers all deployment options.

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd clipvibe
```

2. **Set up environment variables**
```bash
# Create a .env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

3. **Start all services with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
- **ClipVibe App**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081 (username: admin, password: admin)

5. **Stop services**
```bash
docker-compose down
```

## Manual Deployment

### Prerequisites
- Node.js v16 or later
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Install backend dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/clipvibe
JWT_SECRET=your-strong-secret-key
PORT=5000
NODE_ENV=production
```

3. **Create uploads directory**
```bash
mkdir -p public/uploads/videos public/uploads/thumbnails
```

4. **Start backend server**
```bash
npm start
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Build for production**
```bash
npm run build
```

4. **Serve the built app**
```bash
# From the project root
npm run serve
```

Or use any static server:
```bash
npx serve -s frontend/build -l 3000
```

## Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel)**
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com`

**Backend (Railway)**
1. Create new project in Railway
2. Connect GitHub repository
3. Set environment variables:
   - MONGO_URI: Your MongoDB connection string
   - JWT_SECRET: Your secret key
   - NODE_ENV: production
4. Deploy

### Option 2: Cyclic (Full Stack)

The project includes `cyclic.json` for easy deployment:

1. Install Cyclic CLI:
```bash
npm install -g cyclic
```

2. Link your project:
```bash
cyclic link
```

3. Deploy:
```bash
cyclic deploy
```

### Option 3: Heroku

1. Create Heroku app:
```bash
heroku create your-app-name
```

2. Add MongoDB addon:
```bash
heroku addons:create mongodb
```

3. Set environment variables:
```bash
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

### Option 4: AWS / DigitalOcean / VPS

1. **Install Node.js and MongoDB**
2. **Clone repository**
3. **Follow manual deployment steps above**
4. **Set up reverse proxy (Nginx/Apache)**
5. **Set up PM2 for process management**

Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /uploads/ {
        alias /path/to/your/app/public/uploads/;
        expires 30d;
    }
}
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| MONGO_URI | MongoDB connection string | Yes | mongodb://localhost:27017/clipvibe |
| JWT_SECRET | JWT signing secret | Yes | clipvibe-secret |
| PORT | Server port | No | 3000 (production), 5000 (development) |
| NODE_ENV | Environment mode | No | development |

## Database Setup

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Whitelist your IP address
4. Create a database user
5. Get connection string and add to MONGO_URI

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/clipvibe`

## Scaling Considerations

### For High Traffic:
- Use MongoDB Atlas with dedicated cluster
- Implement Redis for caching
- Use CDN for video storage (AWS S3, Cloudflare R2)
- Consider microservices architecture
- Implement load balancing

### Video Storage Optimization:
- Store videos in cloud storage (S3, Google Cloud Storage)
- Use streaming protocols (HLS, DASH)
- Implement video transcoding for multiple qualities
- Use CDN for video delivery

## Monitoring

### Logging
- Use Winston or Morgan for request logging
- Implement error tracking (Sentry, Rollbar)

### Metrics
- Track user engagement (views, likes, shares)
- Monitor API response times
- Track video upload success rates

## Security Checklist

- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use HTTPS in production
- [ ] Set secure cookies
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Sanitize user input
- [ ] Validate file uploads
- [ ] Set proper CORS headers
- [ ] Regular security audits

## Troubleshooting

### Common Issues

**1. MongoDB connection failed**
- Check MONGO_URI is correct
- Verify MongoDB is running
- Check firewall settings

**2. Frontend can't connect to backend**
- Verify CORS settings
- Check API URL in frontend
- Ensure backend is running

**3. Video uploads failing**
- Check upload directory permissions
- Verify file size limits
- Check storage space

**4. Build errors**
- Delete node_modules and reinstall
- Check Node.js version
- Verify all dependencies are installed

### Debug Mode

Set NODE_ENV=development for detailed error messages:
```bash
NODE_ENV=development npm start
```

## Updates

To update your deployment:

1. Pull latest changes:
```bash
git pull origin main
```

2. Reinstall dependencies:
```bash
npm install
cd frontend && npm install
```

3. Rebuild and restart:
```bash
cd frontend && npm run build
pm2 restart all
```

## Support

For issues or questions:
- Check the README.md for basic information
- Review this deployment guide
- Check application logs
- Open an issue on GitHub

---

**Happy Deploying!** 🚀

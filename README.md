# ClipVibe - TikTok-like Video Sharing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

**ClipVibe** is a fully-featured, production-ready TikTok-like video sharing platform built with modern web technologies. Create, share, and discover short videos with an engaging user experience.

## ✨ Features

### Core Features
- **User Authentication**: Secure registration, login, and profile management
- **Video Upload**: Upload videos with titles, descriptions, and hashtags
- **For You Page**: Personalized video feed with infinite scrolling
- **Trending Videos**: Discover popular content with engagement-based ranking
- **Search**: Search videos by title, description, or hashtags
- **Hashtags**: Browse and discover videos by hashtag
- **User Profiles**: View and edit profiles, follow users
- **Video Interaction**: Like, comment, and share videos
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Advanced Features
- **Infinite Scroll**: Seamless browsing experience
- **Video Player**: Custom player with play/pause, volume, fullscreen controls
- **Real-time Updates**: Instant feedback on likes and comments
- **Social Features**: Follow users, view follower/following counts
- **Analytics**: View counts, like counts, comment counts
- **Content Discovery**: Trending page with filtering options

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd clipvibe

# Start all services (app + MongoDB)
docker-compose up -d

# Access the application
# - ClipVibe: http://localhost:3000
# - MongoDB Admin: http://localhost:8081 (admin/admin)
```

### Option 2: Manual Setup

**Prerequisites:**
- Node.js v16 or later
- MongoDB (local or cloud)
- npm or yarn

```bash
# Clone the repository
git clone <repository-url>
cd clipvibe

# Install dependencies
npm install
cd frontend && npm install
cd ..

# Create environment file
cp .env.example .env

# Edit .env with your MongoDB connection string
nano .env

# Create uploads directory
mkdir -p public/uploads/videos public/uploads/thumbnails

# Start backend server (in one terminal)
npm start

# Start frontend (in another terminal)
cd frontend
npm start

# Access the application
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
```

## 📁 Project Structure

```
clipvibe/
├── backend/                    # Backend API
│   ├── controllers/           # Route controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── feedController.js  # Feed and search logic
│   │   ├── userController.js  # User profile logic
│   │   └── videoController.js # Video management logic
│   ├── middleware/            # Express middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/                # MongoDB models
│   │   ├── Comment.js         # Comment model
│   │   ├── User.js            # User model
│   │   └── Video.js           # Video model
│   ├── routes/                # Express routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── feed.js            # Feed routes
│   │   ├── users.js           # User routes
│   │   └── videos.js          # Video routes
│   └── server.js              # Express server configuration
├── frontend/                   # React Frontend
│   ├── public/                # Static files
│   └── src/                   # Source code
│       ├── components/       # React components
│       │   ├── Navbar.js      # Navigation bar
│       │   ├── Sidebar.js     # Side navigation
│       │   ├── VideoCard.js   # Video card component
│       │   └── VideoPlayer.js # Custom video player
│       ├── pages/            # Page components
│       │   ├── ForYouPage.js  # For You feed page
│       │   ├── HomePage.js    # Landing page
│       │   ├── LoginPage.js   # Login page
│       │   ├── ProfilePage.js # User profile page
│       │   ├── RegisterPage.js# Registration page
│       │   ├── SearchPage.js  # Search results page
│       │   ├── TrendingPage.js# Trending videos page
│       │   ├── UploadPage.js  # Video upload page
│       │   └── VideoPage.js   # Single video page
│       ├── App.js             # Main app component
│       ├── index.js          # Entry point
│       └── index.css         # Global styles
├── public/                    # Public assets
│   └── uploads/               # Uploaded videos and thumbnails
│       ├── videos/
│       └── thumbnails/
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── cyclic.json               # Cyclic deployment configuration
├── DEPLOYMENT.md             # Detailed deployment guide
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Docker configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env`:

```
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/clipvibe

# JWT Secret (change this to a strong, random string)
JWT_SECRET=your-strong-secret-key-change-me

# Server Port
PORT=5000

# Environment Mode
NODE_ENV=development
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Whitelist your IP address
4. Create a database user
5. Get connection string and add to MONGO_URI

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Videos
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/videos/:id` | Get video by ID | No |
| POST | `/api/videos` | Upload video | Yes |
| POST | `/api/videos/:id/like` | Like video | Yes |
| POST | `/api/videos/:id/unlike` | Unlike video | Yes |
| POST | `/api/videos/:id/comments` | Add comment | Yes |
| GET | `/api/videos/user/:userId` | Get user videos | No |
| DELETE | `/api/videos/:id` | Delete video | Yes |

### Feed
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/feed` | Get feed videos | No |
| GET | `/api/feed/trending` | Get trending videos | No |
| GET | `/api/feed/hashtag/:hashtag` | Get videos by hashtag | No |
| GET | `/api/feed/search` | Search videos | No |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/:id` | Get user profile | No |
| POST | `/api/users/:id/follow` | Follow user | Yes |
| POST | `/api/users/:id/unfollow` | Unfollow user | Yes |
| GET | `/api/users/:id/followers` | Get user followers | No |
| GET | `/api/users/:id/following` | Get user following | No |
| PUT | `/api/users/me` | Update profile | Yes |
| GET | `/api/users/suggested` | Get suggested users | Yes |

## 🎨 Customization

### Change App Name
Edit the following files:
- `frontend/src/components/Navbar.js` - Logo text
- `frontend/src/components/Sidebar.js` - Logo text
- `frontend/public/index.html` - Title tag

### Change Colors
Edit the CSS variables in `frontend/src/index.css`:

```css
:root {
  --primary: #ff2d55;        /* Main brand color */
  --primary-dark: #e6244a;  /* Darker variant */
  --secondary: #00f2ea;     /* Accent color */
  --background: #000000;   /* Main background */
  --background-secondary: #121212;
  --background-tertiary: #1e1e1e;
  --text: #ffffff;          /* Primary text */
  --text-secondary: #a0a0a0;
  --text-tertiary: #606060;
  --border: #303030;        /* Border color */
  --success: #00d54b;
  --warning: #ffa500;
  --error: #ff3b30;
}
```

### Change Default Video Duration
Edit `backend/controllers/videoController.js`:
```javascript
// Change this line
const duration = 30; // Default duration in seconds
```

## 🚀 Deployment

### Quick Deployment Options

#### 1. Cyclic (Recommended for Full Stack)
```bash
# Install Cyclic CLI
npm install -g cyclic

# Link your project
cyclic link

# Deploy
cyclic deploy
```

#### 2. Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy to Vercel with build command `cd frontend && npm install && npm run build`
- **Backend**: Deploy to Railway with MongoDB addon

#### 3. Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

#### 4. Heroku
```bash
# Create Heroku app
heroku create your-app-name

# Add MongoDB
heroku addons:create mongodb

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start production server
NODE_ENV=production npm start
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

The sidebar collapses on mobile for better viewing experience.

## 🔒 Security

### Implemented Security Features
- JWT authentication with token expiration
- Password hashing with bcrypt
- Input validation
- File type validation for uploads
- CORS configuration
- Environment variable protection

### Security Checklist for Production
- [ ] Change JWT_SECRET to a strong, random string
- [ ] Use HTTPS in production
- [ ] Set secure cookies
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Regular security audits

## 📊 Performance

### Optimizations
- Video thumbnails for faster loading
- Pagination for feed and search results
- Indexed database queries
- Compressed production build
- Efficient state management

### Recommended for High Traffic
- Use MongoDB Atlas with dedicated cluster
- Implement Redis for caching
- Use CDN for video storage (AWS S3, Cloudflare R2)
- Consider microservices architecture
- Implement load balancing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and MongoDB
- Inspired by TikTok's engaging video experience
- Uses modern web development best practices

## 📞 Support

For issues or questions:
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review this README for setup instructions
- Open an issue on GitHub

---

**Made with ❤️ for video creators everywhere**

*ClipVibe - Share Your Moments*

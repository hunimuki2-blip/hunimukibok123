# ClipVibe - Video Sharing Platform

A TikTok-like video sharing platform built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Register, login, and profile management
- **Video Upload**: Upload videos with titles, descriptions, and hashtags
- **Feed System**: For You page with video recommendations
- **Trending Videos**: Discover popular content
- **Search**: Search videos by title, description, or hashtags
- **Hashtags**: Browse videos by hashtag
- **User Profiles**: View and edit profiles, follow users
- **Video Interaction**: Like, comment, and share videos
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18
- React Router 6
- Styled Components
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File uploads)

## Setup Instructions

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd clipvibe
```

2. **Install dependencies**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` file with your MongoDB connection string and JWT secret:
```
MONGO_URI=mongodb://localhost:27017/clipvibe
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

4. **Create uploads directory**
```bash
mkdir -p public/uploads/videos public/uploads/thumbnails
```

5. **Start the development servers**

Open two terminal windows:

**Terminal 1 - Backend**
```bash
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
clipvibe/
├── backend/
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # Express routes
│   ├── middleware/       # Authentication middleware
│   └── server.js         # Express server
├── frontend/
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── App.js        # Main app component
│       └── index.js      # Entry point
├── package.json          # Project dependencies
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload video (auth required)
- `POST /api/videos/:id/like` - Like video (auth required)
- `POST /api/videos/:id/unlike` - Unlike video (auth required)
- `POST /api/videos/:id/comments` - Add comment (auth required)
- `GET /api/videos/user/:userId` - Get user videos
- `DELETE /api/videos/:id` - Delete video (auth required)

### Feed
- `GET /api/feed` - Get feed videos
- `GET /api/feed/trending` - Get trending videos
- `GET /api/feed/hashtag/:hashtag` - Get videos by hashtag
- `GET /api/feed/search` - Search videos

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow user (auth required)
- `POST /api/users/:id/unfollow` - Unfollow user (auth required)
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get user following
- `PUT /api/users/me` - Update profile (auth required)
- `GET /api/users/suggested` - Get suggested users (auth required)

## Customization

### Change App Name
Edit the following files:
- `frontend/src/components/Navbar.js` - Logo text
- `frontend/src/components/Sidebar.js` - Logo text
- `public/index.html` - Title tag

### Change Colors
Edit the CSS variables in `frontend/src/index.css`:
```css
:root {
  --primary: #ff2d55;
  --primary-dark: #e6244a;
  --secondary: #00f2ea;
  --background: #000000;
  /* ... */
}
```

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start production server
NODE_ENV=production npm start
```

### Docker (Optional)
Create a Dockerfile and docker-compose.yml for containerized deployment.

## License

MIT License

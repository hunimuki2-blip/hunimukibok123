import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const VideoCardContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 225px;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .play-icon {
    position: absolute;
    font-size: 3rem;
    color: white;
    opacity: 0.8;
  }
`;

const VideoInfo = styled.div`
  padding: 0.75rem;
  background-color: var(--background-secondary);
`;

const VideoTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-tertiary);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const VideoActions = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 45, 85, 0.8);
  }
  
  .count {
    font-size: 0.7rem;
  }
`;

const VideoCard = ({ video, user, showActions = true }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.likes?.length || 0);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if current user liked the video
    if (user && video.likes) {
      setIsLiked(video.likes.includes(user._id));
    }
  }, [user, video.likes]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (isLiked) {
        await axios.post(`/api/videos/${video._id}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post(`/api/videos/${video._id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const handleCardClick = () => {
    navigate(`/video/${video._id}`);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <VideoCardContainer 
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {video.thumbnailUrl ? (
        <Thumbnail>
          <img src={video.thumbnailUrl} alt={video.title} />
          <div className="play-icon">▶</div>
        </Thumbnail>
      ) : (
        <Thumbnail>
          <div className="play-icon">▶</div>
        </Thumbnail>
      )}
      
      {isHovered && showActions && (
        <VideoActions>
          <ActionButton onClick={handleLike}>
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span className="count">{formatNumber(likeCount)}</span>
          </ActionButton>
          <ActionButton>
            <span>💬</span>
            <span className="count">{formatNumber(video.comments?.length || 0)}</span>
          </ActionButton>
          <ActionButton>
            <span>🔗</span>
            <span className="count">{formatNumber(video.shares || 0)}</span>
          </ActionButton>
        </VideoActions>
      )}
      
      <VideoInfo>
        <VideoTitle>{video.title || 'Untitled Video'}</VideoTitle>
        <UserInfo>
          <UserAvatar>
            {video.creator?.profilePic ? (
              <img src={video.creator.profilePic} alt={video.creator?.username} />
            ) : (
              video.creator?.username?.charAt(0).toUpperCase()
            )}
          </UserAvatar>
          <UserName>{video.creator?.username || 'Unknown'}</UserName>
        </UserInfo>
        <Stats>
          <Stat>👁 {formatNumber(video.views || 0)}</Stat>
          <Stat>⏱ {formatTime(video.duration || 0)}</Stat>
        </Stats>
      </VideoInfo>
    </VideoCardContainer>
  );
};

export default VideoCard;

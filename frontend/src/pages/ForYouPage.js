import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';

const ForYouPageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const VideoContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
  background-color: var(--background-secondary);
  border-radius: 12px;
  overflow: hidden;
`;

const VideoInfo = styled.div`
  padding: 1rem;
`;

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-size: 0.9rem;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: var(--primary);
  }
`;

const FollowButton = styled.button`
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  background-color: ${({ following }) => following ? 'var(--background-tertiary)' : 'var(--primary)'};
  color: ${({ following }) => following ? 'var(--text)' : 'white'};
  border: ${({ following }) => following ? '1px solid var(--border)' : 'none'};
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ following }) => following ? 'var(--border)' : 'var(--primary-dark)'};
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Description = styled.p`
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--background-tertiary);
    color: var(--text);
  }
  
  .icon {
    font-size: 1.2rem;
  }
  
  .count {
    font-size: 0.85rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ForYouPage = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`/api/feed?page=${page}&limit=5`);
        setVideos(prev => [...prev, ...response.data.videos]);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [page]);

  const handleVideoEnd = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (videos.length >= page * 5) {
      setPage(prev => prev + 1);
    }
  }, [currentIndex, videos.length, page]);

  const handleLike = async (videoId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/videos/${videoId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state
      setVideos(prev => prev.map(video => 
        video._id === videoId 
          ? { ...video, likes: [...video.likes, user._id] } 
          : video
      ));
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const currentVideo = videos[currentIndex];

  return (
    <ForYouPageContainer>
      {loading && videos.length === 0 ? (
        <Loading>Loading videos...</Loading>
      ) : (
        videos.map((video, index) => (
          <VideoContainer key={video._id} style={{ display: index === currentIndex ? 'block' : 'none' }}>
            <VideoPlayer
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              onEnded={index === currentIndex ? handleVideoEnd : undefined}
            />
            <VideoInfo>
              <VideoTitle>{video.title || 'Untitled Video'}</VideoTitle>
              <UserInfo>
                <UserAvatar onClick={() => window.location.href = `/profile/${video.creator?._id}`}>
                  {video.creator?.profilePic ? (
                    <img src={video.creator.profilePic} alt={video.creator?.username} />
                  ) : (
                    video.creator?.username?.charAt(0).toUpperCase()
                  )}
                </UserAvatar>
                <UserName onClick={() => window.location.href = `/profile/${video.creator?._id}`}>
                  {video.creator?.username || 'Unknown'}
                </UserName>
                {user && user._id !== video.creator?._id && (
                  <FollowButton following={user.following?.includes(video.creator?._id)}>
                    {user.following?.includes(video.creator?._id) ? 'Following' : 'Follow'}
                  </FollowButton>
                )}
              </UserInfo>
              <Stats>
                <Stat>👁 {formatNumber(video.views || 0)} views</Stat>
                <Stat>❤️ {formatNumber(video.likes?.length || 0)} likes</Stat>
                <Stat>💬 {formatNumber(video.comments?.length || 0)} comments</Stat>
              </Stats>
              {video.description && (
                <Description>{video.description}</Description>
              )}
              <Actions>
                <ActionButton onClick={() => handleLike(video._id)}>
                  <span className="icon">❤️</span>
                  <span className="count">{formatNumber(video.likes?.length || 0)}</span>
                </ActionButton>
                <ActionButton>
                  <span className="icon">💬</span>
                  <span className="count">Comment</span>
                </ActionButton>
                <ActionButton>
                  <span className="icon">🔗</span>
                  <span className="count">Share</span>
                </ActionButton>
              </Actions>
            </VideoInfo>
          </VideoContainer>
        ))
      )}
      
      {loading && videos.length > 0 && (
        <Loading>Loading more videos...</Loading>
      )}
    </ForYouPageContainer>
  );
};

export default ForYouPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';

const VideoPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const VideoSection = styled.section`
  margin-bottom: 2rem;
`;

const VideoInfo = styled.div`
  padding: 1rem 0;
`;

const VideoTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
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
  font-size: 1rem;
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    color: var(--primary);
  }
`;

const FollowButton = styled.button`
  margin-left: auto;
  padding: 0.5rem 1rem;
  background-color: ${({ following }) => following ? 'var(--background-tertiary)' : 'var(--primary)'};
  color: ${({ following }) => following ? 'var(--text)' : 'white'};
  border: ${({ following }) => following ? '1px solid var(--border)' : 'none'};
  border-radius: 15px;
  font-size: 0.85rem;
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
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  ${({ liked }) => liked && `
    color: var(--primary);
  `}
  
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

const CommentsSection = styled.section`
  margin-top: 2rem;
`;

const CommentsHeader = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 1rem;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: var(--background-tertiary);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text);
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const CommentButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--border);
    cursor: not-allowed;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Comment = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 8px;
`;

const CommentAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const CommentContent = styled.div`
  flex: 1;
`;

const CommentUser = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
  display: block;
`;

const CommentText = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const VideoPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/api/videos/${id}`);
        setVideo(response.data);
        setLikeCount(response.data.likes?.length || 0);
        if (user) {
          setIsLiked(response.data.likes?.includes(user._id) || false);
        }
      } catch (err) {
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (isLiked) {
        await axios.post(`/api/videos/${id}/unlike`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.post(`/api/videos/${id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
      
      // Update video data
      setVideo(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(likeId => likeId !== user._id)
          : [...prev.likes, user._id]
      }));
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/videos/${id}/comments`, {
        content: comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComment('');
      // Refresh video data
      const response = await axios.get(`/api/videos/${id}`);
      setVideo(response.data);
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Loading>Loading video...</Loading>;
  }

  if (!video) {
    return <Loading>Video not found</Loading>;
  }

  return (
    <VideoPageContainer>
      <VideoSection>
        <VideoPlayer
          src={video.videoUrl}
          poster={video.thumbnailUrl}
        />
        
        <VideoInfo>
          <VideoTitle>{video.title || 'Untitled Video'}</VideoTitle>
          <UserInfo>
            <UserAvatar onClick={() => navigate(`/profile/${video.creator?._id}`)}>
              {video.creator?.profilePic ? (
                <img src={video.creator.profilePic} alt={video.creator?.username} />
              ) : (
                video.creator?.username?.charAt(0).toUpperCase()
              )}
            </UserAvatar>
            <UserName onClick={() => navigate(`/profile/${video.creator?._id}`)}>
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
            <Stat>❤️ {formatNumber(likeCount)} likes</Stat>
            <Stat>💬 {formatNumber(video.comments?.length || 0)} comments</Stat>
            <Stat>📅 {formatDate(video.createdAt)}</Stat>
          </Stats>
          
          {video.description && (
            <Description>{video.description}</Description>
          )}
          
          {video.hashtags?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {video.hashtags.map(tag => (
                <span
                  key={tag}
                  onClick={() => navigate(`/hashtag/${tag}`)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--background-tertiary)',
                    borderRadius: '12px',
                    color: 'var(--primary)',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          <Actions>
            <ActionButton liked={isLiked} onClick={handleLike}>
              <span className="icon">❤️</span>
              <span className="count">{formatNumber(likeCount)}</span>
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
      </VideoSection>

      <CommentsSection>
        <CommentsHeader>{formatNumber(video.comments?.length || 0)} Comments</CommentsHeader>
        
        {user && (
          <CommentForm onSubmit={handleComment}>
            <CommentInput
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <CommentButton type="submit" disabled={!comment.trim()}>
              Post
            </CommentButton>
          </CommentForm>
        )}
        
        <CommentsList>
          {video.comments?.map(comment => (
            <Comment key={comment._id}>
              <CommentAvatar>
                {comment.user?.profilePic ? (
                  <img src={comment.user.profilePic} alt={comment.user?.username} />
                ) : (
                  comment.user?.username?.charAt(0).toUpperCase()
                )}
              </CommentAvatar>
              <CommentContent>
                <CommentUser>{comment.user?.username || 'Unknown'}</CommentUser>
                <CommentText>{comment.content}</CommentText>
              </CommentContent>
            </Comment>
          ))}
        </CommentsList>
      </CommentsSection>
    </VideoPageContainer>
  );
};

export default VideoPage;

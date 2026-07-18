import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const ProfilePageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.header`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 3rem;
  font-weight: 600;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const Bio = styled.p`
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const ProfileActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ primary }) => primary ? `
    background-color: var(--primary);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  ` : `
    background-color: var(--background-tertiary);
    color: var(--text);
    border: 1px solid var(--border);
    
    &:hover {
      background-color: var(--border);
    }
  `}
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  ${({ active }) => active && `
    background-color: var(--background-tertiary);
    color: var(--text);
  `}
  
  &:hover {
    background-color: var(--background-tertiary);
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const EditProfileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--background-secondary);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
`;

const ProfilePage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, videosRes] = await Promise.all([
          axios.get(`/api/users/${id}`),
          axios.get(`/api/videos/user/${id}`)
        ]);
        setProfile(profileRes.data);
        setVideos(videosRes.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${id}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        followers: [...prev.followers, user._id],
        isFollowing: true
      }));
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${id}/unfollow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        followers: prev.followers.filter(f => f !== user._id),
        isFollowing: false
      }));
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/me', {
        username: editUsername,
        bio: editBio
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(prev => ({
        ...prev,
        username: editUsername,
        bio: editBio
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  if (loading) {
    return <Loading>Loading profile...</Loading>;
  }

  if (!profile) {
    return <Loading>Profile not found</Loading>;
  }

  const isOwnProfile = user && user._id === profile._id;

  return (
    <ProfilePageContainer>
      <ProfileHeader>
        <ProfileAvatar>
          {profile.profilePic ? (
            <img src={profile.profilePic} alt={profile.username} />
          ) : (
            profile.username.charAt(0).toUpperCase()
          )}
        </ProfileAvatar>
        
        <ProfileInfo>
          <Username>{profile.username}</Username>
          <Bio>{profile.bio || 'No bio yet'}</Bio>
          <Stats>
            <Stat>
              <StatNumber>{formatNumber(profile.videos?.length || 0)}</StatNumber>
              <StatLabel>Videos</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{formatNumber(profile.followers?.length || 0)}</StatNumber>
              <StatLabel>Followers</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{formatNumber(profile.following?.length || 0)}</StatNumber>
              <StatLabel>Following</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{formatNumber(profile.totalLikes || 0)}</StatNumber>
              <StatLabel>Likes</StatLabel>
            </Stat>
          </Stats>
          
          <ProfileActions>
            {isOwnProfile ? (
              <>
                <Button primary onClick={() => setShowEditModal(true)}>Edit Profile</Button>
                <Button onClick={() => navigate('/upload')}>Upload Video</Button>
              </>
            ) : (
              user && (
                profile.isFollowing ? (
                  <Button onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button primary onClick={handleFollow}>Follow</Button>
                )
              )
            )}
          </ProfileActions>
        </ProfileInfo>
      </ProfileHeader>

      <Tabs>
        <Tab active={activeTab === 'videos'} onClick={() => setActiveTab('videos')}>Videos</Tab>
        <Tab active={activeTab === 'likes'} onClick={() => setActiveTab('likes')}>Liked Videos</Tab>
      </Tabs>

      {activeTab === 'videos' ? (
        <VideosGrid>
          {videos.map(video => (
            <VideoCard key={video._id} video={video} user={user} />
          ))}
        </VideosGrid>
      ) : (
        <VideosGrid>
          {/* Liked videos would be fetched here */}
          <div style={{ color: 'var(--text-secondary)' }}>No liked videos yet</div>
        </VideosGrid>
      )}

      {showEditModal && (
        <EditProfileModal onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '1rem' }}>Edit Profile</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder={profile.username}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--background-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder={profile.bio || 'Tell us about yourself'}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'var(--background-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button primary onClick={handleUpdateProfile}>Save</Button>
            </div>
          </ModalContent>
        </EditProfileModal>
      )}
    </ProfilePageContainer>
  );
};

export default ProfilePage;

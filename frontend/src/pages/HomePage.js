import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const HomePageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled.section`
  margin-bottom: 2rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 16px;
  color: white;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
`;

const CTAButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: var(--primary);
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text);
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

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const [trendingRes, recentRes] = await Promise.all([
          axios.get('/api/feed/trending?limit=6'),
          axios.get('/api/feed?page=1&limit=12')
        ]);
        setTrendingVideos(trendingRes.data);
        setRecentVideos(recentRes.data.videos);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <HomePageContainer>
      <HeroSection>
        <HeroTitle>Welcome to ClipVibe</HeroTitle>
        <HeroSubtitle>Discover and share amazing short videos</HeroSubtitle>
        {user ? (
          <CTAButton onClick={() => navigate('/upload')}>Create Video</CTAButton>
        ) : (
          <CTAButton onClick={() => navigate('/login')}>Get Started</CTAButton>
        )}
      </HeroSection>

      {loading ? (
        <Loading>Loading videos...</Loading>
      ) : (
        <>
          <Section>
            <SectionTitle>🔥 Trending Now</SectionTitle>
            <VideosGrid>
              {trendingVideos.map(video => (
                <VideoCard key={video._id} video={video} user={user} />
              ))}
            </VideosGrid>
          </Section>

          <Section>
            <SectionTitle>📹 Recently Uploaded</SectionTitle>
            <VideosGrid>
              {recentVideos.map(video => (
                <VideoCard key={video._id} video={video} user={user} />
              ))}
            </VideosGrid>
          </Section>
        </>
      )}
    </HomePageContainer>
  );
};

export default HomePage;

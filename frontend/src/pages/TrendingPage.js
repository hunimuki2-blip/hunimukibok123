import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const TrendingPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const FilterTab = styled.button`
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

const TrendingPage = ({ user }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/feed/trending?limit=20');
        setVideos(response.data);
      } catch (err) {
        console.error('Error fetching trending videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [filter, timeRange]);

  return (
    <TrendingPageContainer>
      <Header>
        <Title>🔥 Trending Videos</Title>
        <Subtitle>Discover what's popular right now</Subtitle>
      </Header>

      <FilterTabs>
        <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterTab>
        <FilterTab active={filter === 'music'} onClick={() => setFilter('music')}>Music</FilterTab>
        <FilterTab active={filter === 'gaming'} onClick={() => setFilter('gaming')}>Gaming</FilterTab>
        <FilterTab active={filter === 'comedy'} onClick={() => setFilter('comedy')}>Comedy</FilterTab>
        <FilterTab active={filter === 'sports'} onClick={() => setFilter('sports')}>Sports</FilterTab>
      </FilterTabs>

      <FilterTabs>
        <FilterTab active={timeRange === 'day'} onClick={() => setTimeRange('day')}>Today</FilterTab>
        <FilterTab active={timeRange === 'week'} onClick={() => setTimeRange('week')}>This Week</FilterTab>
        <FilterTab active={timeRange === 'month'} onClick={() => setTimeRange('month')}>This Month</FilterTab>
        <FilterTab active={timeRange === 'year'} onClick={() => setTimeRange('year')}>This Year</FilterTab>
      </FilterTabs>

      {loading ? (
        <Loading>Loading trending videos...</Loading>
      ) : (
        <VideosGrid>
          {videos.map(video => (
            <VideoCard key={video._id} video={video} user={user} />
          ))}
        </VideosGrid>
      )}
    </TrendingPageContainer>
  );
};

export default TrendingPage;

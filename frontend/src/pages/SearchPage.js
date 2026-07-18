import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const SearchPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SearchHeader = styled.header`
  margin-bottom: 2rem;
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background-color: var(--background-tertiary);
  border: 1px solid var(--border);
  border-radius: 25px;
  color: var(--text);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 1.2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
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

const ResultsCount = styled.div`
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const TrendingSearches = styled.div`
  margin-top: 2rem;
  
  h3 {
    color: var(--text);
    margin-bottom: 1rem;
  }
`;

const TrendingTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--background-tertiary);
  border-radius: 20px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--border);
    color: var(--text);
  }
`;

const SearchPage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('videos');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q');

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [q]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/feed/search?q=${encodeURIComponent(query)}&limit=20`);
      setResults(response.data.videos);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const trendingSearches = ['music', 'dance', 'comedy', 'gaming', 'sports', 'food', 'travel', 'fashion'];

  return (
    <SearchPageContainer>
      <SearchHeader>
        <form onSubmit={handleSubmit}>
          <SearchInputContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search videos, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInputContainer>
        </form>
        
        <Tabs>
          <Tab active={searchType === 'videos'} onClick={() => setSearchType('videos')}>Videos</Tab>
          <Tab active={searchType === 'users'} onClick={() => setSearchType('users')}>Users</Tab>
          <Tab active={searchType === 'hashtags'} onClick={() => setSearchType('hashtags')}>Hashtags</Tab>
        </Tabs>
        
        {q && (
          <ResultsCount>
            {total} results for "{q}"
          </ResultsCount>
        )}
      </SearchHeader>

      {loading ? (
        <Loading>Searching...</Loading>
      ) : results.length > 0 ? (
        <VideosGrid>
          {results.map(video => (
            <VideoCard key={video._id} video={video} user={user} />
          ))}
        </VideosGrid>
      ) : q ? (
        <NoResults>No results found for "{q}"</NoResults>
      ) : (
        <TrendingSearches>
          <h3>Trending Searches</h3>
          {trendingSearches.map(tag => (
            <TrendingTag key={tag} onClick={() => navigate(`/search?q=${tag}`)}>
              #{tag}
            </TrendingTag>
          ))}
        </TrendingSearches>
      )}
    </SearchPageContainer>
  );
};

export default SearchPage;

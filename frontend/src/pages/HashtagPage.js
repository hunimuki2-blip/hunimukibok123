import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const HashtagPageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const HashtagTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const HashtagInfo = styled.p`
  color: var(--text-secondary);
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

const NoVideos = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const RelatedHashtags = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  
  h3 {
    color: var(--text);
    margin-bottom: 1rem;
  }
`;

const RelatedTag = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--background-tertiary);
  border-radius: 20px;
  color: var(--primary);
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 45, 85, 0.2);
  }
`;

const HashtagPage = ({ user }) => {
  const { hashtag } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/feed/hashtag/${hashtag}?page=${page}&limit=20`);
        setVideos(response.data.videos);
        setTotal(response.data.total);
      } catch (err) {
        console.error('Error fetching hashtag videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [hashtag, page]);

  const relatedHashtags = ['music', 'dance', 'comedy', 'gaming', 'sports', 'food', 'travel', 'fashion', 'art', 'education'];

  return (
    <HashtagPageContainer>
      <Header>
        <HashtagTitle>#{hashtag}</HashtagTitle>
        <HashtagInfo>{total} videos</HashtagInfo>
      </Header>

      {loading ? (
        <Loading>Loading videos...</Loading>
      ) : videos.length > 0 ? (
        <VideosGrid>
          {videos.map(video => (
            <VideoCard key={video._id} video={video} user={user} />
          ))}
        </VideosGrid>
      ) : (
        <NoVideos>No videos found for #{hashtag}</NoVideos>
      )}

      <RelatedHashtags>
        <h3>Related Hashtags</h3>
        {relatedHashtags.filter(tag => tag !== hashtag).map(tag => (
          <RelatedTag key={tag} onClick={() => navigate(`/hashtag/${tag}`)}>
            #{tag}
          </RelatedTag>
        ))}
      </RelatedHashtags>
    </HashtagPageContainer>
  );
};

export default HashtagPage;

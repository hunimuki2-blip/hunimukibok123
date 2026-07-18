import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const UploadPageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1.5rem;
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: var(--background-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  background-color: var(--background-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const FileInputContainer = styled.div`
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--background-tertiary);
  
  &:hover {
    border-color: var(--primary);
  }
  
  .file-info {
    margin-top: 1rem;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ThumbnailPreview = styled.div`
  width: 100%;
  height: 200px;
  background-color: var(--background-secondary);
  border-radius: 8px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--border);
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  background-color: var(--background-tertiary);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--primary);
  border-radius: 2px;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: var(--success);
  font-size: 0.9rem;
  padding: 1rem;
  background-color: rgba(0, 213, 75, 0.1);
  border-radius: 8px;
  margin-top: 1rem;
`;

const UploadPage = ({ user }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
      
      // Create thumbnail preview from video
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = videoUrl;
      video.currentTime = 1;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg');
        setThumbnailPreview(thumbnailUrl);
      };
    } else {
      setError('Please select a video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      setError('Please select a video file');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('hashtags', hashtags);
      
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      
      const response = await axios.post('/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      });
      
      setSuccess(true);
      setTitle('');
      setDescription('');
      setHashtags('');
      setVideoFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Navigate to video page after 2 seconds
      setTimeout(() => {
        navigate(`/video/${response.data._id}`);
      }, 2000);
      
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UploadPageContainer>
      <Title>Upload Video</Title>
      
      {success ? (
        <SuccessMessage>
          Video uploaded successfully! Redirecting...
        </SuccessMessage>
      ) : (
        <UploadForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Video File *</Label>
            <FileInputContainer onClick={() => fileInputRef.current.click()}>
              <FileInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
              />
              {videoFile ? (
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎥</div>
                  <div>{videoFile.name}</div>
                  <div className="file-info">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📤</div>
                  <div>Click to select video or drag and drop</div>
                  <div className="file-info">Max 100MB</div>
                </div>
              )}
            </FileInputContainer>
          </FormGroup>

          {thumbnailPreview && (
            <FormGroup>
              <Label>Thumbnail Preview</Label>
              <ThumbnailPreview>
                <img src={thumbnailPreview} alt="Thumbnail preview" />
              </ThumbnailPreview>
              <FileInput
                type="file"
                onChange={handleThumbnailChange}
                accept="image/*"
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Give your video a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <TextArea
              placeholder="Describe your video (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </FormGroup>

          <FormGroup>
            <Label>Hashtags (optional)</Label>
            <Input
              type="text"
              placeholder="Add hashtags separated by commas (e.g., music, dance, fun)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {isUploading && (
            <>
              <ProgressBar>
                <Progress progress={uploadProgress} />
              </ProgressBar>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Uploading: {uploadProgress}%
              </div>
            </>
          )}

          <SubmitButton type="submit" disabled={isUploading || !videoFile}>
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </SubmitButton>
        </UploadForm>
      )}
    </UploadPageContainer>
  );
};

export default UploadPage;

import { useState, useEffect } from 'react';
import './EditStory.css';
import Client from '../../services/api';
import { useParams } from 'react-router-dom';
import StoryList from '../../components/storyList';

const EditStory = () => {
  const [stories, setStories] = useState([]);
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserStories = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user_id');
        console.log(user);
        const res = await Client.get(`users/get/stories/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStories(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserStories();
  }, []);

  const handleStoryClick = (storyId) => {
    setSelectedStoryId(storyId);
  };

  return (
    <div>
      {selectedStoryId ? (
        <StoryList storyId={selectedStoryId} />
      ) : (
        stories.map((story) => (
          <div key={story.id}>
            <img
              src={story.image}
              alt={story.title}
              onClick={() => handleStoryClick(story.id)}
            />
            <h2 onClick={() => handleStoryClick(story.id)}>{story.title}</h2>
          </div>
        ))
      )}
    </div>
  );
};

export default EditStory;
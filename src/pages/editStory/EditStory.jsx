import { useState, useEffect } from 'react';
import './EditStory.css';
import Client from '../../services/api';
import { useParams } from 'react-router-dom';

const EditStory = () => {
  const [story, setStory] = useState(null);
  const [newTitle, setNewTitle] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const { storyId } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await Client.get(`/stories/${storyId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStory();
  }, [storyId]);

  const handleEditClick = () => {
    const token = localStorage.getItem('token');
    const data = new FormData();
    if (newTitle) {
      data.append('title', newTitle);
    }
    if (newImage) {
      data.append('image', newImage);
    }
    Client.put(`/stories/${storyId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => console.error(err));
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };

  return (
    <div>
      {story ? (
        <div>
          <img src={story.image} alt={story.title} />
          <label>
            Title:
            <input type="text" value={newTitle || story.title} onChange={handleTitleChange} />
          </label>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          <button onClick={handleEditClick}>Save</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditStory;

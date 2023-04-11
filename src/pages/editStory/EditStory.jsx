import { useState, useEffect, useCallback } from 'react';
import './EditStory.css';
import Client from '../../services/api';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav'

const EditStory = () => {
  const [story, setStory] = useState(null);
  const { storyId } = useParams();
  const navigate = useNavigate();

  const editStory = async (data) => {
    try {
      await Client.put(`/stories/${storyId}`, data);
    } catch (error) {
      throw error;
    }
  };

  let user = localStorage.getItem('user_id');

  const locate = useLocation();
  const storyInfo = locate.state;

  const initialState = {
    authorId: `${user}`,
    title: storyInfo.storyInfo.title,
    image: storyInfo.storyInfo.image,
    likes: 0,
  };

  const [formValues, setFormValues] = useState(initialState);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const fetchStory = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await Client.get(`/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStory(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [storyId]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const onSubmit = (e) => {
    e.preventDefault();
    editStory(formValues);
    fetchStory();
  };

  const handleSnippetEdit = (storyId) => {
    navigate(`/stories/${storyId}/add-edit-snippet`);
  };

  const deleteStory = async () => {
    await Client.delete(`/stories/${story.id}`);
    navigate('/your-stories');
  };


  return (
    <div><Nav />
    <div className="story-page-container">
      {story ? (
        <div>
          <h2 className="story-page__title">{story.title}</h2>
          <img src={story.image} alt={story.title} className="story-page__image" />
          <h1>Edit your title or image</h1>
          <form onSubmit={onSubmit} className='story-page__form'>
            <input
              placeholder='Title'
              name="title"
              type="text"
              defaultValue={formValues.title}
              onChange={handleChange}
              required
              className="story-page__input"
            />
            <input
              placeholder='Image'
              name="image"
              type="text"
              defaultValue={formValues.image}
              onChange={handleChange}
              required
              className="story-page__input"
            />
            <button type='submit' className="story-page__button-save">Save</button>
          </form>
          <button className="story-page__button" onClick={() => handleSnippetEdit(story.id)}>Edit Snippets</button>
          <button className="story-page__button" onClick={() => deleteStory(story.id)}>Delete Story</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
};

export default EditStory;
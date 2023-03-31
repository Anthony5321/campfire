import { useState, useEffect } from 'react';
import './EditStory.css';
import Client from '../../services/api';
import { useParams, useLocation} from 'react-router-dom';

const EditStory = () => {
  const [story, setStory] = useState(null);
  const { storyId } = useParams();
  
  const editStory = async (data) => {
    try {
      await Client.put(`/stories/${storyId}`, data)
      
    } catch (error) {
      throw error
    }
  }
  
  let user = localStorage.getItem('user_id')
  
  const locate = useLocation()
  const storyInfo  = locate.state
  
  console.log(user);
  console.log(storyInfo);
  
  const initialState = {
    authorId: `${user}`,
    title: ``,
    image: ``,
    likes: 0
  }
  
  const [formValues, setFormValues] = useState(initialState)
  
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }
  
  const fetchStory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await Client.get(`/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStory(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);
  
  const onSubmit = (e) => {
    e.preventDefault()
    editStory(formValues)
    fetchStory()
  }

  const handleSnippetEdit = (storyId) => {
    window.location.href = `/stories/${storyId}/add-edit-snippet`;
  };

  return (
    <div>
      {story ? (
        <div>
          <h2>{story.title}</h2>
          <img src={story.image} alt={story.title} />
          <form onSubmit={onSubmit} className='addForm'>
          <input
              name="title"
              type="text"
              defaultValue={formValues.title}
              onChange={handleChange}
              required
            />
          <input
              name="image"
              type="text"
              defaultValue={formValues.image}
              onChange={handleChange}
              required
            />
          <button type='submit'>Save</button>
          </form>
          <button onClick={() => handleSnippetEdit(story.id)}>Edit Snippets</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditStory;
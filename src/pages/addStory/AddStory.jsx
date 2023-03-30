import { useState, useEffect } from 'react';
import './AddStory.css';
import Client from '../../services/api';
import { Link } from 'react-router-dom';

const AddStory = () => {
    const [story, setStory] = useState({});
    const [snippet, setSnippet] = useState({});
    const [user, setUser] = useState({});
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await Client.get('users/get/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch (err) {
          console.error(err);
        }
      };
      fetchUser();
    }, []);
  
    const handleSubmitStory = async (event) => {
        event.preventDefault();
        try {
          const res = await Client.post('/stories', {
            ...story,
            authorId: user.username,
          });
          console.log(res.data);
          setStory(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      
      const handleSubmitSnippet = async (event) => {
        event.preventDefault();
        try {
          const res = await Client.post('/snippets', {
            ...snippet,
            storyId: story.id,
            authorId: user.username,
          });
          console.log(res.data);
          setSnippet(res.data);
        } catch (err) {
          console.error(err);
        }
      };
  
    const handleChangeStory = (event) => {
      setStory({ ...story, [event.target.name]: event.target.value });
    };
  
    const handleChangeSnippet = (event) => {
      setSnippet({ ...snippet, [event.target.name]: event.target.value });
    };
  
    return (
      <div>
        <form onSubmit={handleSubmitStory}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            onChange={handleChangeStory}
            required
          />
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            onChange={handleChangeStory}
            required
          ></textarea>
          <label htmlFor="image">Image:</label>
          <input
            type="text"
            name="image"
            onChange={handleChangeStory}
            required
          />
          <button type="submit">Create Story</button>
        </form>
  
        {story.id && (
          <form onSubmit={handleSubmitSnippet}>
            <label htmlFor="header">Header:</label>
            <input
              type="text"
              name="header"
              onChange={handleChangeSnippet}
              required
            />
            <label htmlFor="content">Content:</label>
            <textarea
              name="content"
              onChange={handleChangeSnippet}
              required
            ></textarea>
            <label htmlFor="image">Image URL:</label>
            <input
              type="text"
              name="image"
              onChange={handleChangeSnippet}
              required
            />
            <label htmlFor="parentId">Parent Snippet ID (if applicable):</label>
            <input
              type="text"
              name="parentId"
              onChange={handleChangeSnippet}
            />
            <button type="submit">Add Snippet</button>
          </form>
        )}
  
        {snippet.id && (
          <>
            <p>Snippet added successfully!</p>
            <p>Snippet ID: {snippet.id}</p>
            <p>Snippet Header: {snippet.header}</p>
            <p>Snippet Content: {snippet.content}</p>
            <p>Snippet Image URL: {snippet.image}</p>
          </>
        )}
  
        <div className="backBtn">
          <Link to={"/home"} className="backLink">
            <p>Back</p>
          </Link>
        </div>
      </div>
    );
  };

  export default AddStory;
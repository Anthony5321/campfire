import { useState, useEffect, useRef } from 'react';
import './AddStory.css';
import Client from '../../services/api';
import { Link } from 'react-router-dom';

const AddStory = () => {
  const [story, setStory] = useState({});
  const [snippet, setSnippet] = useState({});
  const [user, setUser] = useState({});
  const [snippets, setSnippets] = useState([]);
  const formRef = useRef(null);
  const [parentSnippets, setParentSnippets] = useState([]); // new state for parent snippets
  const initialState = {
    header: '',
    content: '',
    image: '',
    parentId: ''
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user_id");
        const res = await Client.get(`users/get/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await Client.get(`/snippets/story/${story.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnippets(res.data);

        // update parent snippets dropdown
        const parentSnippets = res.data.filter(s => s.storyId === story.id && s.id !== snippet.id); // exclude the current snippet from the dropdown options
        setParentSnippets(parentSnippets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSnippets();
  }, [story.id, snippet.id]);

  const handleSubmitStory = async (event) => {
    event.preventDefault();
    try {
      const res = await Client.post("/stories", {
        ...story,
        authorId: user.id,
        likes: 0,
      });
      setStory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitSnippet = async (event) => {
    event.preventDefault();
    try {
      formRef.current.reset();
      const res = await Client.post("/snippets", {
        ...snippet,
        storyId: story.id,
      });
      setSnippets([...snippets, res.data]);
      setSnippet(initialState); // reset the snippet form

      // Add child-parent relation
      if (parentSnippets) {
        const response = await Client.post("snippets/children", {
          parentSnippetId: parentSnippets,
          childSnippetId: res.data.id
        });
        setParentSnippets([...parentSnippets, response.data]);
      }
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

  const handleDeleteSnippet = async (snippet) => {
    await Client.delete(`/snippets/${snippet.id}`);
    setSnippets(snippets.filter(s => s.id !== snippet.id));
  };

  return (
    <div className="wrapper">
      {story.id ? (
        <>
          <h2 className="story-info-heading">Story Info:</h2>
          <div className="story-info">
            <p className="story-info__title">Title: {story.title}</p>
            <img src={story.image} alt={story.title} className="story-info__image" />
          </div>
          <form ref={formRef} className="snippet-form" onSubmit={handleSubmitSnippet}>
            <h2 className="add-snippet-heading">Add a Snippet:</h2>
            <div className="form-fields">
              <label htmlFor="header" className="form-label">Header:</label>
              <input type="text" id="header" name="header" className="form-input" onChange={handleChangeSnippet} />
              <label htmlFor="content" className="form-label">Content:</label>
              <textarea id="content" name="content" className="form-textarea" onChange={handleChangeSnippet}></textarea>
              <label htmlFor="image" className="form-label">Image:</label>
              <input type="text" id="image" name="image" className="form-input" onChange={handleChangeSnippet} />
              <label htmlFor="parentId" className="form-label">Parent:</label>
              <select key={snippet.id} className="form-select" onChange={(e) => setParentSnippets(e.target.value)}>
                <option value="none">None</option>
                {snippets.map((snippet) => (
                  <option value={snippet.id} key={snippet.id}>
                    {snippet.header}
                  </option>
                ))}
              </select>
              <button type="submit" className="form-button">Add Snippet</button>
            </div>
          </form>
          <h2 className="snippets-heading">Snippets:</h2>
          <div className="edit-snippets">
            <Link to={`/stories/${story.id}/add-snippet`} className="edit-snippets__link"><button className="edit-snippets__button">Edit Snippets</button></Link>
          </div>
          <ul className="snippet-list">
            {snippets.map((snippet) => (
              <li key={snippet.id} className="snippet-item">
                <div className="snippet-header">
                  <p className="snippet-header__text">Header: {snippet.header}</p>
                  <button onClick={() =>
                    handleDeleteSnippet(snippet)} className="snippet-header__delete-button">Delete</button>
                </div>
                <p className="snippet-content">Content: {snippet.content}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="add-story-heading">Add a Story:</h2>
          <form className="story-form" onSubmit={handleSubmitStory}>
            <div className="form-fields">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" id="title" name="title" className="form-input" onChange={handleChangeStory} />
              <label htmlFor="image" className="form-label">Image:</label>
              <input type="text" id="image" name="image" className="form-input" onChange={handleChangeStory} />
              <button type="submit" className="form-button">Add Story</button>
            </div>
          </form>
        </>
      )}
      <br />
      <br />
      <br />
      <Link to={`/your-stories`}><button className="all-done">All done</button></Link>
    </div>
  );
};

export default AddStory;
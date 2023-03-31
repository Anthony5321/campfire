import { useState, useEffect } from 'react';
import './AddStory.css';
import Client from '../../services/api';
import { Link } from 'react-router-dom';

const AddStory = () => {
  const [story, setStory] = useState({});
  const [snippet, setSnippet] = useState({});
  const [user, setUser] = useState({});
  const [snippets, setSnippets] = useState([]);
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
        console.log(user);
        const res = await Client.get(`users/get/${user}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        console.log(res.data);
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
        const res = await Client.get("/snippets", {
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
      console.log(user.username);
      const res = await Client.post("/stories", {
        ...story,
        authorId: user.id,
        likes: 0,
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
      const res = await Client.post("/snippets", {
        ...snippet,
        storyId: story.id,
        authorId: user.username,
      });
      console.log(res.data);
      setSnippets([...snippets, res.data]);
      setSnippet(initialState); // reset the snippet form
      document.getElementById("snippet-form").reset(); // reset the form input fields

      // Add child-parent relation
      if (parentSnippets) {
        const response = await Client.post("snippets/children", {
          parentSnippetId: parentSnippets,
          childSnippetId: res.data.id
        });
        console.log(response.data);
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

  const addSnippet = () => {
    setSnippet({}); // reset the snippet form
  };

  const handleDeleteSnippet = async (snippet) => {
    console.log(snippet);
    await Client.delete(`/snippets/${snippet.id}`);
    setSnippets(snippets.filter(s => s.id !== snippet.id));
  };

console.log(story.id);

  return (
    <div>
      {story.id ? (
        <>
          <h2>Story Info:</h2>
          <p>Title: {story.title}</p>
          <p>Author: {user.username}</p>
          <form id="snippet-form" onSubmit={handleSubmitSnippet}>
            <h2>Add a Snippet:</h2>
            <label htmlFor="header">Header:</label>
            <input type="text" id="header" name="header" onChange={handleChangeSnippet} />
            <label htmlFor="content">Content:</label>
            <textarea id="content" name="content" onChange={handleChangeSnippet}></textarea>
            <label htmlFor="image">Image:</label>
            <input type="text" id="image" name="image" onChange={handleChangeSnippet} />
            <label htmlFor="parentId">Parent:</label>
            <select onChange={(e) => setParentSnippets(e.target.value)}>
              {snippets.map((snippet) => (
                <option value={snippet.id} >
                  {snippet.header}
                </option>
              ))}
            </select>
            <button type="submit">Add Snippet</button>
          </form>
          {/* <button onClick={addSnippet}>Add Another Snippet</button> */}
          <h2>Snippets:</h2>
          <br />
          <Link to={`/stories/${story.id}/add-snippet`} /> <h3>Edit Snippets </h3> <Link/>
          <br />
          <ul>
            {snippets.map((snippet) => (
              <li key={snippet.id}>
                <p>Header: {snippet.header}</p>
                <p>content: {snippet.content}</p>
                <button onClick={() =>
                  handleDeleteSnippet(snippet)}>Delete</button>
                <br></br>
                <br></br>
                <br></br>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2>Add a Story:</h2>
          <form onSubmit={handleSubmitStory}>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" name="title" onChange={handleChangeStory} />
            <label htmlFor="image">Image:</label>
            <input type="text" id="image" name="image" onChange={handleChangeStory} />
            <button type="submit">Add Story</button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddStory;
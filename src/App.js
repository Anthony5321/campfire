import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Client from './services/api';
import Landing from './pages/landing/Landing';
import Home from './pages/home/Home';
import YourStories from './pages/yourStories/YourStories';
import EditStory from './pages/editStory/EditStory';
import EditSnippet from './pages/editSnippet/EditSnippet';
import AddStory from './pages/addStory/AddStory';
import ReadBook from './pages/readBook/ReadBook';
// import About from './pages/about/About';

function App() {
  const [user, setUser] = useState(null);
  const [story, setStory] = useState([]);

  const getStories = useCallback(async () => {
    try {
      const res = await Client.get('/stories');
      setStory(res.data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const checkToken = useCallback(async () => {
    try {
      const res = await Client.get('/users/session');
      return res.data;
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    getStories();
    const token = localStorage.getItem('token');
    if (token) {
      checkToken().then((user) => {
        setUser(user);
      });
    }
  }, [getStories, checkToken]);

  return (
    <div className="App">
      <Routes className="Routes">
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home user={user} setUser={setUser} />} />
        {/* <Route path="/about" element={<About user={user} setUser={setUser} />} /> */}
        <Route
          path="/stories/:id"
          element={<ReadBook story={story} getStories={getStories} user={user} setUser={setUser} />}
        />
        <Route path="/add/story" element={<AddStory user={user} getStories={getStories} setUser={setUser} />} />
        <Route path="/your-stories" element={<YourStories user={user} setUser={setUser} />} />
        <Route path="/edit/:storyId" element={<EditStory user={user} setUser={setUser} />} />
        <Route path="/stories/:storyId/add-edit-snippet" element={<EditSnippet user={user} setUser={setUser} />} />
      </Routes>
    </div>
  );
}

export default App;

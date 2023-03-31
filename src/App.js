import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Client from './services/api';
import Landing from './pages/landing/Landing';
import Home from './pages/home/Home';
import YourStories from './pages/yourStories/YourStories';
import EditStory from './pages/editStory/EditStory';
import EditSnippet from './pages/editSnippet/EditSnippet';
import AddStory from './pages/addStory/AddStory';
import ReadBook from './pages/readBook/ReadBook';
// import UserDash from './pages/userDash/UserDash';
// import About from './pages/about/About';

function App() {

  const [user, setUser] = useState(null)

  const [story, setStory] = useState([])
  const getStories = async () => {
    try {
      const res = await Client.get('/stories')
      setStory(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const CheckSession = async () => {
    try {
      const res = await Client.get('/users/session')
      console.log(res);
      return res.data
    } catch (error) {
      throw error
    }
  }

  const checkToken = async () => {
    const user = await CheckSession()
    setUser(user)
  }

  useEffect(() => {
    getStories()
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    }
  }, [])



  return (
    <div className="App">
      <Routes className="Routes">
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home user={user} setUser={setUser} />} />
        {/* <Route path="/about" element={<About user={user} setUser={setUser} />} /> */}
        <Route path="/stories/:id" element={
          <ReadBook story={story} getStories={getStories} user={user} setUser={setUser} />
        } />
        <Route path="/add/story" element={<AddStory user={user} getStories={getStories} setUser={setUser} />} />
        {/* <Route path='/auth' element={<UserDash user={user} setUser={setUser} />}></Route> */}
        <Route path='/your-stories' element={<YourStories user={user} setUser={setUser} />}></Route> 
        <Route path='/edit/:storyId' element={<EditStory user={user} setUser={setUser} />}></Route> 
        <Route path='/stories/:storyId/add-snippet' element={<EditSnippet user={user} setUser={setUser} />}></Route> 
      </Routes>
    </div>
  );
}

export default App;

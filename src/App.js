import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Client from './services/api';
import LandingPage from './pages/landingPage/LandingPage';
import Home from './pages/home/Home';

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
      const res = await Client.get('/user/session')
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
    getMeals()
    const token = localStorage.getItem('token')
    if (token) {
      checkToken()
    }
  }, [])



  return (
    <div className="App">
      <Routes className="Routes">
        <Route path='/' element={<LandingPage />} />
        <Route path='/home' element={<Home user={user} setUser={setUser} />} />
        <Route path="/about" element={<About user={user} setUser={setUser} />} />
        <Route path="/stories/:id" element={
          <StoryDetails story={story} getStories={getStories} user={user} setUser={setUser} />
        } />
        <Route path="/add/story" element={<AddStory user={user} getStories={getStories} setUser={setUser} />} />
        <Route path='/auth' element={<UserDash user={user} setUser={setUser} />}></Route>
        <Route path='/edit' element={<EditStory user={user} setUser={setUser} />}></Route> 
      </Routes>
    </div>
  );
}

export default App;

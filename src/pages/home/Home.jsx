import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Client from '../../services/api';
import BookCard from '../../components/BookCard';
import SearchStories from '../../components/SearchStories';
import './Home.css';
import Nav from '../../components/Nav'

const Home = () => {

  const [story, setStory] = useState([]);

  const getStories = async () => {
    try {
      const res = await Client.get('/stories/');
      setStory(res.data.stories);
    } catch (err) {
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  return (
    <div><Nav />
      <SearchStories />
      <div className="home-ctn">
        {story.map((card) => (
          <Link to={`/stories/${card.id}`} key={card.id} style={{ textDecoration: 'none' }}>
            <BookCard
              title={card?.title}
              image={card?.image}
              authorId={card?.authorId}
              likes={card?.likes}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Client from '../../services/api';
import BookCard from '../../components/BookCard';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const [story, setStory] = useState([]);

  const getStories = async () => {
    try {
      const res = await Client.get('/stories/');
      console.log(res.data.stories);
      setStory(res.data.stories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStories();
  }, []);

  return (
    <div className="home-ctn">
      {story.map((card) => (
        <Link to={`/stories/${card.id}`} key={card.id}>
          <BookCard
            title={card?.title}
            image={card?.image}
            authorId={card?.authorId}
            likes={card?.likes}
          />
        </Link>
      ))}
    </div>
  );
};

export default Home;
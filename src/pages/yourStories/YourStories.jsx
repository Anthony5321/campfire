import { useState, useEffect } from 'react';
import './YourStories.css';
import Client from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const YourStories = () => {
    const [stories, setStories] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user_id');
                const res = await Client.get(`users/get/stories/${user}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStories(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserStories();
    }, []);

    const handleReadClick = (storyId) => {
        navigate(`/stories/${storyId}`);
    };

    return (
        <div className="your-stories-container">
            {stories.map((story) => (
                <div key={story.id} className="story-card">
                    <img
                        src={story.image}
                        alt={story.title}
                        onClick={() => handleReadClick(story.id)}
                        className="story-card__image"
                    />
                    <h2 className="story-card__title">{story.title}</h2>
                    <Link to={`/edit/${story.id}`} state={{ storyInfo: story }}><button className="story-card__button">Edit</button></Link>
                    <button className="story-card__button" onClick={() => handleReadClick(story.id)}>Read</button>
                </div>
            ))}
        </div>
    );
};


export default YourStories;
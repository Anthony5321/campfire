import { useState, useEffect } from 'react';
import './YourStories.css';
import Client from '../../services/api';
import { useParams } from 'react-router-dom';
import StoryList from '../../components/storyList';

const YourStories = () => {
    const [stories, setStories] = useState([]);
    const [selectedStoryId, setSelectedStoryId] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user_id');
                console.log(user);
                const res = await Client.get(`users/get/stories/${user}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStories(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUserStories();
    }, []);

    const handleEditClick = (storyId) => {
        window.location.href = `/edit/${storyId}`;
    };

    const handleReadClick = (storyId) => {
        window.location.href = `/stories/${storyId}`;
    };
    

    return (
        <div>
            {selectedStoryId ? (
                <StoryList storyId={selectedStoryId} />
            ) : (
                stories.map((story) => (
                    <div key={story.id}>
                        <img
                            src={story.image}
                            alt={story.title}
                            onClick={() => handleReadClick(story.id)}
                        />
                        <h2>{story.title}</h2>
                        <button onClick={() => handleEditClick(story.id)}>Edit</button>
                        <button onClick={() => handleReadClick(story.id)}>Read</button>
                    </div>
                ))
            )}
        </div>
    );
};


export default YourStories;
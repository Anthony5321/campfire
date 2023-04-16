import React, { useState, useEffect } from 'react';
import Client from '../services/api';
import './SearchStories.css';
import { BsSearch } from 'react-icons/bs';

const SearchStories = () => {
    const [results, setResults] = useState([]);
    const [usernames, setUsernames] = useState({});

    const handleSearch = async (event) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const response = await Client.get(`/stories/search/${title}?title=${title}`);
        setResults(response.data.stories);
    };

    useEffect(() => {
        const fetchUsernames = async () => {
            const uniqueAuthorIds = new Set(results.map((story) => story.authorId));
            const authorIds = Array.from(uniqueAuthorIds);
            const usernameMap = {};
            for (const authorId of authorIds) {
                const res = await Client.get(`/users/get/${authorId}`);
                usernameMap[authorId] = res.data.username;
            }
            setUsernames(usernameMap);
        };
        fetchUsernames();
    }, [results]);

    return (
        <div className="search-stories-container">
            <form onSubmit={handleSearch}>
                <input type="text" id="title" name="title" />
                <button type="submit"><BsSearch /></button>
            </form>
            <div className="search-stories-results">
                {results.map((story) => (
                    <div key={story.id} className="search-stories-result">
                        <div>
                            <img src={story.image} alt='' className="image" />
                        </div>
                        <div className="details">
                            <h2 className="title">{story.title}</h2>
                            <p className="author">By: {usernames[story.authorId]}</p>
                            <p className='rating'>Rating: {story.likes}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchStories;
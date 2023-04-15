import React, { useState, useEffect } from 'react';
import Client from '../services/api';
import './SearchStories.css';

const SearchStories = () => {
    const [results, setResults] = useState([]);
    const [usernames, setUsernames] = useState({});

    const handleSearch = async (event) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        console.log(title);
        const response = await Client.get(`/stories/search/${title}?title=${title}`);
        console.log(response);
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
                <label htmlFor="title">Search stories:</label>
                <input type="text" id="title" name="title" />
                <button type="submit">Search</button>
            </form>
            <div className="search-stories-results">
                {results.map((story) => (
                    <div key={story.id} className="search-stories-result">
                        <div>
                            <img src={story.image} alt='' className="search-stories-image" />
                        </div>
                        <div className="search-stories-details">
                            <h2 className="search-stories-title">{story.title}</h2>
                            <p className="search-stories-author">By: {usernames[story.authorId]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchStories;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Client from '../services/api';

const StoryList = () => {
    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [storyTitle, setStoryTitle] = useState("");
    const [storyImage, setStoryImage] = useState("");
    const [snippets, setSnippets] = useState([]);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [snippetHeader, setSnippetHeader] = useState("");
    const [snippetContent, setSnippetContent] = useState("");
    const [snippetImage, setSnippetImage] = useState("");
    const [isEditingItem, setIsEditingItem] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            const user = localStorage.getItem("user_id");
            const stories = await Client.get(`/users/get/stories/${user}`);
            setStories(stories.data);
        }
        fetchUser();
    }, []);

    const handleEditStory = async (story) => {
        setSelectedStory(story);
        setStoryTitle(story.title);
        setStoryImage(story.image);
        const snippets = await Client.get(`/snippets/story/${story.id}`);
        setSnippets(snippets.data);
        setIsEditingItem(true); // set flag to true when editing story
    };

    const handleEditSnippet = (snippet) => {
        setSelectedSnippet(snippet);
        setSnippetHeader(snippet.header);
        setSnippetContent(snippet.content);
        setSnippetImage(snippet.image);
        setIsEditingItem(true); // set flag to true when editing snippet
    };

    const handleSaveStory = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const updatedStory = {
            ...selectedStory,
            title: storyTitle,
            image: storyImage,
        };
        await Client.put(`/stories/${selectedStory.id}`, updatedStory);
        setSelectedStory(null);
        setIsEditingItem(false); // reset flag after saving story
        setIsSubmitting(false);
    };

    const handleCancelStory = () => {
        setSelectedStory(null);
        setIsEditingItem(false); // reset flag after cancelling story
    };

    const handleSaveSnippet = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const updatedSnippet = {
            ...selectedSnippet,
            title: snippetHeader,
            content: snippetContent,
            image: snippetImage,
        };
        await Client.put(`/snippets/${selectedSnippet.id}`, updatedSnippet);
        setSelectedSnippet(null);
        setIsEditingItem(false); // reset flag after saving snippet
        setIsSubmitting(false);
    };

    const handleCancelSnippet = () => {
        setSelectedSnippet(null);
        setIsEditingItem(false); // reset flag after cancelling snippet
    };

    const isEditingStory = !!selectedStory;

    return (
        <div>
            <h1>Your Stories</h1>
            {stories.map((story) => {
                const isCurrentStoryEditing = isEditingStory && selectedStory.id === story.id;
                return (
                    <div key={story.id}>
                        <h2>Title: {story.title}</h2>
                        <img src={story.image} alt={story.title} />
                        <button disabled={isEditingItem && !isCurrentStoryEditing} onClick={() =>
                            handleEditStory(story)}>
                            Edit Story
                        </button>
                        {isCurrentStoryEditing && (
                            <form onSubmit={handleSaveStory}>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    value={storyTitle}
                                    onChange={(e) => setStoryTitle(e.target.value)}
                                />
                                <label>Image:</label>
                                <input
                                    type="text"
                                    value={storyImage}
                                    onChange={(e) => setStoryImage(e.target.value)}
                                />
                                <button type="submit" disabled={isSubmitting}>
                                    Save
                                </button>
                                <button type="button" onClick={handleCancelStory}>
                                    Cancel
                                </button>
                            </form>
                        )}
                        <h3>Snippets:</h3>
                        {snippets.map((snippet) => {
                            const isCurrentSnippetEditing = isEditingItem && selectedSnippet && selectedSnippet.id === snippet.id;
                            return (
                                <div key={snippet.id}>
                                    <h4>Header: {snippet.header}</h4>
                                    <p>{snippet.content}</p>
                                    <img src={snippet.image} alt={snippet.header} />
                                    <button disabled={isEditingItem && !isCurrentSnippetEditing} onClick={() => handleEditSnippet(snippet)}>
                                        Edit
                                    </button>
                                    {isCurrentSnippetEditing && (
                                        <form onSubmit={handleSaveSnippet}>
                                            <label>Header:</label>
                                            <input
                                                type="text"
                                                value={snippetHeader}
                                                onChange={(e) => setSnippetHeader(e.target.value)}
                                            />
                                            <label>Content:</label>
                                            <textarea
                                                value={snippetContent}
                                                onChange={(e) => setSnippetContent(e.target.value)}
                                            ></textarea>
                                            <label>Image:</label>
                                            <input
                                                type="text"
                                                value={snippetImage}
                                                onChange={(e) => setSnippetImage(e.target.value)}
                                            />
                                            <button type="submit" disabled={isSubmitting}>
                                                Save
                                            </button>
                                            <button type="button" onClick={handleCancelSnippet}>
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </div>
                            );
                        })}
                        <Link to={`/stories/${story.id}/add-snippet`}>Add New Snippet</Link>
                    </div>
                );
            })}
            <Link to="/create-story">Create New Story</Link>
        </div >
    );
};

export default StoryList;
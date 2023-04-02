import React, { useState, useEffect } from "react";
import Client from '../../services/api';
import { useParams } from 'react-router-dom';
import './EditSnippet.css'

const EditSnippet = ({ story }) => {
    const { storyId } = useParams();
    const [snippets, setSnippets] = useState([]);
    const [snippetHeader, setSnippetHeader] = useState("");
    const [snippetContent, setSnippetContent] = useState("");
    const [snippetImage, setSnippetImage] = useState("");
    const [parentSnippetId, setparentSnippetId] = useState("");
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchSnippets() {
            console.log(storyId);
            const snippets = await Client.get(`/snippets/story/${storyId}`);
            setSnippets(snippets.data);
        }
        fetchSnippets();
    }, [storyId]);

    const handleCreateSnippet = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const newSnippet = {
            header: snippetHeader,
            content: snippetContent,
            image: snippetImage,
            storyId: storyId,
        };
        await Client.post('/snippets', newSnippet);
        setSnippets([...snippets, newSnippet]);
        setSnippetHeader("");
        setSnippetContent("");
        setSnippetImage("");
        setparentSnippetId("");
        setIsSubmitting(false);
    };

    const handleEditSnippet = (snippet) => {
        setSelectedSnippet(snippet);
        setSnippetHeader(snippet.header);
        setSnippetContent(snippet.content);
        setSnippetImage(snippet.image);
        setparentSnippetId(snippet.parentId);
        setIsEditing(true);
    };


    const handleUpdateSnippet = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const updatedSnippet = {
            ...selectedSnippet,
            header: snippetHeader,
            content: snippetContent,
            image: snippetImage,
        };
        await Client.put(`/snippets/${selectedSnippet.id}`, updatedSnippet);
        const relation = { parentSnippetId: parentSnippetId, childSnippetId: selectedSnippet.id }
        await Client.post(`/snippets/children`, relation)
        setSnippets(snippets.map(snippet => (snippet.id === updatedSnippet.id ? updatedSnippet : snippet)));
        setSelectedSnippet(null);
        setSnippetHeader("");
        setSnippetContent("");
        setSnippetImage("");
        setparentSnippetId("");
        setIsEditing(false);
        setIsSubmitting(false);
    };

    const handleDeleteSnippet = async (snippet) => {
        console.log(snippet);
        await Client.delete(`/snippets/${snippet.id}`);
        setSnippets(snippets.filter(s => s.id !== snippet.id));
    };

    return (
        <div className="snippet-page-container">
            {!isEditing && (
                <div>
                    <h2 className="snippet-page__title">Add a new snippet:</h2>
                    <form onSubmit={handleCreateSnippet} className="snippet-page__form">
                        <label className="snippet-page__label">
                            Header:
                            <input type="text" value={snippetHeader} onChange={(e) => setSnippetHeader(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <label className="snippet-page__label">
                            Content:
                            <textarea value={snippetContent} onChange={(e) => setSnippetContent(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <label className="snippet-page__label">
                            Image:
                            <input type="text" value={snippetImage} onChange={(e) => setSnippetImage(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <button type="submit" disabled={isSubmitting} className="snippet-page__button">Submit</button>
                    </form>
                    <hr />
                </div>
            )}
            {isEditing && (
                <div>
                    <h2 className="snippet-page__title">Edit snippet:</h2>
                    <form onSubmit={handleUpdateSnippet} className="snippet-page__form">
                        <label className="snippet-page__label">
                            Header:
                            <input type="text" value={snippetHeader} onChange={(e) => setSnippetHeader(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <label className="snippet-page__label">
                            Content:
                            <textarea value={snippetContent} onChange={(e) => setSnippetContent(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <label className="snippet-page__label">
                            Image:
                            <input type="text" value={snippetImage} onChange={(e) => setSnippetImage(e.target.value)} className="snippet-page__input" />
                        </label>
                        <br />
                        <label className="snippet-page__label">
                            Parent:
                            <select onChange={(e) => setparentSnippetId(e.target.value)} className="snippet-page__select">
                                {snippets.map((snippet) => (
                                    <option key={snippet.id} value={snippet.id} >
                                        {snippet.header}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <button type="submit" disabled={isSubmitting} className="snippet-page__button">Update</button>
                        <button onClick={() => setIsEditing(false)} className="snippet-page__button">Cancel</button>
                    </form>
                </div>
            )}
            <h2 className="snippet-page__title">Edit snippets:</h2>
            <ul className="snippet-page__list">
                {snippets.map((snippet) => (
                    <li key={snippet.id} className="snippet-page__item">
                        <div className="snippet-page__contents">
                            <h3>{snippet.header}</h3>
                            <p>{snippet.content}</p>
                            {/* <p>{snippet.id}</p> */}
                        </div>
                        {snippet.image && <img src={snippet.image} alt={snippet.header} className="snippet-page__image" />}
                        <button onClick={() => handleEditSnippet(snippet)} className="snippet-page__button">Edit</button>
                        <button onClick={() => handleDeleteSnippet(snippet)} className="snippet-page__button">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditSnippet;
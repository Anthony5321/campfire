import React, { useState, useEffect, useCallback } from "react";
import Client from '../../services/api';
import { useParams } from 'react-router-dom';
import './EditSnippet.css'

const EditSnippet = ({ story }) => {
    const { storyId } = useParams();
    const [snippets, setSnippets] = useState([]);
    const [snippetHeader, setSnippetHeader] = useState("");
    const [snippetContent, setSnippetContent] = useState("");
    const [snippetImage, setSnippetImage] = useState("");
    const [parentSnippetId, setParentSnippetId] = useState("");
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialState = {
        header: '',
        content: '',
        image: '',
        parentId: ''
    };

    const fetchSnippets = useCallback(async () => {
        const snippets = await Client.get(`/snippets/story/${storyId}`);
        snippets.data.sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        setSnippets(snippets.data);
    }, [storyId]);

    useEffect(() => {
        fetchSnippets();
    }, [storyId, fetchSnippets]);

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
        setSnippets((prevSnippets) => [...prevSnippets, newSnippet]);
        setSnippetHeader("");
        setSnippetContent("");
        setSnippetImage("");
        setParentSnippetId("");
        setIsSubmitting(false);
        fetchSnippets();
    };

    const handleEditSnippet = (snippet) => {
        setSelectedSnippet(snippet);
        setSnippetHeader(snippet.header);
        setSnippetContent(snippet.content);
        setSnippetImage(snippet.image);
        setParentSnippetId(snippet.parentId);
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
            parentId: parentSnippetId,
        };
        await Client.put(`/snippets/${selectedSnippet.id}`, updatedSnippet);
        const relation = { parentSnippetId: parentSnippetId, childSnippetId: selectedSnippet.id }
        await Client.post(`/snippets/children`, relation)
        setSnippets(snippets.map(snippet => (snippet.id === updatedSnippet.id ? updatedSnippet : snippet)));
        setSelectedSnippet(null);
        setSnippetHeader("");
        setSnippetContent("");
        setSnippetImage("");
        setParentSnippetId("");
        setIsEditing(false);
        setIsSubmitting(false);
    };

    const handleCancelEdit = () => {
        setSelectedSnippet(null);
        setSnippetHeader(initialState.header);
        setSnippetContent(initialState.content);
        setSnippetImage(initialState.image);
        setParentSnippetId(initialState.parentId);
        setIsEditing(false);
    };

    const handleDeleteSnippet = async (snippet) => {
        await Client.delete(`/snippets/${snippet.id}`);
        fetchSnippets();
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
                            <select onChange={(e) => setParentSnippetId(e.target.value)} className="snippet-page__select">
                                {snippets.map((snippet) => (
                                    <option key={snippet.id} value={snippet.id} >
                                        {snippet.header}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <button type="submit" disabled={isSubmitting} className="snippet-page__button">Update</button>
                        <button onClick={() => handleCancelEdit} className="snippet-page__button">Cancel</button>
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
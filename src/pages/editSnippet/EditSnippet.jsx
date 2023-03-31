import React, { useState, useEffect } from "react";
import Client from '../../services/api';
import { useParams } from 'react-router-dom';

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
        const relation = {parentSnippetId: parentSnippetId, childSnippetId: selectedSnippet.id}
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
        <div>
            <h2>Add a new snippet:</h2>
            <form onSubmit={handleCreateSnippet}>
                <label>
                    Header:
                    <input type="text" value={snippetHeader} onChange={(e) => setSnippetHeader(e.target.value)} />
                </label>
                <br />
                <label>
                    Content:
                    <textarea value={snippetContent} onChange={(e) => setSnippetContent(e.target.value)} />
                </label>
                <br />
                <label>
                    Image:
                    <input type="text" value={snippetImage} onChange={(e) => setSnippetImage(e.target.value)} />
                </label>
                <br />
                <button type="submit" disabled={isSubmitting}>Submit</button>
            </form>
            <hr />
            {isEditing && (
                <div>
                    <h2>Edit snippet:</h2>
                    <form onSubmit={handleUpdateSnippet}>
                        <label>
                            Header:
                            <input type="text" value={snippetHeader} onChange={(e) => setSnippetHeader(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Content:
                            <textarea value={snippetContent} onChange={(e) => setSnippetContent(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Image:
                            <input type="text" value={snippetImage} onChange={(e) => setSnippetImage(e.target.value)} />
                        </label>
                        <br />
                        <label>
                            Parent:
                            <select onChange={(e) => setparentSnippetId(e.target.value)}>
                                {snippets.map((snippet) => (
                                    <option value={snippet.id} >
                                        {snippet.header}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <br />
                        <button type="submit" disabled={isSubmitting}>Update</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                </div>
            )}
            <h2>Edit snippets:</h2>
            <ul>
                {snippets.map((snippet) => (
                    <li key={snippet.id}>
                        <div>
                            <h3>{snippet.header}</h3>
                            <p>{snippet.content}</p>
                            <p>{snippet.id}</p>
                            {snippet.image && <img src={snippet.image} alt={snippet.header} />}
                            <button onClick={() => handleEditSnippet(snippet)}>Edit</button>
                            <button onClick={() =>

                                handleDeleteSnippet(snippet)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EditSnippet;
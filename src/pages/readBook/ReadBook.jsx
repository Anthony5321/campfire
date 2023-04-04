import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ReadBook.css';
import { Link } from 'react-router-dom';
import Client from '../../services/api';

const ReadBook = () => {
  let { id: storyId } = useParams();
  const [snippet, setSnippet] = useState({});
  const [allSnippets, setAllSnippets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllSnippets = async (storyId) => {
    try {
      const res = await Client.get(`/snippets/story/${storyId}`);
      if (res.data && res.data.length > 0) {
        return res.data;
      } else {
        console.log("No data found");
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getChildSnippets = async (snippetId) => {
    try {
      const res = await Client.get(`/snippets/snippet/${snippetId}`);
      if (res.data && res.data.length > 0 && res.data[0].children) {
        return res.data[0].children;
      } else {
        return [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const GetSnippet = async (snippetId) => {
    try {
      const snippets = await getAllSnippets(storyId);
      if (snippets && snippets.length > 0) {
        // Find the snippet with the specified ID
        const snippet = snippets.find(snippet => snippet.id === snippetId);
        setSnippet(snippet);
        const children = await getChildSnippets(snippet.id);
        setAllSnippets(children);
      } else {
        console.log("No snippets found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const snippets = await getAllSnippets(storyId);
        if (snippets && snippets.length > 0) {
          const firstSnippet = snippets.sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0];
          setSnippet(firstSnippet);
          const children = await getChildSnippets(firstSnippet.id);
          setAllSnippets(children);
        } else {
          console.log("No snippets found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [storyId]);

  useEffect(() => {
  }, [snippet]);

  useEffect(() => {
  }, [allSnippets]);

  return (
    <div className="readBook-container">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <img src={snippet.image} alt="" className="readBook-image" />
          <h2>{snippet.header}</h2>
          {/* <h2>{snippet.id}</h2> */}
          {snippet && <p className="readBook-content" dangerouslySetInnerHTML={{ __html: snippet.content ? snippet.content.replace(/\n/g, '<br />') : '' }}></p>}
          {allSnippets && allSnippets.length > 0 && (
            <div className="readBook-buttons">
              {allSnippets.map((child) => (
                <button key={child.id} onClick={() => GetSnippet(child.id)} className="readBook-btn">
                  {child.header}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <div className="backBtn">
        <Link to={'/home'} className="backLink">
          <p>Back to home</p>
        </Link>
      </div>
    </div>
  );
};

export default ReadBook;
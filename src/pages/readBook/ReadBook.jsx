import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ReadBook.css';
import Nav from '../../components/Nav';
import { Link } from 'react-router-dom';
import Client from '../../services/api';

const ReadBook = () => {
  let { id: storyId } = useParams();
  const [snippet, setSnippet] = useState({});
  const [allSnippets, setAllSnippets] = useState([]);

  const setFirstSnippet = async (snippets) => {
    if (snippets && snippets.length > 0) {
      console.log(`setFirstSnippet snippets:`, snippets);
      const firstSnippet = snippets[0];
      setSnippet(firstSnippet);
      const children = await getChildSnippets(firstSnippet.id);
      setAllSnippets(children);
    } else {
      console.log("No snippets found");
    }
  };
  
  const getAllSnippets = async (storyId) => {
    try {
      const res = await Client.get(`/snippets/story/${storyId}`);
      if (res.data && res.data.length > 0) {
        console.log(`getAllSnippets res.data:`, res.data);
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
        console.log(`getChildSnippets res.data[0].children:`, res.data[0].children);
        return res.data[0].children;
      } else {
        console.log(`No children found for snippet ${snippetId}`);
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
        console.log(`GetSnippet snippets:`, snippets);
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
        const snippets = await getAllSnippets(storyId);
        setFirstSnippet(snippets);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [storyId]);

  useEffect(() => {
    console.log(`snippet:`, snippet);
  }, [snippet]);

  useEffect(() => {
    console.log(`allSnippets:`, allSnippets);
  }, [allSnippets]);

  return (
    <div>
      <Nav />
      {snippet && (
        <>
          <img src={snippet.image} alt="image" />
          <p>{snippet.content}</p>
          {allSnippets && allSnippets.length > 0 && (
            <>
              {allSnippets.map((child) => (
                <button key={child.id} onClick={() => GetSnippet(child.id)}>
                  {child.header}
                </button>
              ))}
            </>
          )}
        </>
      )}
      <div className="backBtn">
        <Link to={'/home'} className="backLink">
          <p>Back</p>
        </Link>
      </div>
    </div>
  );
};

export default ReadBook;
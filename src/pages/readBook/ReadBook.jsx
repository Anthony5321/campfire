import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ReadBook.css';
import Nav from '../../components/Nav';
import { Link } from 'react-router-dom';
import Client from '../../services/api';

const ReadBook = () => {
  let { id } = useParams();
  const [snippet, setSnippet] = useState({});
  const [allSnippets, setAllSnippets] = useState([]);

  const GetSnippet = async (snippetId) => {
    try {
      const res = await Client.get(`/snippets/snippet/${snippetId}`);
      if (res.data && res.data.length > 0) {
        setSnippet(res.data[0]);
        console.log(res.data[0]);
        setAllSnippets(res.data[0].children);
      } else {
        console.log('No data found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await GetSnippet(id);
    };
    fetchData();
  }, [id]);

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
                  {child.content}
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
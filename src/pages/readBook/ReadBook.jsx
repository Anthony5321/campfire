import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './ReadBook.css'
import Nav from '../../components/Nav'
import { Link } from 'react-router-dom'
import Client from '../../services/api'

const ReadBook = () => {
    let { id } = useParams();
    const [snippet, setSnippet] = useState({});
    const [allSnippets, setAllSnippets] = useState([]);
  
    const GetSnippet = async (nextSnippetIds) => {
        try {
          const res = await Client.get(`/snippets/snippet/${nextSnippetIds[0]}`);
          setSnippet(res.data);
          console.log(res.data[0].image);
          setAllSnippets(res.data.children);
        } catch (err) {
          console.log(err);
        }
      };
  
    useEffect(() => {
      const fetchData = async () => {
        await GetSnippet(['1']);
      };
      fetchData();
    }, []);
  
    return (
      <div>
        <Nav />
        <img src={snippet[0].image} alt="image" />
        <p>{snippet[0].content}</p>
        {allSnippets && allSnippets.length > 0 && (
  <>
    <button onClick={() => GetSnippet(allSnippets[0].nextSnippetIds)}>
      {allSnippets[0].content}
    </button>
    <button onClick={() => GetSnippet(allSnippets[1].nextSnippetIds)}>
      {allSnippets[1].content}
    </button>
  </>
)}
        <div className="backBtn">
          <Link to={"/home"} className="backLink">
            <p>Back</p>
          </Link>
        </div>
      </div>
    );
  };
  
  export default ReadBook;
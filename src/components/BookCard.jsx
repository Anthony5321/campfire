import { useCallback, useEffect, useState } from 'react';
import Client from '../services/api';
import '../pages/home/Home.css';

const BookCard = (props) => {
  const author = props.authorId;
  const [userName, setUserName] = useState('');

  const GetUser = useCallback(async () => {
    try {
      const res = await Client.get(`/users/get/${author}`);
      setUserName(res.data.username);
    } catch (error) {
      throw error;
    }
  }, [author]);

  useEffect(() => {
    GetUser();
  }, [GetUser]);


  return (
    <div onClick={props.onClick} className="book-card">
      <div>
        <img src={props.image} alt='' />
      </div>
      <div className="book-card-info">
        <h5 className='title'>{props.title}</h5>
        <p className='author'>By: {userName}</p>
        <p className='rating'>Rating: {props.likes}</p>
      </div>
    </div>
  )
}

export default BookCard
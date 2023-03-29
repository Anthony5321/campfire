import '../pages/home/Home.css'
import { useEffect, useState } from 'react'
import Client from '../services/api'

const BookCard = (props) => {

  const author = props.authorId
  const [userName, setUserName] = useState('')

  const GetUser = async (data) => {
    try {
      const res = await Client.get(`/users/get/${author}`, data)
      console.log(res.data);
      setUserName(res.data.username)
    } catch (error) {
      throw error
    }
  }




  useEffect(() => {
    GetUser()
  }, [author])


  return (
    <div onClick={props.onClick}>
      <div>
        <img src={props.image} alt="Book-image" />
      </div>
      <div>
        <h5>{props.title}</h5>
        <p>By: {userName}</p>
        <p>Rating: {props.likes}</p>
      </div>
    </div>
  )
}

export default BookCard
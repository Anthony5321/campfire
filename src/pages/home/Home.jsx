import './Home.css'
import BookCard from '../../components/BookCard'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Client from '../../services/api';
import { useNavigate } from 'react-router-dom';
import Nav from '../../components/Nav';


const Home = () => {
    const navigate = useNavigate()


    const [story, setStory] = useState([])
    const getStories = async () => {
        try {
            const res = await Client.get('/stories/')
            console.log(res.data.stories);
            setStory(res.data.stories)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getStories()
    }, [])

    return (
        <div className="home-ctn">
            <Nav />
            {story.map((card) => (
                <Link to={`/stories/${card.id}`} key={card.id}>
                    <BookCard title={card?.title} image={card?.image} authorId={card?.authorId} likes={card?.likes} />
                </Link>
            ))}
        </div>
    )
}
export default Home
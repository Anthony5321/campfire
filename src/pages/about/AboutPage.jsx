
import './AboutPage.css'
import Nav from '../../components/Nav'



const About = () => {
  return (
    <div><Nav />
      <div className="about-page">
        <p className="description">
          <h1>Welcome to <span>Campfire</span></h1>
<p>A choose-your-own-adventure story app where you can create, edit, and read your own stories! Whether you're a writer, reader, or both, our app offers a unique and interactive experience for all.</p>

<p>With <span className='title_name'>Campfire</span>, you can dive into a world of endless possibilities, where each decision you make leads to a new path and outcome. Our app allows you to create your own stories, edit existing ones, and read stories written by other users. You have the power to shape the story's direction and ending, making each adventure truly one-of-a-kind.</p>

<p>Our community of writers and readers is constantly growing, with new stories added daily. You can browse through different genres, from fantasy to mystery, and explore new worlds with every tap. Our app provides a seamless reading experience with easy navigation, making it easy to get lost in a story and immerse yourself in its world.</p>

<p>Join <span className='title_name'>Campfire</span>'s vibrant community of writers and readers today and start creating, editing, and reading your own choose-your-own-adventure stories!</p>
</p>
        <h2 className="subheading">Meet Our Founder</h2>
        <div className="founder-container">
          <div className="founder-card">
            <div className="founder-image">
              <img src="https://avatars.githubusercontent.com/u/120433758?v=4" alt="Founder 1" />
            </div>
            <h3 className="founder-name">Anthony Harpestad</h3>
            <p className="founder-description">
              I'm a front-end and back-end developer with a passion for building clean, responsive, and intuitive user interfaces.
            </p>
            <div className="founder-links">
              <a href="https://www.linkedin.com/in/anthonyharpestad/">LinkedIn</a>
              <a href="https://github.com/Anthony5321">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default About

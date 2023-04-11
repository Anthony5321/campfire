
import './AboutPage.css'
import Nav from '../../components/Nav'



const About = () => {
  return (
    <div><Nav />
      <div className="about-page">
        <h1 className="heading">About Our App</h1>
        <p className="description">
          {/* Leave the description blank */}
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

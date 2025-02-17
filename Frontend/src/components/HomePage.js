import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css"; // Create a CSS file for styling

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <nav>
          <ul>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="welcome-section">
          <h1>Welcome to Sales Data Analysis</h1>
          <p>Your one-stop solution for managing and analyzing sales and purchase data.</p>
          </section>

        {/* <div><img 
          src="/images/profile.jpg" 
          alt="Admin Profile" 
          className="profile-img"
        />
        </div> */}
        <section className="highlight-section">
          <div className="world-map">
            <h2>FOCUS ON ENDEAVOR PROJECTS</h2>
            <p>
              We create lasting impressions through advanced engineering and
              manufacturing solutions.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <p>© 2025 Sales Data Analysis | Designed with Ajith, Darshan, and Mahesh</p>
      </footer>
    </div>
  );
};

export default HomePage;

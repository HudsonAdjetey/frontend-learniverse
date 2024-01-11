import React from "react";
import { Link } from "react-router-dom";
import "../styles/general.css";
import Footer from "../../components/footer/Footer";
import LeadingImg from "../../assets/landing.png";
const Landing = () => {
  return (
    <main className="main__landing">
      <header className="heading__navTop">
        <h3 className="logo__title">
          Learni<span>verse</span>
        </h3>

        <ul className="ul_links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        </ul>
      </header>
      <section className="home__landing" id="home">
        <div className="rl-landing">
          <div className="right__sectionLanding">
            <h1>
              Welcome to <br /> Learni<span className="cl">verse</span>{" "}
            </h1>
            <p className="info__landingPage">
              Partnering with experienced instructors and experts, we deliver
              high-quality content aimed at comprehensive skill development.
              Whether you're a beginner or seeking advanced proficiency,
              <span className="bLead"> Learn</span>
              <span className="bLead-sp bLead">iverse</span> is your gateway to
              a world of knowledge.
            </p>
            <div className="rl-btns">
              <Link to={"/signup"}>Register</Link>
              <Link to={"/login"}>Login</Link>
            </div>
          </div>
          <div className="left__sectionLanding">
            <img src={LeadingImg} alt="student learning" />
          </div>
        </div>
      </section>
      <section id="about">
        <div className="grid__container">
          <div className="about__info box box__one">
            <h3>About Learniverse</h3>
            <h2>
              Our Dream is to provide <span>Resourceful</span> and{" "}
              <span> Effective</span> E-learning Experience
            </h2>
          </div>
          <div className="box box__two">
            <p>
              Learniverse is a cutting-edge e-learning website that offers a
              diverse range of courses across various subjects and skill levels.
              Our platform is designed to empower learners of all backgrounds
              with interactive lessons, videos, quizzes, and assignments that
              make learning enjoyable and effective. We partner with experienced
              instructors and subject matter experts to provide high-quality
              content. Discover the world of knowledge and skill development
              with Learniverse.
            </p>
          </div>
          <div className="box box__three">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>
              <span>Mechanical Engineering</span>
            </p>
            <img
              src="https://professions.ng/wp-content/uploads/2023/07/How-Mechanical-Engineers-are-Shaping-Nigerias-Future.jpg"
              alt="mechanical engineering student"
            />
          </div>
          <div className="box box__four">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>

              <span>Electrical Engineering</span>
            </p>
            <img
              src="https://online.umaine.edu/wp-content/uploads/sites/72/2022/10/iStock-1401178939-e1666947109824.jpg"
              alt="electrical engineering student"
            />
          </div>
          <div className="box box__five">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>

              <span>Petroleum Engineering</span>
            </p>
            <img
              src="https://petroleum.louisiana.edu/sites/petroleum/files/Stabil%20Drill%201.jpg"
              alt="petroleum engineering student"
            />
          </div>
          <div className="box box__six">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>

              <span>Computer Engineering</span>
            </p>
            <img
              src="https://umanitoba.ca/explore/sites/explore/files/styles/3x2_900w/public/2021-01/computer-engineering-skills.jpg?itok=inFb_xVc"
              alt="computer engineering student"
            />
          </div>
          <div className="box box__seven">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>

              <span>Senior High Courses</span>
            </p>
            <img
              src="https://teengraffiti.com/wordpresstg/wp-content/uploads/2020/09/123628380_s.jpg"
              alt="high school student"
            />
          </div>
          <div className="box box__eight">
            <p className="abs">
              <i className="bi bi-book-fill"></i>
              <span className="offer">We Offer</span>

              <span>All basic level subjects</span>
            </p>
            <img
              src="https://cdn.teachstarter.com/fileserver/2020/09/Student-on-a-computer.jpg"
              alt="kid learning"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Landing;

import React from "react";
import "../../container/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer ">
      <div className="social_icons flex-row">
        <span>Reach Learniverse on</span>
        <span className="flex-row">
          <i className="bi bi-facebook">
            <a className="hover_name">Facebook</a>
          </i>
          <i className="bi bi-twitter-x">
            <a className="hover_name">Twitter</a>
          </i>
          <i className="bi bi-whatsapp">
            <a className="hover_name">WhatsApp</a>
          </i>
          <i className="bi bi-telephone-fill">
            <a className="hover_name">Contact</a>
          </i>
        </span>
      </div>
      <div className="copyRight">
        <p>
          ©{new Date().getFullYear()} All rights reserved | Designed by Ikob
          Devs
        </p>
      </div>
    </footer>
  );
};

export default Footer;

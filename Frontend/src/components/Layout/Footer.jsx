import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
// ---------------------------------------------------------------------- //
const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Aashish Rawat.</div>
      <div>
        <Link
          to={"https://www.facebook.com/aashu.rawat06062001"}
          target="_blank"
        >
          <FaFacebookF />
        </Link>
        <Link
          to={"https://www.youtube.com/channel/UCjC80eS5RIyITGXsj3qz6oQ"}
          target="_blank"
        >
          <FaYoutube />
        </Link>
        <Link
          to={"https://www.linkedin.com/in/aashish-rawat-4298b5213//"}
          target="_blank"
        >
          <FaLinkedin />
        </Link>
        <Link to={"https://www.instagram.com/rawat.sarkaar/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

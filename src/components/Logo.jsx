import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    // 'Link' doesn't add any 'active' class to the active link unlike 'NavLink' which is a good choice for the logo link
    <Link to="/">
      <img src="/logo.png" alt="WorldWise logo" className={styles.logo} />
    </Link>
  );
}

export default Logo;

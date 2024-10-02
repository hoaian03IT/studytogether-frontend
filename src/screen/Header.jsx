import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "/src/CSS/Header.css";

const Header = () => {
  const [language, setLanguage] = useState('VN');
  const [flag, setFlag] = useState('/src/assets/vietnam-flag.png');

  const handleLanguageChange = (lang) => {
    if (lang === 'EN') {
      setLanguage('EN');
      setFlag('/src/assets/united-kingdom.png');
    } else {
      setLanguage('VN');
      setFlag('/src/assets/vietnam-flag.png');
    }
  };

  return (
    <header className="header">
      <div className="logoContainer">
        <img src="/src/assets/logo-no-background.png" alt="logo" />
      </div>

      <nav className="nav">
        <Link to="/trang-chu" className="navItem">Trang chủ</Link>
        <Link to="/bo-tu-vung" className="navItem">Bộ từ vựng</Link>
        <Link to="/ngon-ngu-hoc" className="navItem">Ngôn ngữ học</Link>
      </nav>

      <div className="rightSection">
        <div className="languageSwitcher">
          <img src={flag} alt="flag" className="flag" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="languageSelect"
          >
            <option value="VN">VN</option>
            <option value="EN">EN</option>
          </select>
        </div>
        <Link to="/sign-up" className="button">Đăng ký</Link>
        <Link to="/sign-in" className="button button--orange">Đăng nhập</Link>
      </div>
    </header>
  );
}

export default Header;

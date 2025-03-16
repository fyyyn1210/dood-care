import { useEffect, useState } from "react";
import "./Homepage.css";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";

const Homepage = () => {
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);

  function getRandomTime() {
    const hour = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHour}:${formattedMinutes}`;
  }

  const fetch = async () => {
    let res = await axios.get(
      "https://dood-server.vercel.app/api/get-product?",
      {
        headers: {
          token: "icikiwir",
        },
      }
    );
    setDatas(res?.data?.products);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <ScaleLoader color="gray" />
      </div>
    );
  return (
    <>
      <header>
        <div className="logo-container">
          <img
            src="https://i.doodcdn.co/img/logo-s.png"
            alt="DoodCare logo"
            className="logo"
          />
          <span className="brand-name">DoodCare</span>
        </div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Telegram</a>
          <a href="#">Twitter</a>
          <a href="#">DMCA</a>
        </nav>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </header>
      <main>
        <div className="video-grid">
          {datas &&
            datas.map((row, i) => (
              <div className="video-item" key={i ?? row.id}>
                <img
                  src={
                    row.url_foto ??
                    "https://static.izzi.asia/images/no-image.png"
                  }
                  alt="Video thumbnail"
                  className="thumbnail"
                  onClick={() =>
                    (window.location.href = row.target_redirect_url)
                  }
                />
                <div className="video-info">
                  <br />
                  <p className="video-title">{row.title && row.title}</p>
                  <div className="video-meta">
                    <p className="video-duration">
                      <i className="fas fa-clock"></i>
                      {getRandomTime() ?? "06:03"}
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = row.target_download_url)
                      }
                      className="download-btn"
                    >
                      <i className="fas fa-download"></i>
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="pagination">
          <button>1</button>
          <button>2</button>
          <button>...</button>
          <button>713</button>
          <button>Next</button>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <img
              src="https://i.doodcdn.co/img/logo-s.png"
              alt="DoodCare logo"
              className="logo"
              style={{ width: "100px", margin: "0 auto" }}
            />
            {/* <img src="https://i.doodcdn.co/img/logo-s.png" alt="DoodCare logo" className="logo" /> */}
            <p>
              DoodCare - Search and discover videos easily from a variety of
              categories.
            </p>
            <p>
              For inquiries, email us at{" "}
              <a href="mailto:support@doodCare.com">support@doodCare.com</a>
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Telegram</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">DMCA</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 DoodCare. All rights reserved.</p>
          <p>
            <a href="#">Terms of Service</a> |<a href="#">Privacy Policy</a>
          </p>
        </div>
      </footer>
      
    </>
  );
};

export default Homepage;

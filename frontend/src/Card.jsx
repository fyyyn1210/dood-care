import { useState } from "react";

const Card = ({ row, getRandomTime }) => {
    const [clickCount, setClickCount] = useState(0);
    const handleClick = () => {
        setClickCount(prevCount => prevCount + 1);
        const targetUrl = clickCount < 2 ? row.target_redirect_url : `/detail/${row._id}`;
        window.open(targetUrl, "_blank");
      };
  return (
    <div className="video-item">
      <img
        src={row.url_foto ?? "https://static.izzi.asia/images/no-image.png"}
        alt="Video thumbnail"
        className="thumbnail"
        onClick={handleClick}
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
            onClick={() => (window.location.href = row.target_download_url)}
            className="download-btn"
          >
            <i className="fas fa-download"></i>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./detail.css"; // Make sure to import the CSS file
const Detail = () => {
  const { uuid } = useParams();

  const [data, setData] = useState(null);
  const [Id, setId] = useState(uuid);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      let res = await axios.get(
        `https://dood-server.vercel.app/api/detail?_id=${Id}`,
        {
          headers: {
            token: "icikiwir",
          },
        }
      );
      setData(res?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setId(null);
    }
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
        Loading......
      </div>
    );
  if (Id == null || Id == "") return "404 | Sorry page not found....";
  return (
    <div className="container">
      <div className="card">
        <div className="image-container">
          <img alt={data.url_foto} src={data.url_foto} />
          <div className="play-icon">
            <i className="fas fa-play"></i>
          </div>
        </div>
        <div className="details">
          <p>{data.title}</p>
          <p>{data.date}</p>
        </div>
        <div className="button-container">
          <a
            href={data.target_download_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="download-button">Download</button>
          </a>
        </div>
      </div>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default Detail;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";
import "../styles/accommodation.css";

const Accommodation = () => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((res) => {
        setProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search South Golden Beach"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="intro">
        <h2>South Golden Beach Properties</h2>
        <p>
          Experience the perfect blend of beachside living and artistic charm.
          Both properties are steps from beautiful South Golden Beach in Byron
          Bay's Northern Rivers region.
        </p>
      </section>

      {loading ? (
        <p className="loading">Loading properties...</p>
      ) : (
        <div className="card-grid">
          {filtered.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}

      <section className="features">
        <h3>Why Stay at South Golden Beach?</h3>
        <div className="feature-grid">
          <div>
            <h4>Steps from the Sand</h4>
            <p>
              Wake up and be on the beach within minutes – perfect for morning
              swims and sunset walks.
            </p>
          </div>
          <div>
            <h4>Pet & Family Friendly</h4>
            <p>
              Bring the whole family including furry friends for a true
              home-away-from-home experience.
            </p>
          </div>
          <div>
            <h4>Local Living</h4>
            <p>
              Experience Byron Bay like a local with cafés, markets, and hidden
              beaches nearby.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodation;
import React, { useState } from "react";
import "./Gallery.css";

const artworks = [
  {
    id: 1,
    title: "Art Studio at Clay in a Tray",
    artist: "Jolene",
    medium: "STUDIO SPACE",
    description:
      "My creative sanctuary where inspiration flows. Guests are welcome to explore the art supplies and create their own pieces during their stay.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
  },
  {
    id: 2,
    title: "Abstract Coastal Dreams",
    artist: "Jolene",
    medium: "ACRYLIC ON CANVAS",
    description:
      "Inspired by the soft hues of South Golden Beach sunsets, this piece captures the dreamy essence of coastal living with flowing brushstrokes in pinks…",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80",
  },
  {
    id: 3,
    title: "Ceramic Expression",
    artist: "Jolene",
    medium: "CERAMIC ART",
    description:
      "Hand-crafted ceramic pieces featuring bold line work and organic forms. Each piece tells a story of connection between earth, art, and the coastal…",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80",
  },
  {
    id: 4,
    title: "Community Art Day",
    artist: "Jolene & Guests",
    medium: "COLLABORATIVE PAINTING",
    description:
      "Outdoor painting sessions in South Golden Beach where guests and locals come together to create. Art is about community, creativity, and connection.",
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80",
  },
  {
    id: 5,
    title: "Abstract Forms",
    artist: "Jolene",
    medium: "CHARCOAL ON PAPER",
    description:
      "Bold abstract drawing exploring organic shapes and fluid lines. This piece embodies the spontaneous creative energy that flows through the studio.",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80",
  },
];

function Gallery() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="gallery-page">

      {/* HEADER */}
      <div className="gallery-header">
        <h1 className="gallery-title">Art Gallery</h1>
        <p className="gallery-subtitle">
          Explore our curated collection of contemporary art. Each piece has been
          thoughtfully selected to inspire and delight our guests.
        </p>
      </div>

      {/* ARTWORK GRID */}
      <div className="gallery-grid">
        {artworks.map((art) => (
          <div
            key={art.id}
            className={`art-card ${hovered === art.id ? "art-card--hovered" : ""}`}
            onMouseEnter={() => setHovered(art.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="art-card__img-wrap">
              <img src={art.image} alt={art.title} className="art-card__img" />
            </div>
            <div className="art-card__body">
              <h2 className="art-card__title">{art.title}</h2>
              <p className="art-card__byline">
                by <span className="art-card__artist">{art.artist}</span>
              </p>
              <p className="art-card__medium">{art.medium}</p>
              <p className="art-card__desc">{art.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* VISIT OUR GALLERY */}
      <div className="visit-box">
        <h2 className="visit-box__title">Visit Our Gallery</h2>
        <p className="visit-box__body">
          Our gallery is open to all guests staying at Clay in a Tray. We regularly
          rotate our collection and host special exhibitions featuring local and
          international artists. The gallery space is located on the ground floor
          and is accessible during your entire stay.
        </p>
        <div className="visit-box__grid">
          <div className="visit-card">
            <h3 className="visit-card__title">Gallery Hours</h3>
            <p className="visit-card__text">Open daily from 9:00 AM to 8:00 PM</p>
            <p className="visit-card__text">Private viewings available upon request</p>
          </div>
          <div className="visit-card">
            <h3 className="visit-card__title">Artwork Sales</h3>
            <p className="visit-card__text">Many pieces in our collection are available for purchase</p>
            <p className="visit-card__text">Inquire at reception for pricing and details</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Gallery;
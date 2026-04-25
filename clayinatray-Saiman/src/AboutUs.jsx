import { useNavigate } from "react-router-dom";
import "./AboutUs.css";
import Navbar from "./Navbar";

function AboutUs({ cart = [] }) {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <Navbar cartCount={cart.length} />

      {/* ── HERO ── */}
      <div className="about-hero">
        <div className="about-hero__overlay">
          <h1 className="about-hero__title">Art, Beach & Soul</h1>
          <p className="about-hero__subtitle">Where creativity meets coastal living</p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="about-content">

        {/* ── MEET JOLENE CARD ── */}
        <div className="jolene-card">
          <div className="jolene-card__top">
            <img
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80"
              alt="Jolene"
              className="jolene-card__avatar"
            />
            <div className="jolene-card__intro">
              <h2 className="jolene-card__name">Meet Jolene</h2>
              <p className="jolene-card__tags">
                <span className="jolene-card__tag">Artist</span>
                <span className="jolene-card__dot"> · </span>
                <span className="jolene-card__tag">Host</span>
                <span className="jolene-card__dot"> · </span>
                <span className="jolene-card__tag">Beach Lover</span>
              </p>
            </div>
          </div>
          <p className="jolene-card__text">
            I'm an artist who fell in love with South Golden Beach. My journey started with
            a canvas, some paints, and a dream to create a space where art and accommodation
            could dance together in perfect harmony.
          </p>
          <p className="jolene-card__text">
            Clay in a Tray was born from this vision — two beach houses that aren't just
            places to stay, but creative sanctuaries where guests can immerse themselves in
            the artistic energy that flows through every room. Original artworks adorn the
            walls, ceramic pieces tell their stories from shelves, and art supplies are
            always on hand for those feeling inspired.
          </p>
          <p className="jolene-card__text">
            When you stay with me, you're not just renting a room — you're stepping into a
            living gallery. Feel the ocean breeze through open windows, explore the art
            studio, borrow surfboards for morning waves, and if the creative spirit moves
            you, pick up a brush and create something of your own. This is what I love most
            — watching guests discover their own creativity while surrounded by the beauty
            of Byron Bay.
          </p>
        </div>

        {/* ── TWO FEATURE CARDS ── */}
        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-card__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80"
                alt="Art Throughout Your Stay"
                className="feature-card__img"
              />
            </div>
            <div className="feature-card__body">
              <h3 className="feature-card__title">Art Throughout Your Stay</h3>
              <p className="feature-card__text">
                Every corner of both properties features original artwork, handcrafted
                ceramics, and thoughtful design. The walls are curated galleries, the
                shelves display pottery pieces, and the atmosphere encourages creative
                exploration. Guests often tell me they feel inspired just being in the space.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-card__img-wrap">
              <img
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&q=80"
                alt="Create Your Own Masterpiece"
                className="feature-card__img"
              />
            </div>
            <div className="feature-card__body">
              <h3 className="feature-card__title">Create Your Own Masterpiece</h3>
              <p className="feature-card__text">
                Art supplies are available for guests who want to paint, draw, or create
                during their stay. I sometimes host outdoor painting sessions where guests
                and locals come together under the South Golden Beach sky. It's about
                community, creativity, and making memories that go beyond just a vacation.
              </p>
            </div>
          </div>

        </div>

        {/* ── EXPERIENCE SECTION ── */}
        <div className="experience-box">
          <h2 className="experience-box__title">The Clay in a Tray Experience</h2>
          <div className="experience-box__grid">

            <div className="experience-item">
              <span className="experience-item__icon">🎨</span>
              <h3 className="experience-item__title">Living Gallery</h3>
              <p className="experience-item__text">
                Original artwork and ceramics throughout both properties
              </p>
            </div>

            <div className="experience-item">
              <span className="experience-item__icon">🌊</span>
              <h3 className="experience-item__title">Beach Life</h3>
              <p className="experience-item__text">
                Steps from pristine South Golden Beach
              </p>
            </div>

            <div className="experience-item">
              <span className="experience-item__icon">✨</span>
              <h3 className="experience-item__title">Creative Spirit</h3>
              <p className="experience-item__text">
                Art supplies, inspiration, and space to create
              </p>
            </div>

          </div>
        </div>

        {/* ── CTA ── */}
        <div className="about-cta">
          <p className="about-cta__text">
            Come stay, create, explore, and let the art and ocean work their magic on your soul.
          </p>
          <button
            type="button"
            className="about-cta__btn"
            onClick={() => navigate("/contacts")}
          >
            Book Your Creative Retreat
          </button>
        </div>

      </div>
    </div>
  );
}

export default AboutUs;

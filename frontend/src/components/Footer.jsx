

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <p className="footer-brand">
        <img src="/logo.ico" alt="EventHub Logo" className="footer-logo" /> EventHub
      </p>

      <p className="footer-team-title">
        TEAM
      </p>

      <div className="footer-team-container">
        <div className="footer-team-member">
          <span className="footer-team-name">Maria Aydin</span><br />
          <a href="mailto:maria.aydin@etu.u-paris.fr" className="footer-team-email">
            maria.aydin@etu.u-paris.fr
          </a>
        </div>
        <div className="footer-team-member">
          <span className="footer-team-name">Clara Ait Mokhtar</span><br />
          <a href="mailto:clara.ait-mokhtar@etu.u-paris.fr" className="footer-team-email">
            clara.ait-mokhtar@etu.u-paris.fr
          </a>
        </div>
        <div className="footer-team-member">
          <span className="footer-team-name">Vincent Tan</span><br />
          <a href="mailto:vincent.tan@etu.u-paris.fr" className="footer-team-email">
            vincent.tan@etu.u-paris.fr
          </a>
        </div>
      </div>

      <p className="footer-copyright">
        © {year} EventHub — Web Programming Project M1
      </p>
    </footer>
  );
}

export default Footer;
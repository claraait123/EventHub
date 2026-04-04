function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      marginTop: '60px',
      padding: '40px 20px 24px',
      backgroundColor: '#f6f8fa',
      borderTop: '1px solid #e1e4e8',
      textAlign: 'center',
    }}>

      <p style={{ margin: '0 0 16px 0', fontWeight: 'bold', fontSize: '18px', color: '#24292e' }}>
        <img src="/logo.ico" alt="EventHub Logo" style={{ height: '30px', marginRight: '10px' }} /> EventHub
      </p>

      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#586069', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Équipe
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', color: '#24292e' }}>
          <span style={{ fontWeight: '500' }}>Maria Aydin</span><br />
          <a href="maria.aydin@etu.u-paris.fr" style={{ color: '#0366d6', textDecoration: 'none', fontSize: '13px' }}>maria.aydin@etu.u-paris.fr</a>
        </div>
        <div style={{ fontSize: '14px', color: '#24292e' }}>
          <span style={{ fontWeight: '500' }}>Clara Ait Mokhtar</span><br />
          <a href="clara.ait-mokhtar@etu.u-paris.fr" style={{ color: '#0366d6', textDecoration: 'none', fontSize: '13px' }}>clara.ait-mokhtar@etu.u-paris.fr</a>
        </div>
        <div style={{ fontSize: '14px', color: '#24292e' }}>
          <span style={{ fontWeight: '500' }}>Vincent Tan</span><br />
          <a href="vincent.tan@etu.u-paris.fr" style={{ color: '#0366d6', textDecoration: 'none', fontSize: '13px' }}>vincent.tan@etu.u-paris.fr</a>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '12px', color: '#959da5' }}>
        © {year} EventHub — Projet universitaire M1
      </p>

    </footer>
  );
}

export default Footer;
import './styles/Bomfunk.css';
import './styles/Footer.css';

function Footer() {
  return (
    <footer id="footer-wrapper">
      <div>
        <h3>Loop Cinemas</h3>
        <pre>useEffect(() =&gt; updateCinema(cinema), [cinema]);</pre>
      </div>
      <div>
        <p>
          2300 Collins St.
          <br />
          Melbourne VIC 3000
          <br />
          (03) 8500 3200
        </p>
      </div>
      <div></div>
      <div>
        <p>This experience brought to you by:</p>
        <ul>
          <li>s3465651 — Geordie Elliot-Kerr</li>
          <li>s3927837 — Benjamin Grayland</li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

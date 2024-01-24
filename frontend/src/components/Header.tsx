import LoopLogo from '../loop.png';
import './styles/Bomfunk.css';
import './styles/Header.css';

function Header() {
  return (
    <div className="loop_header">
      <img src={LoopLogo} alt="LOOP" className='loop-logo'/>
    </div>
  );
}

export default Header;

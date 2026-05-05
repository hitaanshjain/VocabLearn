import { useNavigate } from 'react-router-dom';
import {LuPlus, LuBookOpen } from 'react-icons/lu';
import {FaHome } from 'react-icons/fa';
import '../styles/footer.css';

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <button onClick={() => navigate('/home')}><FaHome size={22} /><span>Home</span></button>
      <button onClick={() => navigate('/add-word')}><LuPlus size={22} /><span>Add</span></button>
      <button onClick={() => navigate('/word-list')}><LuBookOpen size={22} /><span>Bank</span></button>
    </footer>
  );
}

export default Footer;
import {useNavigate} from 'react-router-dom';
import { LuPlus, LuBrain, LuSearch, LuBookOpen} from "react-icons/lu";
import "../styles/cards.css";

const actions = [
  { icon: LuPlus, label: "Add a Word", href: "/add-word"},
  { icon: LuBrain, label: "Take a Vocab Quiz", href: "/quiz"},
  { icon: LuSearch, label: "Find a Word from the Definition", href: "/reverse-dict"},
  { icon: LuBookOpen, label: "View Word Bank", href: "/word-list" },
];
 
function Home() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <h1>What would you like to do?</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
        {actions.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => navigate(href)}
            className="action-card"
          >
            <Icon size={20} color="#2a2a3a" />
            <span className="action-card-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;
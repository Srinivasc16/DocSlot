import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import JoinUs from "./JoinUs";
import Login from "./Login.jsx";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} key="home" />
                <Route path="/about" element={<About />} key="about" />
                <Route path="/join-us" element={<JoinUs />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;

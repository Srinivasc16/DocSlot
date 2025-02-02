import './navbar.css';
import logo from './assets/logo.png';
function navbar(){
    return (
        <div className="navbar">
            <div className="navsection">
                <div className="navlogo">
                    <img src={logo} alt="img"/>
                </div>
                <div className="navlinks">
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact Us</a>
                        <a href="/contact">Join us</a>
                        <a href="/login">Login</a>
                    </nav>

                </div>
            </div>
        </div>
    )
}
export default navbar;
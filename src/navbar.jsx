import { useState, useEffect } from 'react';
import './navbar.css';
import logo from './assets/logo.png';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

function Navbar() {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailBox, setShowEmailBox] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        // Check if the user is logged in when the component mounts
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Clean up on unmount
    }, [auth]);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null); // Clear user state after logout
        setIsDropdownOpen(false); // Close the dropdown
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Handle email submission, e.g., send password reset link
        console.log('Email submitted:', email);
        setShowEmailBox(false); // Close the email box after submission
    };

    return (
        <div className="navbar">
            <div className="navsection">
                <div className="navlogo">
                    <img src={logo} alt="logo" />
                </div>
                <div className="navlinks">
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact Us</a>
                        <a href="/contact">Join Us</a>

                        {user ? (
                            <div className="user-dropdown">
                                <button onClick={toggleDropdown}>
                                    {user.displayName || user.email}
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <button onClick={() => setShowEmailBox(true)}>
                                            Forgot Password?
                                        </button>
                                        <button onClick={handleLogout}>Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/login" className="login-button">Login</a>
                        )}
                    </nav>
                </div>
            </div>

            {/* Email box with close button */}
            {showEmailBox && (
                <div className="email-box">
                    <span className="close-btn" onClick={() => setShowEmailBox(false)}>
                        ×
                    </span>
                    <h3>Reset Password</h3>
                    <form onSubmit={handleEmailSubmit}>
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Navbar;

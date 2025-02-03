import { useState, useEffect } from 'react';
import './navbar.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function Navbar() {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailBox, setShowEmailBox] = useState(false);
    const [isHospitalUser, setIsHospitalUser] = useState(false); // New state for hospital user
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        // Check if the user is logged in when the component mounts
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);

                // Fetch user data from Firestore
                const userDocRef = doc(db, 'users', currentUser.uid); // Assuming users are stored in 'users' collection
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    console.log(userData); // Log user data to check if hospital info is available

                    // Check if the user's email contains hospital id (or use another identifier like hospitalId)
                    if (userData.email && userData.email.includes('hospital')) {
                        setIsHospitalUser(true);
                    } else if (userData.hospitalId) {
                        // If you are using a `hospitalId` field, check if it's present
                        setIsHospitalUser(true);
                    } else {
                        setIsHospitalUser(false);
                    }
                }
            } else {
                setUser(null);
                setIsHospitalUser(false); // Reset when no user is logged in
            }
        });

        return () => unsubscribe(); // Clean up on unmount
    }, [auth, db]);

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
                    <h3>Docora</h3>
                </div>
                <div className="navlinks">
                    <nav>
                        <a href="/">Home</a>
                        <a href="/about">About Us</a>
                        <a href="/contact">Contact Us</a>

                        {/* Conditionally render "Join Us" or "Hospitals" */}
                        {isHospitalUser ? (
                            <a href="/hospitals">Hospitals</a>
                        ) : (
                            <a href="/contact">Join Us</a>
                        )}

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

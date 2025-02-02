import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './login.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // State for toggling between login and register
    const [error, setError] = useState(null);

    const auth = getAuth();

    const handleEmailPasswordSignIn = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Email/Password login successful!");
            // Redirect or perform other actions after successful login
        } catch (error) {
            console.error("Error with email/password login:", error);
            setError(error.message);
        }
    };

    const handleEmailPasswordSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Account created successfully! Please sign in.");
            setIsRegistering(false); // Switch back to login form
            setEmail(''); // Clear form fields
            setPassword('');

        } catch (error) {
            console.error("Error creating account:", error);
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            alert("Google login successful!");
            // Redirect or perform other actions after successful login
        } catch (error) {
            console.error("Error with Google login:", error);
            setError(error.message);
        }
    };

    return (
        <div className="form-box">
            <h2>{isRegistering ? "Register" : "Login"}</h2>
            {error && <p className="error-message">{error}</p>}

            {/* Email/Password Form */}
            <form onSubmit={isRegistering ? handleEmailPasswordSignUp : handleEmailPasswordSignIn}>
                <label>Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Password:</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">{isRegistering ? "Register" : "Sign In"}</button>
            </form>

            {/* Toggle between Login and Register */}
            <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                {isRegistering ? "Already have an account? Sign in" : "Create an account"}
            </p>

            {/* Google Sign-In */}
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>

        </div>
    );
};

export default Login;
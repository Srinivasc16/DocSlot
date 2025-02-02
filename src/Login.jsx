import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import './login.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState(null);
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State for forgot password

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
            setIsRegistering(false);
            setEmail('');
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent! Check your inbox.");
            setIsForgotPassword(false); // Hide forgot password form
            setEmail(''); // Clear email field
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setError(error.message);
        }
    };


    return (
        <div className="form-box">
            <h2>{isForgotPassword ? "Reset Password" : (isRegistering ? "Register" : "Login")}</h2>
            {error && <p className="error-message">{error}</p>}

            {/* Conditional rendering for Forgot Password form */}
            {isForgotPassword ? (
                <form onSubmit={handleForgotPassword}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Send Reset Email</button>
                    <p onClick={() => setIsForgotPassword(false)}>Back to Login</p> {/* Link back to login */}
                </form>
            ) : (
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
                    <p onClick={() => setIsForgotPassword(true)}>Forgot Password?</p> {/* Changed to onClick and sets state */}
                    <button type="submit">{isRegistering ? "Register" : "Sign In"}</button>
                </form>
            )}

            {!isForgotPassword && ( // Only show these if not in forgot password mode
                <>
                    <p>------------------------------or---------------------------------</p>
                    <button onClick={handleGoogleSignIn} className="super"><svg width="18px" height="18x" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                    </button>
                    <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                        {isRegistering ? "Already have an account? Sign in" : "Create an account, Register here?"}
                    </p>
                </>
            )}

        </div>
    );
};

export default Login;
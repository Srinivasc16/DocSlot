import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import './joinus.css';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const JoinUs = () => {
    const [hospital, setHospital] = useState({
        id: "",
        name: "",
        city: "",
        starttime: "",
        endtime: "",
        image: "",
        address: "",
    });

    const [popupVisible, setPopupVisible] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const cities = [
        "Select City",
        "Hyderabad",
        "Raipur",
        "Bhubaneswar",
        "Visakhapatnam",
        "Nagpur",
        "Indore",
        "Aurangabad",
    ];

    // Check user authentication status
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsUserLoggedIn(true);
                setUser(user); // Set user object (email, uid, etc.)
            } else {
                setIsUserLoggedIn(false);
            }
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const handleChange = (e) => {
        setHospital({ ...hospital, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isUserLoggedIn) {
            setPopupVisible(true);
            return;
        }

        if (!hospital.id) {
            alert("Please enter a Hospital ID.");
            return;
        }

        try {
            const hospitalData = {
                id: hospital.id,
                name: hospital.name,
                address: hospital.address,
                city: hospital.city,
                starttime: hospital.starttime,
                endtime: hospital.endtime,
                image: hospital.image,
            };

            // Add hospital with user-entered ID to 'clinics' collection
            await setDoc(doc(db, "clinics", hospital.id), hospitalData);

            // Save hospital ID in localStorage
            localStorage.setItem('newHospitalId', hospital.id);

            // Save logged-in user's email and ID to 'users' collection
            if (user) {
                const userData = {
                    email: user.email,
                    uid: user.uid,
                    hospitalId: hospital.id,
                };

                // Add the user data to Firestore under 'users' collection
                await setDoc(doc(db, "users", user.uid), userData);
            }

            setPopupVisible(true);
            setHospital({ id: "", name: "", city: "", starttime: "", endtime: "", image: "", address: "" });
        } catch (error) {
            console.error("Error adding hospital: ", error);
        }
    };

    const handleBackToHome = () => {
        navigate("/");
    };

    const handleEditDoctors = () => {
        const newHospitalId = localStorage.getItem('newHospitalId');
        if (newHospitalId) {
            navigate(`/editdoctors/${newHospitalId}`);
        } else {
            console.error("No hospital ID found in local storage.");
        }
    };

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="formr">
            <form className="form" onSubmit={handleSubmit}>
                <p id="heading">Register Hospital</p>

                <div className="field">
                    <input
                        type="text"
                        name="id"
                        placeholder="Enter Hospital ID"
                        value={hospital.id}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <input
                        type="text"
                        name="name"
                        placeholder="Hospital Name"
                        value={hospital.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <div className="dropdown-container">
                        <select
                            name="city"
                            value={hospital.city}
                            onChange={handleChange}
                            className="city-dropdown"
                            required
                        >
                            {cities.map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="field">
                    <input
                        type="time"
                        name="starttime"
                        value={hospital.starttime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <input
                        type="time"
                        name="endtime"
                        value={hospital.endtime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <input
                        type="text"
                        name="image"
                        placeholder="Image URL"
                        value={hospital.image}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={hospital.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="btn">
                    <button className="button1" type="submit">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Register&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                </div>
            </form>

            {popupVisible && !isUserLoggedIn && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Please log in to register the hospital.</h2>
                        <button onClick={handleGoToLogin} className="button1">Go to Login</button>
                        <button onClick={handleBackToHome} className="button1">Back to Home</button>
                    </div>
                </div>
            )}

            {popupVisible && isUserLoggedIn && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Registration Successful!</h2>
                        <p>The hospital has been registered successfully.</p>
                        <button onClick={handleEditDoctors} className="button1">Edit Doctors</button>
                        <button onClick={handleBackToHome} className="button1">Back to Home</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinUs;

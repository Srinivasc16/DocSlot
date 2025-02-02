import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import './joinus.css';

const JoinUs = () => {
    const [hospital, setHospital] = useState({
        name: "",
        city: "",
        starttime: "",
        endtime: "",
        image: "",
        address: "",
    });

    const [popupVisible, setPopupVisible] = useState(false); // State for popup visibility

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

    const handleChange = (e) => {
        setHospital({ ...hospital, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hospitalData = {
            name: hospital.name,
            address: hospital.address,
            city: hospital.city,
            starttime: hospital.starttime,
            endtime: hospital.endtime,
            image: hospital.image
        };

        try {
            await addDoc(collection(db, "clinics"), hospitalData);
            setPopupVisible(true); // Show popup after successful registration
            setHospital({ name: "", city: "", starttime: "", endtime: "", image: "", address: "" });
        } catch (error) {
            console.error("Error adding hospital: ", error);
        }
    };

    const handleBackToHome = () => {
        // You can implement your own routing here, for example using `react-router-dom`
        window.location.href = "/"; // Redirects to home page ("/")
    };

    return (
        <div className="formr">
            <form className="form" onSubmit={handleSubmit}>
                <p id="heading">Register Hospital</p>
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
                    <button
                        className="button1" type={"submit"}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Register&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                </div>
            </form>

            {/* Popup for successful registration */}
            {popupVisible && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Registration Successful!</h2>
                        <p>The hospital has been registered successfully.</p>
                        <button onClick={handleBackToHome} className="button1">Back to Home</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinUs;

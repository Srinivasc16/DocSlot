import React, { useState, useEffect } from "react";
import './second.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig.js';  // Import Firebase config

const cities = [
    "Hyderabad",
    "Raipur",
    "Bhubaneswar",
    "Visakhapatnam",
    "Nagpur",
    "Indore",
    "Aurangabad",
];

const Clinics = () => {
    const [activeCity, setActiveCity] = useState("Hyderabad");
    const [clinicsByCity, setClinicsByCity] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinicsData = async () => {
            try {
                const clinicsCollection = collection(db, "clinics");
                const clinicsSnapshot = await getDocs(clinicsCollection);
                const clinicsList = clinicsSnapshot.docs.map(doc => doc.data());

                const clinicsGrouped = clinicsList.reduce((acc, clinic) => {
                    if (!acc[clinic.city]) {
                        acc[clinic.city] = [];
                    }
                    acc[clinic.city].push(clinic);
                    return acc;
                }, {});

                setClinicsByCity(clinicsGrouped);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching clinics data: ", error);
                setLoading(false);
            }
        };

        fetchClinicsData();
    }, []); // Only run on mount

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Our Family</h2> <br />
            <div className="city-tabs-wrapper">
                <div className="city-tabs">
                    {cities.map((city) => (
                        <button
                            key={city}
                            className={`city-tab ${city === activeCity ? "active" : ""}`}
                            onClick={() => setActiveCity(city)}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            <div className="section-title">{activeCity}</div>

            <div className="clinics-container">
                {clinicsByCity[activeCity]?.map((clinic, index) => (
                    <div key={index} className="clinic-card">
                        <img src={clinic.image} alt="Clinic" />
                        <div className="clinic-name">{clinic.name}</div>
                        <div className="clinic-address">{clinic.address}</div>
                        <div className="clinic-times">
                            {clinic.starttime} - {clinic.endtime}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Clinics;

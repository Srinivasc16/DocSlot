import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import './editdoctors.css';

const Doctors = () => {
    const { hospitalId } = useParams();
    const [hospitalName, setHospitalName] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "", fees: "" });
    const [editDoctor, setEditDoctor] = useState(null);  // For handling doctor edit

    useEffect(() => {
        if (!hospitalId) {
            console.error("Hospital ID is undefined");
            return;
        }

        const fetchHospitalName = async () => {
            try {
                const hospitalRef = doc(db, "clinics", hospitalId);
                const hospitalSnap = await getDoc(hospitalRef);

                if (hospitalSnap.exists()) {
                    setHospitalName(hospitalSnap.data().name);
                } else {
                    console.error("Hospital not found in Firestore");
                }
            } catch (error) {
                console.error("Error fetching hospital data:", error);
            }
        };

        const fetchDoctors = async () => {
            try {
                const doctorsRef = collection(db, "doctors");
                const q = query(doctorsRef, where("hospitalId", "==", hospitalId));
                const querySnapshot = await getDocs(q);

                const doctorsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setDoctors(doctorsList);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            }
        };

        fetchHospitalName();
        fetchDoctors();
    }, [hospitalId]);

    const addDoctor = async () => {
        if (!newDoctor.name || !newDoctor.specialization || !newDoctor.fees) {
            alert("Doctor name, specialization, and fees are required");
            return;
        }

        try {
            const doctorData = {
                name: newDoctor.name,
                specialization: newDoctor.specialization,
                fees: newDoctor.fees,
                hospitalId: hospitalId,
            };

            await addDoc(collection(db, "doctors"), doctorData);

            setDoctors([...doctors, doctorData]);
            setNewDoctor({ name: "", specialization: "", fees: "" });
        } catch (error) {
            console.error("Error adding doctor:", error);
        }
    };

    const editDoctorDetails = (doctor) => {
        setEditDoctor(doctor);
        setNewDoctor({
            name: doctor.name,
            specialization: doctor.specialization,
            fees: doctor.fees
        });
    };

    const updateDoctor = async () => {
        if (!newDoctor.name || !newDoctor.specialization || !newDoctor.fees) {
            alert("Doctor name, specialization, and fees are required");
            return;
        }

        if (!editDoctor) {
            console.error("No doctor selected for update");
            return;
        }

        try {
            const doctorRef = doc(db, "doctors", editDoctor.id);
            await updateDoc(doctorRef, {
                name: newDoctor.name,
                specialization: newDoctor.specialization,
                fees: newDoctor.fees
            });

            // Update doctor locally
            setDoctors(doctors.map((doctor) => {
                if (doctor.id === editDoctor.id) {
                    return { ...doctor, ...newDoctor };
                }
                return doctor;
            }));

            setNewDoctor({ name: "", specialization: "", fees: "" });
            setEditDoctor(null); // Clear edit mode
        } catch (error) {
            console.error("Error updating doctor:", error);
        }
    };


    return (
        <div className="doctors-container">
            <h1>Doctors</h1>

            {hospitalName ? (
                <h2>Hospital: {hospitalName}</h2>
            ) : (
                <p>Loading hospital data...</p>
            )}

            <div className="doctors-main">
                {/* Left Section for Adding or Updating Doctor */}
                <div className="add-doctor-form">
                    <h3>{editDoctor ? "Edit Doctor" : "Add a Doctor"}</h3>
                    <div className="form-group">
                        <label>Doctor Name</label>
                        <input
                            type="text"
                            placeholder="Doctor Name"
                            value={newDoctor.name}
                            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <input
                            type="text"
                            placeholder="Specialization"
                            value={newDoctor.specialization}
                            onChange={(e) =>
                                setNewDoctor({ ...newDoctor, specialization: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Fees</label>
                        <input
                            type="text"
                            placeholder="Fees"
                            value={newDoctor.fees}
                            onChange={(e) => setNewDoctor({ ...newDoctor, fees: e.target.value })}
                        />
                    </div>
                    <button className="add-doctor-btn" onClick={editDoctor ? updateDoctor : addDoctor}>
                        {editDoctor ? "Update Doctor" : "Add Doctor"}
                    </button>
                </div>

                {/* Right Section for Displaying Doctors */}
                <div className="doctors-list">
                    <h3>Doctors List</h3>
                    {doctors.length > 0 ? (
                        <div className="doctor-cards">
                            {doctors.map((doctor) => (
                                <div key={doctor.id} className="doctor-card">
                                    <h4>{doctor.name}</h4>
                                    <p>Specialization: {doctor.specialization}</p>
                                    <p>Fees: ${doctor.fees}</p>
                                    <button onClick={() => editDoctorDetails(doctor)}>Edit</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No doctors found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;

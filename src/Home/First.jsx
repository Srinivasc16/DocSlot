import './first.css';
import Hosp from '../assets/hosp.png';
import Appp from '../assets/appointment.png';
import Reg from '../assets/regis.png';
import { useNavigate } from 'react-router-dom';

function First() {
    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="bodyf">
            <div className="containe">
                <div className="left">
                    <h2>Welcome<br/>to DocSlot<br/></h2>
                    <p>Where communication <br/> becomes feasible</p>
                </div>
                <div className="right">
                    <h4><img src={Hosp} alt="Hospital"/>We are here for you</h4>
                    <p><img src={Appp} alt="Appointment"/>Book an appointment:</p>
                    <button className="button" onClick={() => navigate('/book-appointment')}>
                        Book Now
                    </button>
                    <br/><br/><br/>
                    <p><img src={Reg} alt="Registration"/>Hospital registration:</p>
                    <button className="button" onClick={() => navigate('/join-us')}>
                        Join us
                    </button>
                </div>
            </div>
        </div>
    );
}

export default First;

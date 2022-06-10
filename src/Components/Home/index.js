import { auth, logout } from "../../Session/firebase"
import { Link, useNavigate } from 'react-router-dom'
import {getUserName} from '../../Tools/usertools'


function Home() {

    const navigate = useNavigate();
    const logoutAction = () => {
        logout();
        navigate("/login");

    }

    const x=()=>
    {
        return '/fdas'
    }


    return (<div>
        <p>Welcome on Techbricks - v.0.1</p>
        <p>{auth?.currentUser?.displayName}</p>
        <p>{auth?.currentUser?.email}</p>
        <p><button onClick={logoutAction}>logout</button></p>
        <Link to={getUserName()}>List</Link>
    </div>)
}

export default Home;
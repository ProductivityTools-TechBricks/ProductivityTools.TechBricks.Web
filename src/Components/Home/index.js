import { logout } from "../../Session/firebase"
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../Session/AuthContext'


function Home() {

    const navigate = useNavigate();
    const { user, userName, loading } = useAuth();

    const logoutAction = async () => {
        await logout();
        navigate("/login");

    }

    const x=()=>
    {
        return '/fdas'
    }

    if (loading) {
        return (<div><p>Welcome on Techbricks - v.0.7</p><p>Loading session...</p></div>)
    }

    if (!user) {
        return (<div>
            <p>Welcome on Techbricks - v.0.7</p>
            <Link to="/login">Login</Link>
        </div>)
    }

    return (<div>
        <p>Welcome on Techbricks - v.0.7</p>
        <p>{user.displayName}</p>
        <p>{user.email}</p>
        <p><button onClick={logoutAction}>logout</button></p>
        <Link to={`/${userName}`}>List</Link>
    </div>)
}

export default Home;

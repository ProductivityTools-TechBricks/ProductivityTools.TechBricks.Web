import {auth,logout} from "../../Session/firebase"
import {Link, useNavigate} from 'react-router-dom'


function Home(){

    const navigate=useNavigate();

    const logoutAction=()=>{
        logout();
        navigate("/login");
        
    }


    return(<div>
        <p>Welcome on Techbricks</p>
        <p>{auth?.currentUser?.displayName}</p>
        <p>{auth?.currentUser?.email}</p>
        <p><button onClick={logoutAction}>logout</button></p>
        <Link to="/bricks">List</Link>
    </div>)
}

export default Home;
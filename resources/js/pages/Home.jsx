import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '../components/Navbar';

const Home = () => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || !isAuthenticated) return null;

    return (
        <div className="">
            <Navbar></Navbar>
        </div>
    );
};

export default Home;

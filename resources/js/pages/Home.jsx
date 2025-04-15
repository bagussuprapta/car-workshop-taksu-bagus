import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-xl font-semibold">Welcome to Home Page!</h1>
        </div>
    );
};

export default Home;

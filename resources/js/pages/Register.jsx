import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/");
        }
    }, [loading, isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "/api/auth/register",
                { name, email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            login(response.data.token, response.data.user);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-2xs mx-auto">
            <h1 className="font-bold text-2xl text-center">
                Register to <span className="italic">Car Workshop</span>
            </h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full max-w-xs"
            >
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded mb-2 px-2 py-1 text-sm focus:outline-none focus:ring-[0.5px] focus:ring-stone-700 focus:border-stone-700"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded mb-2 px-2 py-1 text-sm focus:outline-none focus:ring-[0.5px] focus:ring-stone-700 focus:border-stone-700"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded mb-2 px-2 py-1 text-sm focus:outline-none focus:ring-[0.5px] focus:ring-stone-700 focus:border-stone-700"
                    required
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    className="bg-black text-white px-2 py-2 text-sm cursor-pointer rounded"
                >
                    Register
                </button>
                <p className="text-sm mt-2 text-center">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-stone-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;

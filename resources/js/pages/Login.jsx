import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Login failed");
            }

            const data = await res.json();
            login(data.token, data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen max-w-2xs mx-auto">
            <h1 className='font-bold text-2xl text-center'>Login to <span className='italic'>Car Workshop</span></h1>
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-xs">
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
                    Login
                </button>
                <p className="text-sm mt-2 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-stone-600 hover:underline">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

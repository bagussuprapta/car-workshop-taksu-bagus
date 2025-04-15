import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Diagram from "./pages/Diagram";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
import Register from './pages/Register';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/diagram/:type" element={<Diagram />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Check empty fields
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill all fields");
            return;
        }

        // Check password
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await apiFetch("/api/users/register", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Registration failed"
                );
            }

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            // Go to login page
            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f4f6f8"
            }}
        >
            <div
                style={{
                    width: "400px",
                    maxWidth: "90%",
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
            >
                {/* Heading */}
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "10px"
                    }}
                >
                    AI Dukaan Saathi
                </h2>

                <p
                    style={{
                        textAlign: "center",
                        color: "#666",
                        marginBottom: "25px"
                    }}
                >
                    Create your account
                </p>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            background: "#ffe5e5",
                            color: "#c62828",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "15px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div
                        style={{
                            background: "#e7f7ed",
                            color: "#218838",
                            padding: "10px",
                            borderRadius: "6px",
                            marginBottom: "15px"
                        }}
                    >
                        {success}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Confirm Password */}
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={inputStyle}
                    />

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            borderRadius: "6px",
                            background: loading ? "#999" : "#222",
                            color: "white",
                            fontSize: "16px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            marginTop: "5px"
                        }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* Login Link */}
                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        style={{
                            color: "#2563eb",
                            textDecoration: "none"
                        }}
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "15px"
};

export default Register;
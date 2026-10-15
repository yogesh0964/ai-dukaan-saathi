import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const loginUser = () => {

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        fetch("http://localhost:8080/api/users/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("Invalid email or password");
                }

                return response.json();

            })
            .then(data => {

                localStorage.setItem(
                    "token",
                    data.token
                );

                alert("Login successful");

                navigate("/");

            })
            .catch(error => {

                alert(error.message);

            });
    };

    return (

        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5"
        }}>

            <div style={{
                backgroundColor: "white",
                padding: "30px",
                width: "350px",
                borderRadius: "10px"
            }}>

                <h1>AI Dukaan Saathi</h1>

                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        boxSizing: "border-box"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        boxSizing: "border-box"
                    }}
                />

                <button
                    onClick={loginUser}
                    style={{
                        width: "100%",
                        padding: "12px",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>

                {/* Register Link */}
                <p style={{
                    textAlign: "center",
                    marginTop: "20px"
                }}>
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        style={{
                            color: "#2563eb",
                            textDecoration: "none",
                            fontWeight: "bold"
                        }}
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;
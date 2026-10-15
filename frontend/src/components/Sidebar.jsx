import { Link } from "react-router-dom";

function Sidebar() {

    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (

        <div style={{
            width: "220px",
            minHeight: "100vh",
            backgroundColor: "#222",
            padding: "20px",
            boxSizing: "border-box"
        }}>

            <h2 style={{
                color: "white",
                marginBottom: "30px"
            }}>
                AI Dukaan Saathi
            </h2>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}>

                <Link to="/" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Dashboard
                    </button>
                </Link>

                <Link to="/products" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Products
                    </button>
                </Link>

                <Link to="/inventory" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Inventory
                    </button>
                </Link>

                <Link to="/customers" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Customers
                    </button>
                </Link>

                <Link to="/billing" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Billing
                    </button>
                </Link>

                <Link to="/reports" style={{ textDecoration: "none" }}>
                    <button style={buttonStyle}>
                        Reports
                    </button>
                </Link>

                <button
                    onClick={logout}
                    style={{
                        ...buttonStyle,
                        marginTop: "20px"
                    }}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "left"
};

export default Sidebar;
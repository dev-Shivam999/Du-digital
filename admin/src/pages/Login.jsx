import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button, FormGroup, Input, LoadingSpinner } from "../components/UI";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
        console.error("Login failed", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        backgroundColor: "#f8f9fa" 
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}>
         <div className="text-center mb-4">
             <h2 className="text-primary mb-2">DU Digital</h2>
             <p className="text-muted">Sign in to Admin Panel</p>
         </div>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <FormGroup label="Email Address">
              <div className="d-flex align-items-center border rounded p-1">
                  <Mail size={18} className="text-muted mx-2"/>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{border: 'none', boxShadow: 'none'}}
                  />
              </div>
          </FormGroup>

          <FormGroup label="Password">
             <div className="d-flex align-items-center border rounded p-1">
                  <Lock size={18} className="text-muted mx-2"/>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{border: 'none', boxShadow: 'none'}}
                  />
              </div>
          </FormGroup>

          <Button type="submit" className="w-100 btn-primary mt-3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

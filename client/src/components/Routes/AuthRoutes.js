import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

export default function AuthRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  return user ? (
    children
  ) : (
    <div onClick={navigate("/signin", { state: location?.pathname })}></div>
  );
}

import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedUserRoute() {
    const location = useLocation();
    const user = localStorage.getItem("petCareUser");

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedUserRoute;
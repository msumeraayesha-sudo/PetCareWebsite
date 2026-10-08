import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
    const admin = localStorage.getItem("petCareAdmin");

    if (!admin) {
        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedAdminRoute;
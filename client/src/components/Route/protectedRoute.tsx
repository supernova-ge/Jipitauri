import { FC } from "react";
import { Navigate } from "react-router-dom";
import { useStoreState } from "easy-peasy";

interface ProtectedRouteProps {
  children: any;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const userStatus = useStoreState((state: any) => state.store.user);
  console.log(userStatus);
  if (!userStatus?.accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

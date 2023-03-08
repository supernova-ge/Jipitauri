import { gapi } from "gapi-script";
import { FC } from "react";
import { GoogleLogin } from "react-google-login";
import { useStoreActions } from "easy-peasy";
import { useNavigate } from "react-router-dom";

const clientId = "752019399960-kv19erb24bcjegpnjtmclbq895bc960n.apps.googleusercontent.com";

const Login = () => {
  const setUserStatus = useStoreActions((actions: any) => actions.setUser);
  const navigate = useNavigate();

  const onSuccess = (res: any) => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();
    setUserStatus({
      accessToken: res.accessToken,
      email: res.profileObj.email,
      name: res.profileObj.name,
      familyName: res.profileObj.familyName,
      givenName: res.profileObj.givenName,
    });
    navigate("/chat");
  };

  const onFailure = (res: any) => {
    console.log("Faild");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <GoogleLogin clientId={clientId} buttonText="Login" onSuccess={onSuccess} onFailure={onFailure} cookiePolicy={"single_host_origin"} isSignedIn={true} />
    </div>
  );
};

export default Login;

import { GoogleLogin } from "@react-oauth/google";

export const GoogleFacebookLogin = ({ googleRef, facebookRef }) => {
    return (
        <div>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
            {/* facebook */}
        </div>
    );
};

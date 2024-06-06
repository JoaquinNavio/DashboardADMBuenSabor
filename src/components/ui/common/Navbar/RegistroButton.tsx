import { useAuth0 } from "@auth0/auth0-react";

const RegistroButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          appState: {
            returnTo: "/cliente/perfil",
          },
          authorizationParams: {
            screen_hint: "signup",
          },
        })
      }
    >
      Sign up
    </button>
  );
};

export default RegistroButton;

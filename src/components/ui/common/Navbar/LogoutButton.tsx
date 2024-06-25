import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem('tipo_empleado');
    localStorage.removeItem('sucursal_id');
    localStorage.removeItem('selectedSucursalNombre');
    // Llamar a la función de logout
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;

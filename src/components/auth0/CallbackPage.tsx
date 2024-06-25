// src/components/auth0/CallbackPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const CallbackPage: React.FC = () => {
  const { handleRedirectCallback } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth0Callback = async () => {
      await handleRedirectCallback();
      navigate('/inicio'); // Redirige a la página deseada después del login
    };
    handleAuth0Callback();
  }, [handleRedirectCallback, navigate]);

  return <div>Loading...</div>;
};

export default CallbackPage;

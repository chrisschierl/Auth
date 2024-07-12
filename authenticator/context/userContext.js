import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {createContext, useEffect, useState, useContext} from 'react';
import toast from 'react-hot-toast';

const UserContext = React.createContext ();

export const UserContextProvider = ({children}) => {
  const serverUrl = 'http://localhost:8000';

  const router = useRouter ();

  const [user, setUser] = useState (null);
  const [userState, setUserState] = useState ({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState (true);

  // register user
  const registerUser = async e => {
    e.preventDefault ();
    if (
      !userState.email.includes ('@') ||
      !userState.password ||
      userState.password.length < 8
    ) {
      toast.error (
        'Gib den Benutzernamen und das Passwort ein! (min 8 Zeichen)'
      );
      return;
    }

    try {
      const res = await axios.post (`${serverUrl}/api/v1/register`, userState);
      toast.success ('Registrierung erfolgreich');

      // clear the form
      setUserState ({
        name: '',
        email: '',
        password: '',
      });

      // Umleitung zu Login
      router.push ('/login');
    } catch (error) {
      console.log ('Fehler beim Registrieren', error);
      toast.error (error.response.data.message);
    }
  };

  // login user
  const loginUser = async e => {
    e.preventDefault ();
    try {
      const res = await axios.post (
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true, // cookies sind aktiviert
        }
      );

      toast.success ('Login erfolgreich'); // Push Nachricht nach Login

      // clear the form
      setUserState ({
        email: '',
        password: '',
      });

      // push user ins dashboard
      router.push ('/dashboard');
    } catch (error) {
      console.log ('Fehler beim Login', error);
      toast.error (error.response.data.message);
    }
  };

  // get logged in users
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get (`${serverUrl}/api/v1/login-status`, {
        withCredentials: true, // ccokies zum server senden
      });

      // cors string zu boolean umwandeln
      loggedIn = !!res.data.user;
      setLoading (false);

      if (!loggedIn) {
        router.push ('/login');
      }
    } catch (error) {
    console.log("Fehler bei Statusabfrage", error);
    toast.error (error.response.data.message);
    }
  };

  // dynamiischer form handler
  const handlerUserInput = name => e => {
    const value = e.target.value;

    setUserState (prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext (UserContext);
};

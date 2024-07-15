import axios from 'axios';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState, useContext} from 'react';
import toast from 'react-hot-toast';

const UserContext = React.createContext ();

// axios credentials
axios.defaults.withCredentials = true;

export const UserContextProvider = ({children}) => {
  const serverUrl = 'http://localhost:8000';

  const router = useRouter ();

  const [user, setUser] = useState ({});
  const [allUsers, setAllUsers] = useState ([]);
  const [userState, setUserState] = useState ({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState (false);

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
      console.log ('Registrierung erfolgreich', res.data);
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

      // refresh user dteails
      await getUser (); // fetch user vor dem redirect

      // push user ins dashboard
      router.push ('/');
    } catch (error) {
      console.log ('Fehler beim Login', error);
      toast.error (error.response.data.message);
    }
  };

  // get logged in status
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get (`${serverUrl}/api/v1/login-status`, {
        withCredentials: true, // ccokies zum server senden
      });

      // cors string zu boolean umwandeln
      loggedIn = !!res.data;
      setLoading (false);

      if (!loggedIn) {
        router.push ('/login');
      }
    } catch (error) {
      console.log ('Fehler bei Statusabfrage', error);
    }

    return loggedIn;
  };

  // logout user
  const logoutUser = async () => {
    try {
      const res = await axios.get (`${serverUrl}/api/v1/logout`, {
        withCredentials: true, // send cookies to the server
      });

      toast.success ('Erfolgreich ausgeloggt!');

      // redirect to login page
      router.push ('/login');
    } catch (error) {
      console.log ('Error logging out user', error);
      toast.error (error.response.data.message);
    }
  };

  // get user details
  const getUser = async () => {
    try {
      const res = await axios.get (`${serverUrl}/api/v1/user`, {
        withCredentials: true, // send cookies zum server
      });

      setUser (prevState => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      setLoading (false);
    } catch (error) {
      console.log ('Error getting user', error);
      setLoading (false);
      toast.error (error.response.data.message);
    }
  };

  // update user details
  const updateUser = async (e, data) => {
    e.preventDefault ();
    setLoading (true);

    try {
      const res = await axios.patch (`${serverUrl}/api/v1/user`, data, {
        withCredentials: true, // send cookies zum server
      });

      // update user state
      setUser (prevState => {
        return {
          ...prevState,
          ...res.data,
        };
      });

      toast.success ('Bio erfolgreich aktualisiert!');

      setLoading (false);
    } catch (error) {
      console.log ('Fehler beim Updaten!', error);
      setLoading (false);
      toast.error (error.response.data.message);
    }
  };

  // email verification
  const emailVerification = async () => {
    setLoading (true);
    try {
      const res = await axios.post (
        `${serverUrl}/api/v1/verify-email`,
        {},
        {
          withCredentials: true, // send cookies zum server
        }
      );

      toast.success('Email zur Bestätigung gesendet!');
      setLoading (false);
    } catch (error) {
      console.log("Fehler beim Senden der Bestätigung", error);
      setLoading (false);
      toast.error(error.response.data.message);
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

  useEffect (() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus ();

      if (isLoggedIn) {
        await getUser ();
      }
    };

    loginStatusGetUser ();
  }, []);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        updateUser,
        emailVerification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext (UserContext);
};

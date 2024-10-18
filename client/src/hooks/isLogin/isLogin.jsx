// useLogin.js
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { handleRegisterSubmit } from '../../server/register/register';
import { fullNameRegex, phoneNumberRegex } from '../../utils/validFormte';
import { handleLoginSubmit, loginUserCheck } from '../../server/login/login';

const useLogin = () => {
  const [userLoginData, setUserLoginData] = useState({
    username: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    phoneNumber: '',
    fullName: '',
    userRole: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [spinner, setSpinner] = useState('invisible');
  const [ConfirmpasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loginStatusCheck, setLoginStatusCheck] = useState(false);

  const handleLoginChange = (e) => {
    const { value, name } = e.target;
    setUserLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setUserLoginData({
      ...userLoginData,
      userRole: e.target.value,
    });
  };

  const clearData = () => {
    setUserLoginData({
      username: '',
      userEmail: '',
      userPassword: '',
      confirmPassword: '',
      phoneNumber: '',
      fullName: '',
      userRole: '',
    });
    setConfirmPasswordVisible(false);
    setPasswordVisible(false);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!ConfirmpasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginStatusCheck) {
      if (!fullNameRegex.test(userLoginData.fullName)) {
        toast.error('Full Name must contain only alphabetic characters.');
        return;
      }

      if (!phoneNumberRegex.test(userLoginData.phoneNumber)) {
        toast.error('Phone Number must be exactly 10 digits.');
        return;
      }
      if (userLoginData.confirmPassword !== userLoginData.userPassword) {
        toast.error('Passwords do not match.');
        return;
      }
      await handleRegisterSubmit(
        e,
        userLoginData,
        setSpinner,
        clearData,
        setLoginStatusCheck
      );
    } else {
      await handleLoginSubmit(e, userLoginData, setSpinner, clearData);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const loginStatus = await loginUserCheck();
      if (loginStatus) window.location.href = '/dashboard';
    };
    fetchData();
  }, []);

  useEffect(() => {
    clearData();
  }, [loginStatusCheck]);

  return {
    userLoginData,
    passwordVisible,
    ConfirmpasswordVisible,
    spinner,
    loginStatusCheck,
    handleLoginChange,
    clearData,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    setLoginStatusCheck,
    handleRoleChange,
  };
};

export default useLogin;

import { REACT_APP_API_URL, axiosInstance } from '../../parameter/parameter';

import { ShowErrorMessage, ShowSuccessMessage } from '../../utils/logMessge';

// Function To Login
export const handleLoginSubmit = async (
  e,
  userLoginData,
  setSpinner,
  clearData
) => {
  e.preventDefault();
  setSpinner('block');
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/login`,
      userLoginData
    );
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.userInfo.userRole);
      localStorage.setItem('userId', response.data.userInfo.userId);
      ShowSuccessMessage(response.data.message);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    }
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    setSpinner('invisible');
    clearData();
  }
};

//Function To Login Check
export const loginUserCheck = async () => {
  try {
    const option = {
      method: 'get',
      url: `${REACT_APP_API_URL}/api/login/user_login`,
    };
    await axiosInstance(option);
    return true;
  } catch (error) {
    return false;
  }
};

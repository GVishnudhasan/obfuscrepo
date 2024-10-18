import { REACT_APP_API_URL, axiosInstance } from '../../parameter/parameter';

import { ShowErrorMessage, ShowSuccessMessage } from '../../utils/logMessge';

// Function To Register
export const handleRegisterSubmit = async (
  e,
  userLoginData,
  setSpinner,
  clearData,
  setLoginStatusCheck
) => {
  e.preventDefault();
  setSpinner('block');
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/register`,
      userLoginData
    );
    ShowSuccessMessage(response.data.message);
    setLoginStatusCheck(false);
  } catch (error) {
    ShowErrorMessage(error);
  } finally {
    setSpinner('invisible');
    clearData();
  }
};

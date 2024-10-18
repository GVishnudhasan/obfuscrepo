import { REACT_APP_API_URL, axiosInstance } from '../../parameter/parameter';
import {
  fullNameRegex,
  phoneNumberRegex,
  vehicleNumberPattern,
} from '../../utils/validFormte';
import {
  ShowErrorMessage,
  ShowSuccessMessage,
  ShowErrorTaskMessage,
} from '../../utils/logMessge';

export const fetchUserInfo = async (userId, setUserInfo) => {
  try {
    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/profile`,
      { userId }
    );
    setUserInfo(response.data.userInfo);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

export const handleProfileUpdatedSubmit = async (
  e,
  userId,
  userInfo,
  setIsModified
) => {
  e.preventDefault();

  if (!fullNameRegex.test(userInfo.fullName)) {
    ShowErrorTaskMessage('Full Name must contain only alphabetic characters.');
    return;
  }

  if (!phoneNumberRegex.test(userInfo.phoneNumber)) {
    ShowErrorTaskMessage('Phone Number must be exactly 10 digits.');
    return;
  }

  if (
    userInfo.userRole === 'driver' &&
    !vehicleNumberPattern.test(userInfo.vehicleNumber)
  ) {
    ShowErrorTaskMessage('Vehicle Number must be in a valid format.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('userId', userId);

    Object.keys(userInfo).forEach((key) => {
      if (key === 'image' && userInfo.image) {
        formData.append('file', userInfo.image.file);
      } else {
        formData.append(key, userInfo[key]);
      }
    });

    const response = await axiosInstance.post(
      `${REACT_APP_API_URL}/api/profile/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    setIsModified(false);
    ShowSuccessMessage(response.data.message);
  } catch (error) {
    ShowErrorMessage(error);
  }
};

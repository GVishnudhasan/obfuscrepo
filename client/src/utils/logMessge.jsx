import { toast } from 'react-toastify';

export const ShowErrorMessage = (error) => {
  if (error.status === 401) window.location.href = '/';
  else
    toast.error(error.response.data.message, {
      position: 'top-right',
    });
};
export const ShowSuccessMessage = (message) => {
  toast.success(message, {
    position: 'top-right',
  });
};

export const ShowErrorTaskMessage = (message) => {
  toast.error(message, {
    position: 'top-right',
  });
};

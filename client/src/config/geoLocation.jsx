export const getUserLocation = (setLocation) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location: ', error.message);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

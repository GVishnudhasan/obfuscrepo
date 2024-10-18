import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useLogin from '../../hooks/isLogin/isLogin';

const Login = () => {
  const {
    userLoginData,
    passwordVisible,
    ConfirmpasswordVisible,
    spinner,
    loginStatusCheck,
    handleLoginChange,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    handleSubmit,
    setLoginStatusCheck,
    handleRoleChange,
  } = useLogin();

  return (
    <div className="h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <img
              src="./assets/atlan_logo.png"
              className="w-mx-auto"
              alt="Platform logo"
            />
          </div>
          <div className="mt-2 flex flex-col items-center">
            <div className="w-full flex-1 mt-2">
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  {loginStatusCheck ? 'Register Here' : 'Sign In with your Credentials'}
                </div>
              </div>

              <div className="mx-auto max-w-xs">
                {loginStatusCheck && (
                  <input
                    name="username"
                    type="text"
                    value={userLoginData.username}
                    placeholder="Enter Username"
                    onChange={handleLoginChange}
                    required
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                )}
                {loginStatusCheck && (
                  <input
                    name="fullName"
                    type="text"
                    value={userLoginData.fullName}
                    placeholder="Enter Full Name"
                    onChange={handleLoginChange}
                    required
                    className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                )}
                <input
                  name="userEmail"
                  type="email"
                  value={userLoginData.userEmail}
                  placeholder="Enter Email"
                  onChange={handleLoginChange}
                  required
                  className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                />

                <div className="relative w-full mt-5">
                  <input
                    name="userPassword"
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter Password"
                    required
                    value={userLoginData.userPassword}
                    onChange={handleLoginChange}
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                  <span
                    className="material-icons absolute top-2 right-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? 'visibility' : 'visibility_off'}
                  </span>
                </div>

                {loginStatusCheck && (
                  <div className="relative w-full mt-5">
                    <input
                      name="confirmPassword"
                      type={ConfirmpasswordVisible ? 'text' : 'password'}
                      value={userLoginData.confirmPassword}
                      placeholder="Enter Confirm Password"
                      onChange={handleLoginChange}
                      required
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    />
                    <span
                      className="material-icons absolute top-2 right-2 cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {ConfirmpasswordVisible ? 'visibility' : 'visibility_off'}
                    </span>
                  </div>
                )}

                {loginStatusCheck && (
                  <select
                    name="userRole"
                    value={userLoginData.userRole}
                    onChange={handleRoleChange}
                    required
                    className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                  </select>
                )}

                {loginStatusCheck && (
                  <input
                    name="phoneNumber"
                    type="text"
                    value={userLoginData.phoneNumber}
                    placeholder="Enter 10 Digit Phone Number"
                    onChange={handleLoginChange}
                    required
                    className="w-full px-8 py-4 mt-5 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  />
                )}

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-cyan-300 text-white-500 w-full py-4 rounded-lg hover:bg-cyan-500 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  onClick={(e) => handleSubmit(e)}
                >
                  {spinner !== 'invisible' ? (
                    <div className="flex justify-center items-center">
                      <div className="spinner w-6 h-6 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <span>{loginStatusCheck ? 'Register Now' : 'Sign In'}</span>
                  )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                  {loginStatusCheck
                    ? 'Already have an account?'
                    : "Don't have an account?"}{' '}
                  <a
                    href="#"
                    className="text-cyan-600 hover:underline"
                    onClick={() => setLoginStatusCheck(!loginStatusCheck)}
                  >
                    {loginStatusCheck ? 'Sign in here' : 'Sign up here'}
                  </a>
                </p>

                
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-blue-700 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('./assets/image.png')",
            }}
          ></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

import axios from "axios";
import { Link } from "react-router";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import { login, setAuthError } from "../store/slices/authSlice";
import { loginSchema } from "../utils/validationSchema";
import { FormInput } from "../components";

const Login = () => {
  const dispatch = useDispatch();

  // Submitting Form
  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const token = response.data.data.accessToken;
      dispatch(
        login({
          error: null,
          user: response.data.data.user,
          token,
          tokenExpiration: response.data.tokenExpiration,
        })
      );
      localStorage.setItem("authToken", token);
      return token;
    } catch (error) {
      setSubmitting(false);
      if (error.response) {
        const apiError = error.response.data.message || "An error occurred";
        setErrors({ apiError });
        dispatch(setAuthError(apiError));
      } else if (error.request) {
        const apiError = "No response from server";
        setErrors({ apiError });
        dispatch(setAuthError(apiError));
      } else {
        const apiError = "An error occurred while making the request";
        setErrors({ apiError });
        dispatch(setAuthError(apiError));
      }
    }
  };

  // Formik
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  return (
    <>
      <div className="container mx-auto py-28">
        <form className="w-full md:w-2/5 mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-white font-mono text-3xl font-bold mb-10">
            Task App Login
          </h1>
          <FormInput
            label="Email"
            type="email"
            name="email"
            className="mb-3"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
          />
          <FormInput
            label="Password"
            type="password"
            name="password"
            className="mb-3"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
          />

          {errors.apiError && (
            <span className="block text-sm text-red-500 mb-4">
              {errors.apiError}
            </span>
          )}

          <button
            type="submit"
            className="px-7 py-3 bg-blue-500 text-gray-950 text-lg font-semibold rounded cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting" : "Login"}
          </button>

          <p className="mt-5 mb-5">
            Not a member?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;

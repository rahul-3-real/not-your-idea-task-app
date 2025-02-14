import axios from "axios";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import { taskSchema } from "../utils/validationSchema";
import { showAlert } from "../store/slices/alertSlice";
import { FormInput, FormTextarea, FormSelect } from "../components";

const CreateTask = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // Submit Form
  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(
        showAlert({
          message: response.data.message || "Task created successfully!!",
          type: "success",
        })
      );

      navigate("/", { replace: true });
    } catch (error) {
      setSubmitting(false);
      if (error.response) {
        const apiError = error.response.data.message || "An error occurred";
        setErrors({ apiError });
        dispatch(
          showAlert({
            message: apiError,
            type: "error",
          })
        );
      } else if (error.request) {
        const apiError = "No response from server";
        setErrors({ apiError });
        dispatch(
          showAlert({
            message: apiError,
            type: "error",
          })
        );
      } else {
        const apiError = "An error occurred while making the request";
        setErrors({ apiError });
        dispatch(
          showAlert({
            message: apiError,
            type: "error",
          })
        );
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
      title: "",
      description: "",
      status: "",
      priority: "",
      dueDate: "",
    },
    validationSchema: taskSchema,
    onSubmit,
  });

  return (
    <>
      <section className="py-10">
        <div className="container mx-auto">
          <div className="w-8/12 mx-auto">
            <h1 className="text-3xl font-bold font-mono text-white mb-7">
              Create Task
            </h1>

            <form className="grid grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div className="col-span-2">
                <FormInput
                  label="Title"
                  type="title"
                  name="title"
                  placeholder="Task title"
                  value={values.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.title && errors.title}
                />
              </div>
              <div className="col-span-2">
                <FormTextarea
                  label="Description"
                  name="description"
                  placeholder="Task description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && errors.description}
                />
              </div>
              <div className="col-span-1">
                <FormSelect
                  label="Status"
                  name="status"
                  options={[
                    { label: "---", value: "" },
                    { label: "To Do", value: "To Do" },
                    { label: "In Progress", value: "In Progress" },
                    { label: "Done", value: "Done" },
                  ]}
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.status && errors.status}
                />
              </div>
              <div className="col-span-1">
                <FormSelect
                  label="Priority"
                  name="priority"
                  options={[
                    { label: "---", value: "" },
                    { label: "Low", value: "Low" },
                    { label: "Medium", value: "Medium" },
                    { label: "High", value: "High" },
                  ]}
                  value={values.priority}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.priority && errors.priority}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  placeholder="Select due date"
                  value={values.dueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.dueDate && errors.dueDate}
                />
              </div>
              <div className="col-span-2">
                {errors.apiError && (
                  <span className="block text-sm text-red-500 mb-4">
                    {errors.apiError}
                  </span>
                )}

                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-300 text-gray-950 rounded cursor-pointer"
                >
                  {isSubmitting ? "Creating Task..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateTask;

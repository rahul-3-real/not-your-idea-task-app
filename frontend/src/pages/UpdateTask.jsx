import axios from "axios";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { taskSchema } from "../utils/validationSchema";
import { showAlert } from "../store/slices/alertSlice";
import { FormInput, FormTextarea, FormSelect } from "../components";

const UpdateTask = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { id } = useParams();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Task Data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setTask(response.data.data);
      } catch (error) {
        dispatch(
          showAlert({
            message: error.response?.data?.message || "Error fetching task!",
            type: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, dispatch]);

  // Formik
  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "",
      priority: task?.priority || "",
      dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
    },
    enableReinitialize: true, // Ensure values update when task is fetched
    validationSchema: taskSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`,
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
            message: response.data.message || "Task updated successfully!",
            type: "success",
          })
        );

        navigate("/", { replace: true });
      } catch (error) {
        setSubmitting(false);
        const apiError = error.response?.data?.message || "An error occurred";
        setErrors({ apiError });

        dispatch(
          showAlert({
            message: apiError,
            type: "error",
          })
        );
      }
    },
  });

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <>
      <hr className="my-10" />
      <section>
        <div className="container mx-auto">
          <div className="w-8/12 mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-mono text-white mb-7">
                Update Task
              </h1>
              <Link to={`/${task._id}`} className="text-white">
                Go Backs
              </Link>
            </div>

            <form
              className="grid grid-cols-2 gap-5"
              onSubmit={formik.handleSubmit}
            >
              <div className="col-span-2">
                <FormInput
                  label="Title"
                  type="text"
                  name="title"
                  placeholder="Task title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title}
                />
              </div>
              <div className="col-span-2">
                <FormTextarea
                  label="Description"
                  name="description"
                  placeholder="Task description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.description && formik.errors.description
                  }
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
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && formik.errors.status}
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
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.priority && formik.errors.priority}
                />
              </div>
              <div className="col-span-1">
                <FormInput
                  label="Due Date"
                  type="date"
                  name="dueDate"
                  placeholder="Select due date"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dueDate && formik.errors.dueDate}
                />
              </div>
              <div className="col-span-2">
                {formik.errors.apiError && (
                  <span className="block text-sm text-red-500 mb-4">
                    {formik.errors.apiError}
                  </span>
                )}

                <button
                  type="submit"
                  className="px-5 py-3 bg-amber-300 text-gray-950 rounded cursor-pointer"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Updating Task..." : "Update Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpdateTask;

import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { showAlert } from "../store/slices/alertSlice";

const DeleteTask = () => {
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

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tasks/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      dispatch(
        showAlert({
          message: "Task deleted successfully!",
          type: "success",
        })
      );

      navigate("/");
    } catch (error) {
      dispatch(
        showAlert({
          message: error.response?.data?.message || "Error deleting task!",
          type: "error",
        })
      );
    }
  };

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <>
      <hr className="my-10" />
      <section>
        <div className="container mx-auto">
          <div className="w-8/12 mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold font-mono text-white mb-7">
                Delete Task
              </h1>
              <Link to={`/${task._id}`} className="text-white">
                Go Backs
              </Link>
            </div>

            <p className="mb-5">
              Are you sure you want to delete the task "
              <b className="text-amber-300">{task.title}</b>"? This action
              cannot be undone.
            </p>

            <div className="flex gap-7 items-center mt-7">
              <button
                onClick={handleDeleteTask}
                className="text-white px-5 py-3 rounded-full bg-red-500 cursor-pointer"
              >
                Delete
              </button>
              <Link to={`/${task._id}`} className="text-white">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DeleteTask;

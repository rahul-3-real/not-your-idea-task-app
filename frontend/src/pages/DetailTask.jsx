import axios from "axios";
import { Link, Outlet, useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { showAlert } from "../store/slices/alertSlice";

const DetailTask = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format Data
  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Status Color
  const statusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-yellow-400";
      case "In Progress":
        return "bg-blue-500";
      case "Done":
        return "bg-green-400";
      default:
        return "bg-gray-500";
    }
  };

  // Priority Colors
  const priorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "High":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
        setLoading(false);
      } catch (error) {
        setError(error.message);
        dispatch(
          showAlert({
            message: error.message || "Error fetching task!",
            type: "error",
          })
        );
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, dispatch]);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <section className="py-10">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold font-mono text-white mb-3">
            {task.title}
          </h1>
          <p className="mb-5">{task.description}</p>

          <hr className="my-7" />

          <div className="flex justify-between gap-7">
            <div className="flex gap-7">
              <div>
                <p className="mb-2 text-lg text-white">Status</p>
                <div className="bg-gray-700 px-5 py-3 rounded">
                  <i
                    className={`inline-block mr-3 w-3 h-3 rounded-full ${statusColor(
                      task.status
                    )}`}
                  ></i>
                  <span>{task.status}</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-lg text-white">Priority</p>
                <div className="bg-gray-700 px-5 py-3 rounded">
                  <i
                    className={`inline-block mr-3 w-3 h-3 rounded-full ${priorityColor(
                      task.priority
                    )}`}
                  ></i>
                  <span>{task.priority}</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-lg text-white">Due Date</p>
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            <div className="flex gap-7 items-center justify-end">
              <div>
                <Link to={`/${task._id}/update`} className="text-white">
                  Edit
                </Link>
              </div>

              <div>
                <Link
                  to={`/${task._id}/delete`}
                  className="text-white px-5 py-3 rounded-full bg-red-500 cursor-pointer"
                >
                  Delete
                </Link>
              </div>
            </div>
          </div>

          <Outlet></Outlet>
        </div>
      </section>
    </>
  );
};

export default DetailTask;

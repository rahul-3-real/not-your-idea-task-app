import { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";

import { socket } from "../utils/socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for Task Created Event
    socket.on("task_created", (task) => {
      setNotifications((prev) => [
        { id: task._id, message: `📌 New Task Created: ${task.title}` },
        ...prev,
      ]);
    });

    // Listen for Task Updated Event
    socket.on("task_updated", (task) => {
      setNotifications((prev) => [
        { id: task._id, message: `✏️ Task Updated: ${task.title}` },
        ...prev,
      ]);
    });

    // Listen for Task Deleted Event
    socket.on("task_deleted", ({ taskId }) => {
      setNotifications((prev) => [
        { id: taskId, message: `🗑️ Task Deleted` },
        ...prev,
      ]);
    });

    console.log(notifications);

    return () => {
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, []);

  return (
    <div className="relative">
      <button className="cursor-pointer text-xl text-white">
        <BiBell />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-3 w-64 bg-white text-black shadow-lg rounded-lg overflow-hidden">
          <ul>
            {notifications.map((notif, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm border-b border-gray-200"
              >
                {notif.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

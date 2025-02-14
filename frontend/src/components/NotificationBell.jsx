import { useEffect, useState } from "react";
import { BiBell } from "react-icons/bi";

import { socket } from "../utils/socket";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleTaskCreated = (task) => {
      setNotifications((prev) => {
        const newNotif = {
          id: task._id,
          message: `New Task Created: ${task.title}`,
        };
        return [newNotif, ...prev];
      });
    };

    const handleTaskUpdated = (task) => {
      setNotifications((prev) => {
        const newNotif = {
          id: task._id,
          message: `Task Updated: ${task.title}`,
        };
        return [newNotif, ...prev];
      });
    };

    const handleTaskDeleted = ({ taskId }) => {
      setNotifications((prev) => {
        const newNotif = { id: taskId, message: `Task Deleted` };
        return [newNotif, ...prev];
      });
    };

    socket.on("task_created", handleTaskCreated);
    socket.on("task_updated", handleTaskUpdated);
    socket.on("task_deleted", handleTaskDeleted);

    return () => {
      socket.off("task_created", handleTaskCreated);
      socket.off("task_updated", handleTaskUpdated);
      socket.off("task_deleted", handleTaskDeleted);
    };
  }, []);

  useEffect(() => {
    console.log("🔔 Notifications Updated:", notifications);
  }, [notifications]);

  return (
    <div className="relative">
      <button className="cursor-pointer text-xl text-white relative">
        <BiBell />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-3 w-64 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50">
          <ul>
            {notifications.map((notif) => (
              <li
                key={notif.id}
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

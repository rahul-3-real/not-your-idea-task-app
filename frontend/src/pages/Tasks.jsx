import axios from "axios";
import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { IoMdEye } from "react-icons/io";
import { Link } from "react-router";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { Droppable, Draggable } from "../components";

const Tasks = () => {
  const [columns, setColumns] = useState({
    "To Do": [],
    "In Progress": [],
    Done: [],
  });

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

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/all`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data = response.data.data;

        const groupedTasks = {
          "To Do": data.filter((task) => task.status === "To Do"),
          "In Progress": data.filter((task) => task.status === "In Progress"),
          Done: data.filter((task) => task.status === "Done"),
        };
        setColumns(groupedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  // Handle Drag End
  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceId = active.data.current.status;
    const destinationId = over.id;

    const sourceIndex = active.data.current.index;
    const destinationIndex = over.data.current?.index ?? sourceIndex;

    if (!destinationId) return;

    if (sourceId === destinationId) {
      const reorderedTasks = arrayMove(
        columns[sourceId],
        sourceIndex,
        destinationIndex
      );

      setColumns({ ...columns, [sourceId]: reorderedTasks });

      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/${active.id}`,
          {
            newStatus: destinationId,
            newPosition: destinationIndex + 1,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      const sourceTasks = [...columns[sourceId]];
      const destTasks = [...columns[destinationId]];

      const movedTask = sourceTasks.splice(sourceIndex, 1)[0];
      movedTask.status = destinationId;
      destTasks.splice(destinationIndex, 0, movedTask);

      setColumns({
        ...columns,
        [sourceId]: sourceTasks,
        [destinationId]: destTasks,
      });

      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/${movedTask._id}`,
          {
            newStatus: destinationId,
            newPosition: destinationIndex + 1,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  return (
    <div className="relative py-10">
      <div className="container mx-auto">
        <h1 className="font-mono text-2xl font-bold mb-7">Kanban Board</h1>
        <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-7">
            {Object.entries(columns).map(([columnId, tasks]) => (
              <Droppable key={columnId} id={columnId}>
                <h2 className="text-xl font-mono font-bold mb-7">{columnId}</h2>
                <SortableContext
                  items={tasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.map((task, index) => (
                    <div key={task._id} className="relative">
                      <Link
                        to={`/${task._id}`}
                        className="cursor-pointer absolute top-0 right-0 w-6 h-6 z-10 flex items-center justify-center bg-amber-300 text-black"
                      >
                        <IoMdEye />
                      </Link>
                      <Draggable id={task._id} data={{ ...task, index }}>
                        <div className="p-5 bg-gray-800 mb-5 cursor-grab relative">
                          <h6 className="text-lg font-semibold">
                            {task.title}
                          </h6>
                          <small className="block mb-2">
                            {task.description}
                          </small>
                          <p className="mb-4">
                            <i
                              className={`inline-block mr-3 w-3 h-3 rounded-full ${priorityColor(
                                task.priority
                              )}`}
                            ></i>
                            <span>{task.priority} Priority</span>
                          </p>
                          <b>Due Date: {formatDate(task.dueDate)}</b>
                        </div>
                      </Draggable>
                    </div>
                  ))}
                </SortableContext>
              </Droppable>
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Tasks;

import { useEffect, useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Droppable, Draggable } from "../components";
import axios from "axios";

const Tasks = () => {
  const [columns, setColumns] = useState({
    "To Do": [],
    "In Progress": [],
    Done: [],
  });

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

        console.log(data);

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
    const destinationId = over.data.current.status;

    if (sourceId === destinationId) {
      // Reordering within the same column
      const reorderedTasks = arrayMove(
        columns[sourceId],
        active.data.current.index,
        over.data.current.index
      );

      setColumns({ ...columns, [sourceId]: reorderedTasks });
    } else {
      // Moving to a different column
      const sourceTasks = [...columns[sourceId]];
      const destTasks = [...columns[destinationId]];

      const movedTask = sourceTasks.splice(active.data.current.index, 1)[0];
      movedTask.status = destinationId;
      destTasks.splice(over.data.current.index, 0, movedTask);

      setColumns({
        ...columns,
        [sourceId]: sourceTasks,
        [destinationId]: destTasks,
      });

      // API call to update task status in the database
      try {
        await axios.put(`/api/tasks/${movedTask._id}`, {
          status: destinationId,
        });
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
                <h2>{columnId}</h2>
                <SortableContext
                  items={tasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      id={task._id}
                      data={{ ...task, index }}
                    >
                      <div className="task">
                        <p>{task.title}</p>
                        <small>{task.description}</small>
                      </div>
                    </Draggable>
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

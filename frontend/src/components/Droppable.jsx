import { useDroppable } from "@dnd-kit/core";

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-black border border-solid border-gray-500 p-5 rounded h-full"
    >
      {children}
    </div>
  );
};

export default Droppable;

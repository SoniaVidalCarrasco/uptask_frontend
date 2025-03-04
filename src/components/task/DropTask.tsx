import { useDroppable } from "@dnd-kit/core";

type DropTaskProps = {
  status: string;
};

export default function DropTask({ status }: DropTaskProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  const style = {
    opacity: isOver ? 1 : 0.7,
    transform: isOver ? "scale(1.05)" : "scale(1)",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
    >
      Soltar tarea aquí
    </div>
  );
}

import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify/unstyled";

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();

  const params = useParams();
  const projectId = params.projectId!;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast(`✅ ${data}`);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

  if (isLoading) return "Cargando...";
  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {`"${note.content}"`} por:{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>
      {canDelete && (
        <button
          type="button"
          className="bg-rose-400 hover:bg-rose-600 p-2 text.xs text-white font-bold cursor-pinter hover:scale-105 rounded-lg"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

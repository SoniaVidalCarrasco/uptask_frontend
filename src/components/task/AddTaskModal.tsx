import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { TaskFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskApi";
import { toast } from "react-toastify/unstyled";

export default function AddTaskModal() {
  //leer si modal existe
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("newTask");
  const show = modalTask ? true : false;

  //obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValue: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValue });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast(`✅ ${data}`);
      reset();
      navigate(location.pathname, { replace: true });
    },
  });

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId,
    };
    mutate(data);
  };
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => navigate(location.pathname, { replace: true })}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <DialogTitle as="h3" className="font-black text-4xl  my-5">
                    Nueva Tarea
                  </DialogTitle>

                  <p className="text-xl font-bold">
                    Llena el formulario y {""}
                    <span className="text-cyan-500">crea una tarea</span>
                  </p>
                  <form
                    className="mt-10 space-y-3"
                    noValidate
                    onSubmit={handleSubmit(handleCreateTask)}
                  >
                    <TaskForm register={register} errors={errors} />
                    <input
                      type="submit"
                      value="Guardar Tarea"
                      className="bg-cyan-600 hover:bg-gray-900  w-full rounded-lg p-3 text-white uppercase font-bold cursor-pointer transition-colors"
                    />
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

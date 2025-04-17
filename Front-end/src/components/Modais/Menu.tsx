import { useThema } from "../../context/ThemeContext";
import { useTask } from "../../context/taskContext";

interface TaskData {
    id: string,
    title: string,
    description: string,
    status: string,
    dt_limit: string
}

interface stateProps {
    openMenu: boolean;
    setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: (id: string) => void;
    task: TaskData;
}

function Menu({ openMenu, setOpenMenu, task, handleDelete }: stateProps) {

    const { thema } = useThema();
    const { setSaveTaskEdit, setIsOpenEdit } = useTask();

    function openSaveEdit(task: TaskData) {
        setSaveTaskEdit(task);
        setIsOpenEdit(true);
        setOpenMenu(false);
    }

    return (
        <>
            {
                openMenu &&
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setOpenMenu(false)}
                ></div>
            }

            <div className={`${thema == 'dark' ? 'bg-gray-800 text-white' : 'bg-zinc-50 border-zinc-300'} 
            absolute z-40 flex flex-col gap-4 right-7 -top-5 bg-zinc-70 px-4 py-2 border-1 rounded-lg w-30  shadow-lg `}>

                <p className="flex items-center gap-2 hover:bg-blue-600/60 duration-200 p-2 rounded-lg cursor-pointer"
                    onClick={() => openSaveEdit(task)}
                >
                    <i className="fa-solid fa-pen"></i>
                    Editar
                </p>
                <p className="flex items-center gap-2 hover:bg-red-600/60 duration-200 p-2 rounded-lg cursor-pointer"
                    onClick={() => {
                        handleDelete(task.id)
                    }}
                >
                    <i className="fa-solid fa-trash-can"></i>
                    Excluir
                </p>
            </div>
        </>
    )
}
export default Menu
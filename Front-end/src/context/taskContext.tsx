import { createContext, ReactNode, SetStateAction, useContext, useState, } from "react";
import api from "../services/api";

type TaskStatus = "pendente" | "progresso" | "concluída";

interface taskType{
    id: string,
    title: string,
    description: string,
    status: string,
    dt_limit: string
}

interface TaskData {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    dt_limit: string;
    user_id: number;
}

interface TaskProps {
    tasks: TaskData[];
    setTasks:  React.Dispatch<SetStateAction<TaskData[]>>;
    fetch: boolean;
    setFetch: React.Dispatch<SetStateAction<boolean>>;
    getTask: () => void;
    loader: boolean;
    setLoader: React.Dispatch<SetStateAction<boolean>>;
    saveTaskEdit: taskType | null
    setSaveTaskEdit: React.Dispatch<SetStateAction<taskType | null>>;
    isOpenEdit: boolean
    setIsOpenEdit: React.Dispatch<SetStateAction<boolean>>;
    idTask: string; 
    setIdTask: React.Dispatch<SetStateAction<string>>;
}

const TaskContext = createContext({} as TaskProps);

export function TaskProvider({ children }: { children: ReactNode }) {

    const [tasks, setTasks] = useState<TaskData[]>([]);
    const [fetch, setFetch] = useState(false);
    const [loader, setLoader] = useState(true);
    const [saveTaskEdit, setSaveTaskEdit] = useState<taskType | null>(null);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [idTask, setIdTask] = useState('');

    async function getTask() {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        const resp = await api.get(`/tasks/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setTasks(resp.data);
        setLoader(false);
    }

    return (
        <TaskContext.Provider
            value={{
                fetch, setFetch,
                tasks, setTasks,
                getTask, 
                loader, setLoader,
                saveTaskEdit, setSaveTaskEdit,
                isOpenEdit, setIsOpenEdit,
                idTask, setIdTask
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export function useTask() {
    return useContext(TaskContext)
}
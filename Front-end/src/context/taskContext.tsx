import React, { createContext, ReactNode, SetStateAction, useContext, useReducer, useState } from "react";
import api from "../services/api";

type TaskStatus = "pendente" | "progresso" | "concluida";

interface TaskData {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string;
    dt_limit: string;
    user_id: number;
}

interface TaskType {
    id: string,
    title: string,
    description: string,
    status: string,
    dt_limit: string
}

type ActionType =
    | { type: 'setTask'; payload: TaskData[] }
    | { type: 'setFetch'; payload: boolean }
    | { type: 'setLoader'; payload: boolean }
    | { type: 'setEditTask'; payload: TaskType }
    | { type: 'setUpdatedTask'; payload: TaskType | undefined }
    | { type: 'setSearchFilter'; payload: string }
    | { type: 'setStatusFilter'; payload: string }
    | { type: 'setOrderFilter'; payload: string }

type StateType = {
    tasks: TaskData[];
    fetch: boolean;
    loader: boolean;
    editTask: TaskType | null;
    updatedTask: TaskType | null | undefined;
    searchFilter: string;
    statusFilter: string;
    orderFilter: string;
}

interface TaskProps extends StateType {
    dispath: React.Dispatch<ActionType>;
    editTaskIsOpen: boolean
    setEditTaskIsOpen: React.Dispatch<SetStateAction<boolean>>;
    fetching: (params?: { title?: string; status?: string; order?: string }) => Promise<void>;
}

const initialState = {
    tasks: [],
    fetch: false,
    loader: true,
    editTask: null,
    updatedTask: null,
    searchFilter: '',
    statusFilter: 'todas',
    orderFilter: 'recentes'
}

const TaskContext = createContext({} as TaskProps);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispath] = useReducer(taskReducer, initialState);
    const [editTaskIsOpen, setEditTaskIsOpen] = useState(false);

    async function fetching(params: { title?: string; status?: string; order?: string } = {}) {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const title = params.title ?? state.searchFilter;
        const status = params.status ?? state.statusFilter;
        const order = params.order ?? state.orderFilter;

        const queryParams: any = {};
        if (title) queryParams.title = title.toLowerCase();
        if (status && status !== 'todas') queryParams.status = status;
        if (order && order !== 'recentes') queryParams.order = order;

        const resp = await api.get(`/tasks/user/${userId}/filter`, {
            params: queryParams,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        dispath({ type: 'setTask', payload: resp.data });
        dispath({type: 'setLoader', payload: false})
    }

    return (
        <TaskContext.Provider
            value={{
                ...state, dispath,
                editTaskIsOpen, setEditTaskIsOpen,
                fetching
            }}
        >
            {children}
        </TaskContext.Provider>
    )
}

export function useTask() {
    return useContext(TaskContext)
}

function taskReducer(state: StateType, action: ActionType) {
    switch (action.type) {
        case 'setTask':
            return { ...state, tasks: action.payload };
        case 'setEditTask':
            return { ...state, editTask: action.payload };
        case 'setUpdatedTask':
            return { ...state, updatedTask: action.payload };
        case 'setLoader':
            return { ...state, loader: action.payload };
        case 'setFetch':
            return { ...state, fetch: action.payload };
        case 'setSearchFilter':
            return { ...state, searchFilter: action.payload };
        case 'setStatusFilter':
            return { ...state, statusFilter: action.payload };
        case 'setOrderFilter':
            return { ...state, orderFilter: action.payload };
        default:
            throw new Error('Ação não encontrada');
    }
}
import FilterTask from '../components/FilterTask'
import TodoList from '../components/TodoList'
import AddTask from '../components/Modais/AddTask'
import Header from '../components/Header'
import EditTask from '../components/Modais/EditTask'
import { useState } from 'react'
import { useThema } from '../context/ThemeContext'
import { useTask } from '../context/taskContext'
import { ToastContainer } from 'react-toastify'

function Home() {

    const [isOpen, setIsOpen] = useState(false);
    const { thema } = useThema();
    const { isOpenEdit } = useTask()

    return (
        <div className={`w-full flex flex-col items-center justify-center 
        ${thema === 'dark' ? 'bg-gray-950' : 'bg-white'} transition-all duration-200`}>
            <Header isOpen={isOpen} setIsOpen={setIsOpen} />
            <ToastContainer containerId={'logout'} />
            <main className='w-full min-h-[90vh] flex flex-col'>
                <FilterTask />
                <AddTask isOpen={isOpen} setIsOpen={setIsOpen} />
                {isOpenEdit && <EditTask />}
                <TodoList />

                <ToastContainer containerId={'edit'} />
                <ToastContainer containerId={'addTask'}/>
                <ToastContainer containerId={'desfazer'} />
            </main>
        </div>
    )
}

export default Home
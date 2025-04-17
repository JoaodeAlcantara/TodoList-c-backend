import './style.css'
import { ThemaProvider } from './context/ThemeContext';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { TaskProvider } from './context/taskContext';

function App() {

  return (
    <TaskProvider>
      <ThemaProvider>
        <RouterProvider router={router} />
      </ThemaProvider>
    </TaskProvider>
  )
}

export default App

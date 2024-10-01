/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { AiOutlineEdit } from 'react-icons/ai';
import { TbTrashX } from 'react-icons/tb';

import { useGetAllTasksQuery } from '../../hooks/tasksHooks';
import Loading from '../shared/Loading';
import { Task } from '../../types/task';
// import DeleteTaskModal from './DeleteTaskModal';
// import TaskFormModal from './TaskFormModal';
import { useGetAllEmployeesQuery } from '../../hooks/employeeHooks';
import { Employee } from '../../types/employee';
import TaskFormModal from './TaskFormModal';
import DeleteTaskModal from './DeleteTask';

interface TaskListProps {
  searchText: string;
}

const TaskList: React.FC<TaskListProps> = ({ searchText }) => {
  const { data, isLoading, error } = useGetAllTasksQuery();
  const { data: employeeData, error: empError, isLoading: empIsLoading } = useGetAllEmployeesQuery();

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<Task>();

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };


  if (isLoading) {
    return <Loading />;
  }
  if (empIsLoading) {
    return <Loading />;
  }
  if (empError) {
    toast.error('Something went wrong');
  }

  if (error) {
    toast.error('Something went wrong');
  }

  return (
    <div className='mt-8'>
      <table className='w-full table-auto border-collapse border border-slate-700'>
        <thead>
          <tr>
            <th className='border border-slate-600 p-3 bg-slate-700'>Title</th>
            <th className='border border-slate-600 p-3 bg-slate-700'>Description</th>
            <th className='border border-slate-600 p-3 bg-slate-700'>
              Assigned To
            </th>
            <th className='border border-slate-600 p-3 bg-slate-700'>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {/* {!data && <tr>No data</tr>} */}
          {data
            .filter((task: Task) =>
              task.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((task: Task) => (
              <tr key={task.id}>
                <td className='border border-slate-700 p-3'>{task.title}</td>
                <td className='border border-slate-700 p-3'>
                  {task.description}
                </td>
                <td className='border border-slate-700 p-3'>
                  {/* {task.assigned_to} */}
                  {employeeData?.find((employee: Employee) => employee.id === task.assigned_to)?.name}
                </td>
                <td className='border border-slate-700 border-b-0 p-3 flex justify-center'>
                  {task.is_completed ? (
                    <div className='w-fit h-fit px-3 py-1 bg-teal-300 text-gray-700 text-sm font-medium rounded-full flex justify-center items-center border-b-0'>
                      Completed
                    </div>
                  ) : (
                    <div className='w-fit h-fit px-3 py-1 bg-red-400 text-gray-700 text-sm font-medium rounded-full flex justify-center items-center'>
                      In-Progress
                    </div>
                  )}
                </td>
                <td className='border border-slate-700 p-3'>
                  <div className='flex justify-center gap-2'>
                    <div
                      onClick={() => {
                        setSelectedTask(task);
                        setIsFormOpen(true);
                      }}
                      className='bg-teal-300 rounded-full w-8 h-8 flex justify-center items-center cursor-pointer'
                    >
                      <AiOutlineEdit className='text-gray-700 font-bold text-center text-xl' />
                    </div>
                    <div
                      onClick={() => {
                        setSelectedTask(task);
                        setIsDeleteOpen(true);
                      }}
                      className='bg-red-400 rounded-full w-8 h-8 flex justify-center items-center cursor-pointer'
                    >
                      <TbTrashX className='text-gray-700 font-bold text-center text-xl' />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

       <TaskFormModal
        task={selectedTask}
        isOpen={isFormOpen}
        handleClose={handleFormClose}
      />
      <DeleteTaskModal
        task={selectedTask}
        isOpen={isDeleteOpen}
        handleClose={handleDeleteClose}
      /> 
    </div>
  );
};

export default TaskList;

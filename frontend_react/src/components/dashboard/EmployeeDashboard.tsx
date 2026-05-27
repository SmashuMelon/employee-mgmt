import { useMemo } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '../../context/AuthContext';
import { useGetAllDepartmentsQuery } from '../../hooks/departmentHooks';
import { useGetAllTasksQuery } from '../../hooks/tasksHooks';
import Loading from '../shared/Loading';
import { Task } from '../../types/task';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useGetAllTasksQuery();
  const { data: departments, isLoading: departmentsLoading } = useGetAllDepartmentsQuery();

  const departmentName = useMemo(
    () => departments?.find((department) => department.id === user?.department)?.name,
    [departments, user]
  );

  const assignedTasks = useMemo(
    () => tasks?.filter((task: Task) => task.assigned_to === user?.id) ?? [],
    [tasks, user]
  );

  if (tasksLoading || departmentsLoading) {
    return <Loading />;
  }

  return (
    <div className='min-h-screen w-full p-5'>
      <div className='mb-6 flex flex-col gap-4 rounded-xl border border-[#7fdcd1] bg-[#94e2d5] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-semibold tracking-tight text-[#032727] uppercase'>TASK VIEW</h1>
          <p className='mt-2 text-sm text-[#0f4640]'>Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={logout}
          className='inline-flex items-center justify-center rounded-full border border-[#74d7c9] bg-[#0f4f48] px-5 py-3 text-sm font-semibold text-[#f3e6d8] shadow-sm transition hover:bg-[#18655d]'
        >
          Logout
        </button>
      </div>

      <div className='flex gap-3 h-full w-full min-h-screen p-5 flex-wrap'>
        <section className='border border-gray-200 p-3 rounded-lg flex-1'>
          <h2 className='text-3xl text-center mt-5 mb-8'>Profile</h2>
          <div className='space-y-3 text-slate-100'>
            <p>
              <strong className='text-slate-100'>Name:</strong>{' '}
              <span className='text-slate-100'>{user?.name}</span>
            </p>
            <p>
              <strong className='text-slate-100'>Email:</strong>{' '}
              <span className='text-slate-100'>{user?.email}</span>
            </p>
            <p>
              <strong className='text-slate-100'>Department:</strong>{' '}
              <span className='text-slate-100'>{departmentName ?? 'Unassigned'}</span>
            </p>
            <p>
              <strong className='text-slate-100'>Location:</strong>{' '}
              <span className='text-slate-100'>{user?.location || 'Not specified'}</span>
            </p>
            <p>
              <strong className='text-slate-100'>Salary:</strong>{' '}
              <span className='text-slate-100'>{user?.salary ? `$${user.salary}` : 'Not specified'}</span>
            </p>
          </div>
        </section>

        <section className='border border-gray-200 p-3 rounded-lg flex-1'>
          <h2 className='text-3xl text-center mt-5 mb-8'>Assigned Tasks</h2>

          {tasksError && (
            <div className='rounded-lg bg-red-100 p-4 text-sm text-red-700'>
              There was a problem loading your tasks.
            </div>
          )}

          {assignedTasks.length === 0 ? (
            <div className='rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500'>
              You have no assigned tasks yet.
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full table-auto border-collapse border border-slate-700'>
                <thead>
                  <tr>
                    <th className='border border-slate-600 p-3 bg-slate-700'>Title</th>
                    <th className='border border-slate-600 p-3 bg-slate-700'>Description</th>
                    <th className='border border-slate-600 p-3 bg-slate-700'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task: Task) => (
                    <tr key={task.id}>
                      <td className='border border-slate-700 p-3'>{task.title}</td>
                      <td className='border border-slate-700 p-3'>{task.description}</td>
                      <td className='border border-slate-700 p-3'>
                        {task.is_completed ? (
                          <div className='w-fit h-fit px-3 py-1 bg-teal-300 text-gray-700 text-sm font-medium rounded-full flex justify-center items-center border-b-0'>
                            Completed
                          </div>
                        ) : (
                          <div className='w-fit h-fit px-3 py-1 bg-red-400 text-gray-700 text-sm font-medium rounded-full flex justify-center items-center'>
                            In Progress
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

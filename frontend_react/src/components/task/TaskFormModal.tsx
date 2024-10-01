/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Modal from '../shared/Modal';
import { Task } from '../../types/task';
import {
  useCreateTaskMutation,
  useEditTaskMutation,
} from '../../hooks/tasksHooks';
import { useGetAllEmployeesQuery } from '../../hooks/employeeHooks';
import { Employee } from '../../types/employee';

const taskSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
    assigned_to: yup.number().required(),
    status: yup.boolean(),
  })
  .required();

type FormData = yup.InferType<typeof taskSchema>;

// type FormData = {
//   taskName: string;
//   email: string;
//   location: string;
//   department: number;
//   status?: boolean;
// };

interface TaskFormModalProps {
  task?: Task;
  isOpen: boolean;
  handleClose: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  task,
  isOpen,
  handleClose,
}) => {
  const { data } = useGetAllEmployeesQuery();

  const { mutateAsync: createTask, error: createError } =
    useCreateTaskMutation();
  const { mutateAsync: editTask, error: editError } =
    useEditTaskMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(taskSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if(!task){

      await createTask({
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
      });
      toast.success('Task Created');
    }else{
      
      
      await editTask({
        id:task.id,
        title: data.title,
        description: data.description,
        assigned_to: data.assigned_to,
        is_completed: data.status,
      });
      toast.success('Task Updated');
    }
    reset();
    handleClose();
  };

  if (createError || editError) {
    toast.error('Something went wrong');
  }

  console.log('8888', task);

  return (
    <Modal
      title={`${task ? 'Edit' : 'Create New'} Task`}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mt-6 w-full'>
          <div className='mb-3'>
            <label
              htmlFor='title'
              className='block mb-2 text-sm font-medium text-gray-400 '
            >
              Title
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 bg-slate-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
              id='title'
              type='text'
              {...register('title')}
              defaultValue={task?.title || ''}
              placeholder='Title'
            />
            <p className='my-1 text-red-400 text-sm capitalize'>
              {errors.title && 'Title Is A Required Field'}
            </p>
          </div>

          <div className='mb-3'>
            <label
              htmlFor='description'
              className='block mb-2 text-sm font-medium text-gray-400 '
            >
              Description
            </label>
            <input
              className='shadow appearance-none border border-gray-400 rounded w-full py-2 px-3 bg-slate-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline'
              id='description'
              type='text'
              {...register('description')}
              defaultValue={task?.description || ''}
              placeholder='Description'
            />
            <p className='my-1 text-red-400 text-sm capitalize'>
              {errors.description?.message}
            </p>
          </div>

          <div className='mb-3'>
          <label
            htmlFor='assigned_to'
            className='block mb-2 text-sm font-medium text-gray-400 '
          >
            Select a employee
          </label>
          <select
            id='assigned_to'
            className='bg-slate-700 border border-gray-400 text-gray-400 rounded shadow focus:outline-none focus:ring-gray-300 focus:border-gray-500 w-full py-1.5 px-3'
            {...register('assigned_to')}
          >
            <option>Choose an employee</option>
            {data?.map((employee: Employee) => (
              <option value={employee.id} key={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          <p className='my-1 text-red-400 text-sm capitalize'>
            {errors.assigned_to && 'Employee Is A Required Field'}
          </p>
        </div>
        { task &&
          (
          <div className='mb-3'>
          <label
            htmlFor='status'
            className='block mb-2 text-sm font-medium text-gray-400 '
            >
            Status
          </label>
          <select
            id='status'
            className='bg-slate-700 border border-gray-400 text-gray-400 rounded shadow focus:outline-none focus:ring-gray-300 focus:border-gray-500 w-full py-1.5 px-3'
            {...register('status',{
              setValueAs: (value) => value === 'true'})}
            >
            <option value='true'>Completed</option>
            <option value='false'>In-Progress</option>
          </select>
          <p className='my-1 text-red-400 text-sm capitalize'>
            {errors.status && 'Error'}
          </p>
        </div>
        )
        }
        </div>


        <div className='bg-[#192734] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mt-3'>
          <button
            type='submit'
            className='inline-flex w-full justify-center rounded-md bg-teal-400 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-teal-200 sm:ml-3 sm:w-auto'
          >
            {task ? 'Edit' : 'Create'}
          </button>
          <button
            type='button'
            className='mt-3 inline-flex w-full justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskFormModal;

import { useState, ChangeEvent } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

import TaskList from './TaskList';
import Input from '../shared/Input';
import TaskFormModal from './TaskFormModal';

const TaskSection = () => {
  const [searchText, setSearchText] = useState<string>('');

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <section className='border border-gray-200 p-3 rounded-lg flex-1'>
      <h2 className='text-3xl text-center mt-5 mb-8'>Task</h2>
      <div className='mb-4 flex gap-2'>
        <Input
          value={searchText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchText(e.target.value)
          }
          placeholder='Search tasks'
        />
        <div
          onClick={() => setIsFormOpen(true)}
          className='bg-teal-300 rounded-full w-11 h-10 flex justify-center items-center cursor-pointer'
        >
          <AiOutlinePlus className='text-gray-700 font-bold text-center text-2xl' />
        </div>
      </div>

      <TaskFormModal isOpen={isFormOpen} handleClose={handleFormClose} />

      <TaskList searchText={searchText} />
    </section>
  );
};

export default TaskSection;

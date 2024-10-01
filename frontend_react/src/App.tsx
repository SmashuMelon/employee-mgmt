import DepartmentSection from './components/department/DepartmentSection';
import EmployeeSection from './components/employee/EmployeeSection';
import TaskSection from './components/task/TaskSection';

const App = () => {
  return (
    <div className='flex gap-3 h-full w-full min-h-screen p-5 flex-wrap'>
      <DepartmentSection />
      <EmployeeSection />
      <TaskSection />
    </div>
  );
};

export default App;

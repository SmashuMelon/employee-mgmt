import DepartmentSection from './components/department/DepartmentSection';
import EmployeeSection from './components/employee/EmployeeSection';
import TaskSection from './components/task/TaskSection';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import { useAuth } from './context/AuthContext';
import { Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const MainApp = () => {
    if (!isAuthenticated) return <Login />;
    if (user && !user.is_admin) return <EmployeeDashboard />;

    return (
      <div className='min-h-screen w-full p-5'>
        <div className='mb-6 flex flex-col gap-4 rounded-xl border border-[#7fdcd1] bg-[#94e2d5] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-3xl font-semibold tracking-tight text-[#032727] uppercase'>CONTROL PANEL</h1>
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
          <DepartmentSection />
          <EmployeeSection />
          <TaskSection />
        </div>
      </div>
    );
  };

  return (
    <Routes>
      <Route path='/' element={<MainApp />} />
      <Route
        path='/register'
        element={<Register onCancel={() => navigate('/')} />}
      />
    </Routes>
  );
};

export default App;

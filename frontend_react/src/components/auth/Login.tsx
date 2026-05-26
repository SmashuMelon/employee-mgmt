import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#94e2d5] p-5'>
      <div className='w-full max-w-lg rounded-3xl border border-[#74d7c9] bg-[#142f2b] p-8 shadow-[0_16px_32px_rgba(15,79,72,0.16)]'>
        <h1 className='mb-6 text-3xl font-semibold tracking-tight text-[#94e2d5]'>Sign in to Employee Portal</h1>
        <p className='mb-8 text-sm text-[#dbe8e4]'>Use admin credentials for the manager dashboard, or your employee credentials for the employee panel.</p>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <label className='block'>
            <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Username</span>
            <input
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
              placeholder='admin or employee'
            />
          </label>

          <label className='block'>
            <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Password</span>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
              placeholder='Your password'
            />
          </label>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full rounded-2xl bg-[#94e2d5] px-4 py-3 text-[#0f4f48] transition hover:bg-[#7fdcd1] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

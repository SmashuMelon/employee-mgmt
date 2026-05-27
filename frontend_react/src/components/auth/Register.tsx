import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = ({ onCancel }: { onCancel?: () => void }) => {
  const { login } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/api/employees/')
      .then((res) => {
        if (mounted) setEmployees(res.data || []);
      })
      .catch(() => {
        /* ignore */
      });
    return () => {
      mounted = false;
    };
  }, []);

  const navigate = useNavigate();
  const handleCancel = () => {
    if (onCancel) return onCancel();
    navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const match = employees.find(
        (emp) => emp.email.toLowerCase() === email.toLowerCase() && emp.name.toLowerCase() === name.toLowerCase()
      );

      if (!match) {
        setError('No matching employee found with that name and email.');
        setIsSubmitting(false);
        return;
      }

      // Call backend to create auth account
      await api.post('/api/employees/register-account/', {
        email,
        username,
        password,
      });

      // Auto-login after successful registration
      await login(username.trim(), password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mt-6 p-6'>
      <h2 className='mb-4 text-xl font-semibold text-[#94e2d5]'>Register an account</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <label className='block'>
          <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Full name</span>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
            placeholder='Your full name as in the company records'
          />
        </label>

        <label className='block'>
          <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Email</span>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
            placeholder='your.name@company.com'
          />
        </label>

        <label className='block'>
          <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Username</span>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
            placeholder='choose a username'
          />
        </label>

        <label className='block'>
          <span className='mb-2 block text-sm font-medium text-[#c7e7e0]'>Password</span>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full rounded-2xl border border-[#74d7c9] bg-[#0f3f38] px-4 py-3 text-[#e8f7f3] outline-none transition focus:border-[#94e2d5]'
            placeholder='choose a secure password'
          />
        </label>

        {error && <p className='text-sm text-red-400'>{error}</p>}

        <div className='flex gap-3'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='rounded-2xl bg-[#94e2d5] px-4 py-2 text-[#0f4f48] transition hover:bg-[#7fdcd1] disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isSubmitting ? 'Registering…' : 'Register'}
          </button>

          <button
            type='button'
            onClick={handleCancel}
            className='rounded-2xl border border-[#74d7c9] px-4 py-2 text-sm text-[#94e2d5] hover:bg-[#0f3f38]'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;

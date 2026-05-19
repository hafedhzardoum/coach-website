import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Dumbbell } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-10">
        <div className="flex justify-center mb-8">
          <a href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <Dumbbell className="text-yellow-400 w-8 h-8" />
            HZ<span className="text-yellow-400">FIT</span>
          </a>
        </div>
        <h2 className="text-3xl font-black text-white text-center mb-8">ADMIN LOGIN</h2>
        
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold text-center">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-5 py-3 text-white focus:border-yellow-400 outline-none"
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black text-lg mt-4 hover:bg-yellow-300 transition-all disabled:opacity-50"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { LogOut, Dumbbell, Users, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'onboarding' | 'messages'>('onboarding');
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
        fetchData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const subSnap = await getDocs(collection(db, 'onboardingSubmissions'));
      const subs = subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      subs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSubmissions(subs);

      const msgSnap = await getDocs(collection(db, 'contactMessages'));
      const msgs = msgSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      msgs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(msgs);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-yellow-400 font-bold tracking-widest uppercase">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <a href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <Dumbbell className="text-yellow-400 w-8 h-8" />
            HZ<span className="text-yellow-400">FIT</span> <span className="text-sm font-normal text-gray-500 ml-2">Admin</span>
          </a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </header>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('onboarding')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'onboarding' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'}`}
          >
            <Users className="w-5 h-5" /> Reservations ({submissions.length})
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'messages' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'}`}
          >
            <MessageSquare className="w-5 h-5" /> Messages ({messages.length})
          </button>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
          {activeTab === 'onboarding' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-950/50 text-gray-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Goal</th>
                    <th className="px-6 py-4">Experience</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No reservations yet.</td></tr>
                  )}
                  {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">{sub.name}</td>
                      <td className="px-6 py-4 text-gray-300">{sub.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold uppercase">{sub.goal}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{sub.experience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-950/50 text-gray-400 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 w-32">Date</th>
                    <th className="px-6 py-4 w-48">Name</th>
                    <th className="px-6 py-4 w-64">Email</th>
                    <th className="px-6 py-4">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {messages.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No messages yet.</td></tr>
                  )}
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 align-top">{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold align-top">{msg.name}</td>
                      <td className="px-6 py-4 text-gray-300 align-top">{msg.email}</td>
                      <td className="px-6 py-4 text-gray-300 whitespace-pre-wrap">{msg.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

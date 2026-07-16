import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { FiMail, FiLock, FiKey, FiArrowLeft } from 'react-icons/fi';

const AdminLogin = () => {
  const { login, isAuthenticated, admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Enter your email and password'); return; }
    setSending(true);
    try {
      await api.post('/auth/send-otp', { email, password });
      setSent(true);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp) { setError('Enter the OTP'); return; }
    setVerifying(true);
    try {
      const userData = await login(email, otp);
      if (userData.role !== 'admin') {
        setError('You do not have admin access');
        return;
      }
      navigate('/admin-pacific/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setVerifying(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated && admin) {
    return <Navigate to="/admin-pacific/dashboard" replace />;
  }

  return (
    <>
      <Helmet><title>Admin Login - Pacific Barista</title></Helmet>
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-cream rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-primary">Pacific Barista</h1>
              <p className="font-body text-text/60 mt-2">Admin Dashboard</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-body text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.form
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@pacificbarista.com"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] placeholder:text-text/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] placeholder:text-text/30"
                      />
                    </div>
                  </div>
                  <Button type="submit" loading={sending} className="w-full justify-center" size="lg">
                    Send OTP
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-primary font-body font-medium text-sm mb-1.5">OTP sent to {email}</label>
                    <div className="relative">
                      <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full pl-10 pr-4 py-3 bg-white border-2 border-primary/10 rounded-lg text-text font-body text-sm text-center text-2xl tracking-[8px] outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_0_3px_rgba(200,155,60,0.1)] placeholder:text-text/30"
                      />
                    </div>
                    <p className="font-body text-xs text-text/40 mt-2 text-center">Enter the 6-digit code sent to your email. Expires in 10 minutes.</p>
                  </div>
                  <Button type="submit" loading={verifying} className="w-full justify-center" size="lg">
                    Verify & Sign In
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setStep('email'); setError(''); setOtp(''); setPassword(''); }}
                    className="w-full flex items-center justify-center gap-2 font-body text-sm text-text/50 hover:text-accent transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4" /> Use a different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <p className="text-center text-cream/50 font-body text-sm mt-6">
            Pacific Barista Training Academy &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;

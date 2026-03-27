import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  Eye, 
  EyeOff,
  Loader2,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FloatingInput from '../components/ui/FloatingInput';
import AnimatedButton from '../components/ui/AnimatedButton';
import GlassCard from '../components/ui/GlassCard';
import ThemeToggle from '../components/ui/ThemeToggle';
import api from '../services/api';

const PremiumLoginPage = () => {
  const { login, token, ready } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [roleChoice, setRoleChoice] = useState("ADMIN");
  const [email, setEmail] = useState("admin@surakshapath.in");
  const [password, setPassword] = useState("Admin@123");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [scope, setScope] = useState({ state_id: "", district_id: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (ready && token) return <Navigate to="/dashboard" replace />;

  const applyRolePreset = (nextRole) => {
    setRoleChoice(nextRole);
    if (nextRole === "ADMIN") {
      setEmail("admin@surakshapath.in");
      setPassword("Admin@123");
      return;
    }
    setEmail("user@surakshapath.in");
    setPassword("User@123");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed. Check backend/API URL.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
        phone,
        role: roleChoice,
        state_id: scope.state_id,
        district_id: scope.district_id,
      });
      const loginResp = await api.post("/auth/login", { email, password });
      login(loginResp.data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      {/* Theme Toggle & Home Navigation */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-3">
        <Link 
          to="/" 
          className="p-3 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-600 hover:bg-slate-700/80 transition-all hover:border-purple-500/50 group"
        >
          <Home className="w-5 h-5 text-blue-300 group-hover:text-purple-400 transition-colors" />
        </Link>
        <ThemeToggle />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side - Branding */}
        <motion.div variants={itemVariants} className="hidden lg:block">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SurakshaPath
                </h1>
                <p className="text-gray-300">Disaster Management Platform</p>
              </div>
            </div>
            
            <div className="space-y-6 mt-12">
              <motion.div variants={itemVariants} className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time SOS Alerts</h3>
                  <p className="text-gray-400">Instant emergency response coordination with live tracking and priority management.</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Volunteer Network</h3>
                  <p className="text-gray-400">Connect with trained volunteers and coordinate relief efforts efficiently.</p>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800 rounded-xl">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analytics</h3>
                  <p className="text-gray-400">Advanced predictive analytics and risk assessment powered by machine learning.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div variants={itemVariants}>
          <div className="bg-slate-800 border border-slate-600 rounded-2xl p-8">
            {/* Mobile Logo */}
            <div className="flex items-center justify-center lg:hidden mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent ml-3">
                SurakshaPath
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-400">
                {mode === "login" 
                  ? "Sign in to access the disaster management dashboard" 
                  : "Join our emergency response network"
                }
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <AnimatedButton
                variant={mode === "login" ? "primary" : "glass"}
                size="sm"
                onClick={() => setMode("login")}
              >
                Sign In
              </AnimatedButton>
              <AnimatedButton
                variant={mode === "register" ? "primary" : "glass"}
                size="sm"
                onClick={() => setMode("register")}
              >
                Sign Up
              </AnimatedButton>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="text-small text-gray-400 mb-2 block">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton
                  variant={roleChoice === "ADMIN" ? "primary" : "glass"}
                  size="sm"
                  onClick={() => applyRolePreset("ADMIN")}
                >
                  <Shield size={16} className="mr-2" />
                  Admin
                </AnimatedButton>
                <AnimatedButton
                  variant={roleChoice === "USER" ? "primary" : "glass"}
                  size="sm"
                  onClick={() => applyRolePreset("USER")}
                >
                  <Users size={16} className="mr-2" />
                  User
                </AnimatedButton>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-4">
              {mode === "register" && (
                <FloatingInput
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}
              
              <FloatingInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              {mode === "register" && (
                <FloatingInput
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              )}
              
              <div className="relative">
                <FloatingInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <AnimatedButton
                type="submit"
                variant="primary"
                className="w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </AnimatedButton>
            </form>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-slate-700 rounded-xl border border-red-500/30"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <p className="text-caption text-gray-400 mb-3 text-center">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton
                  variant="glass"
                  size="sm"
                  onClick={() => applyRolePreset("ADMIN")}
                >
                  Admin Demo
                </AnimatedButton>
                <AnimatedButton
                  variant="glass"
                  size="sm"
                  onClick={() => applyRolePreset("USER")}
                >
                  User Demo
                </AnimatedButton>
              </div>
            </div>

            {/* Home Navigation */}
            <div className="mt-6 pt-6 border-t border-slate-600">
              <div className="text-center">
                <p className="text-caption text-gray-400 mb-3">Just looking around?</p>
                <Link 
                  to="/" 
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all group"
                >
                  <Home className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
                  <span className="text-small text-purple-300 group-hover:text-purple-200 transition-colors">
                    Back to Home
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PremiumLoginPage;

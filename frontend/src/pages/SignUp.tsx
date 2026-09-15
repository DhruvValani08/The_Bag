import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error, user, session } = await signUp(email.trim(), password);
      if (error) throw error;

      // If account already exists, Supabase returns user with empty identities array
      if (user && user.identities && user.identities.length === 0) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }

      // If a session was created (email confirmation disabled or auto-confirmed), redirect directly to bag
      if (session) {
        navigate('/bag');
        return;
      }

      // If email confirmation is required
      setInfo('Account created! Supabase requires email confirmation before signing in. Please check your inbox or sign in once verified.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        setError('Email rate limit reached for Supabase. If you already created your account, please sign in. (You can also disable "Confirm email" in your Supabase Auth settings to bypass verification).');
      } else {
        setError(err.message || 'An error occurred during sign up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="bag-logo">
            <Briefcase size={36} className="logo-icon" />
          </div>
          <h1>The Bag</h1>
          <p className="subtitle">Start packing your digital findings.</p>
        </div>
        <form onSubmit={handleSignUp} className="auth-form">
          {error && <div className="error-banner">{error}</div>}
          {info && <div className="info-banner">{info}</div>}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <KeyRound className="input-icon" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <KeyRound className="input-icon" size={18} />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/signin">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

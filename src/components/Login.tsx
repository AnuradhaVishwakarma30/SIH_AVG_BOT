import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Frontend prototype validation
    if (username === 'admin' && password === 'admin') {
      setErrorMessage('');
      onLoginSuccess();
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center items-center px-4 py-8 font-mono">
      <div className="w-full max-w-md border-2 border-black p-8 bg-white shadow-none">
        {/* Header Branding */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
         
        </div>

        {/* Login Title */}
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider border-l-4 border-black pl-2">
            LOGIN
          </h2>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div
            id="login-error-message"
            className="mb-4 p-2.5 border border-red-600 bg-red-50 text-red-600 text-xs font-semibold"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase font-bold mb-1.5" htmlFor="username-input">
              Username
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border border-black px-3 py-2 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold mb-1.5" htmlFor="password-input">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-black px-3 py-2 text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-widest py-3 px-4 border border-black transition-colors cursor-pointer"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>

  );
};

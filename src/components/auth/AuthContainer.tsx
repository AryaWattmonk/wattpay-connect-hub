import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { VerifyOtpForm } from './VerifyOtpForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type AuthView = 'login' | 'signup' | 'forgotPassword' | 'verifyOtp' | 'resetPassword';

export const AuthContainer = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [resetEmail, setResetEmail] = useState('');

  const handleOtpSent = (email: string) => {
    setResetEmail(email);
    setCurrentView('verifyOtp');
  };

  const handleOtpVerified = () => {
    setCurrentView('resetPassword');
  };

  const renderAuthForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('forgotPassword')}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            onSwitchToLogin={() => setCurrentView('login')}
            onOtpSent={handleOtpSent}
          />
        );
      case 'verifyOtp':
        return (
          <VerifyOtpForm
            email={resetEmail}
            onSwitchToLogin={() => setCurrentView('login')}
            onOtpVerified={handleOtpVerified}
          />
        );
      case 'resetPassword':
        return (
          <ResetPasswordForm
            email={resetEmail}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderAuthForm()}
      </div>
    </div>
  );
};
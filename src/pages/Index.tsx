import { useAuthStore } from '@/store/authStore';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return <AuthContainer />;
};

export default Index;

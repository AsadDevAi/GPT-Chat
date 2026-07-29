import { LoginForm, AuthLayout } from '@/components/auth/AuthForms';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your GPT Chat account"
    >
      <LoginForm />
    </AuthLayout>
  );
}

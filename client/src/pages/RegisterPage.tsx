import { RegisterForm, AuthLayout } from '@/components/auth/AuthForms';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Join GPT Chat and start chatting with AI"
    >
      <RegisterForm />
    </AuthLayout>
  );
}

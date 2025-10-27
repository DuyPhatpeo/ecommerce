import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <>
      <AuthLayout
        title="Welcome Back"
        subtitle="Log in to continue exploring your personalized experience."
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default LoginPage;

import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <>
      <AuthLayout
        title="Join Our Community"
        subtitle="Create your account and start your amazing journey with us."
      >
        <RegisterForm />
      </AuthLayout>
    </>
  );
};

export default RegisterPage;

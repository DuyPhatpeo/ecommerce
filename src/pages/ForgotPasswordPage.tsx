import AuthLayout from "../components/auth/AuthLayout";
import ForgotPassword from "../components/auth/ForgotPassword";

const ForgotPasswordPage = () => {
  return (
    <>
      <AuthLayout
        title="Forgot Password?"
        subtitle="Enter your email and we’ll send you a link to reset your password."
      >
        <ForgotPassword />
      </AuthLayout>
    </>
  );
};

export default ForgotPasswordPage;

import { FormInput } from "../components";

const Login = () => {
  return (
    <>
      <div className="container mx-auto py-28">
        <form className="w-full md:w-2/5 mx-auto">
          <h1 className="text-white font-mono text-3xl font-bold mb-10">
            Task App Login
          </h1>
          <FormInput label="Email" type="email" name="email" />
        </form>
      </div>
    </>
  );
};

export default Login;

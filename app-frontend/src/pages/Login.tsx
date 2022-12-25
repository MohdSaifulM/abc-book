import FormGroup from "../components/FormGroup";

const Login = () => {
    return (
        <section className="section-login">
            <form className="form">
                <h1 className="heading-primary">Login</h1>

                <FormGroup type="email" placeholder="Email" label="Email Address" />

                <FormGroup type="password" placeholder="Password" label="Password" />

                <FormGroup type="button" label="Login" />
                
            </form>
        </section>
    );
};

export default Login;
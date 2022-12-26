import FormGroup from "../components/FormGroup";

const Login = () => {
    return (
        <section className="section-form-login-register">
            <form className="form">
                <h1 className="heading-primary heading-form heading-login">Login</h1>

                <FormGroup type="email" placeholder="Email" label="Email Address" />

                <FormGroup type="password" placeholder="Password" label="Password" />

                <FormGroup type="button" label="Login" />

                <p className="paragraph">Not a member yet? Click <a className="btn-text" href="/register">here</a> to register</p>
                
            </form>
        </section>
    );
};

export default Login;
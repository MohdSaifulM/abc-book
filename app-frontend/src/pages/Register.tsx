import FormGroup from "../components/FormGroup";

const Register = () => {
    return (
        <section className="section-form-login-register">
            <form className="form">
                <h1 className="heading-primary heading-form heading-register">Register</h1>

                <FormGroup type="name" placeholder="Name" label="Name" />

                <FormGroup type="email" placeholder="Email" label="Email Address" />

                <FormGroup type="password" placeholder="Password" label="Password" />

                <FormGroup type="password" placeholder="Confirm Password" label="Confirm Password" />

                <FormGroup type="button" label="Register" />

                <p className="paragraph">Already registered? Click <a className="btn-text" href="/login">here</a> to login</p>
                
            </form>
        </section>
    );
};

export default Register;
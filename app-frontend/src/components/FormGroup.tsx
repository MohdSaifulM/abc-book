type FormProps = {
    type: string,
    label: string,
    placeholder?: string
}

const FormGroup = (props: FormProps) => {
    return (
        <div className="form__group">
            { props.type !== 'button' && <label htmlFor={props.type} className="form__label">{props.label}:</label> }
            { props.type !== 'button' && <input type={props.type} className="form__input" placeholder={props.placeholder} id={props.type} required /> }
            { props.type === 'button' && <button className="btn-login btn--blue">{props.label}</button> }
        </div>
    );
};

export default FormGroup;
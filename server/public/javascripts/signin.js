class SignInForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        alert('Your username is' + this.state.name);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username: 
                    <input name="name" type="text" onChange={this.handleChange} />
                </label>
                <br />
                <label>
                    Password: 
                    <input name="password" type="password" onChange={this.handleChange} />
                </label>
            </form>
        );
    }

}

const signInForm = new SignInForm();
ReactDOM.render(
    signInForm,
    document.getElementById('signinform')
);
// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { StudentRegisterProps, studentRegisterStates } from './props';
import { Student } from 'config';

import { InputField, Button } from 'components/common';
import { studentRegister } from 'redux/store/student/action';

class StudentRegister extends React.Component<StudentRegisterProps, studentRegisterStates> {
	state = { first_name: '', last_name: '', email: '' };

	shouldComponentUpdate(_: any, nextState: studentRegisterStates) {
		if (this.state === nextState) return false;
		return true;
	}

	onValueChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ [key]: e.target.value });
	};

	handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const { first_name, last_name, email } = this.state;
		const { signInId, studentRegister, close } = this.props;
		const student = {
			uid: '',
			studentId: signInId,
			first_name,
			last_name,
			email,
			active: true,
			appointments: []
		};
		studentRegister(student).then(() => close()).catch((err) => alert(err.message));
	};

	render() {
		const { first_name, last_name, email } = this.state;
		return (
			<form>
				<InputField
					type="text"
					label="First name"
					value={first_name}
					onTextChange={this.onValueChange('first_name')}
				/>
				<InputField
					type="text"
					label="Last name"
					value={last_name}
					onTextChange={this.onValueChange('last_name')}
				/>
				<InputField type="email" label="Email" value={email} onTextChange={this.onValueChange('email')} />
				<Button type="submit" label="Save" onClick={this.handleSubmit} />
			</form>
		);
	}
}

export default connect(null, { studentRegister })(StudentRegister);

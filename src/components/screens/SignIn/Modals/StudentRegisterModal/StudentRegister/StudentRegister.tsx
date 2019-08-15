// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { StudentRegisterProps, studentRegisterStates } from './props';
import { Student } from 'config';

import { InputField, Button } from 'components/common';
import { studentRegister } from 'redux/store/student/action';

import styles from './styles.module.css';

class StudentRegister extends React.Component<any, any> {
	state = { first_name: '', last_name: '', email: '' };

	shouldComponentUpdate(_: any, nextState: any) {
		if (this.state === nextState) return false;
		return true;
	}

	onValueChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({ [key]: e.target.value });
	};

	handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const { first_name, last_name, email } = this.state;
		if (first_name && last_name && email) {
			const { signInId, studentRegister, close } = this.props;
			const student = {
				uid: '',
				studentId: signInId,
				first_name,
				last_name,
				email,
				active: true
			};
			studentRegister(student).then(() => close()).catch((err: Error) => alert(err.message));
		} else alert('Please fully enter the required information.');
	};

	render() {
		const { first_name, last_name, email } = this.state;
		return (
			<form onSubmit={this.handleSubmit}>
				<h2 style={{ color: 'rgba(0,0,0,0.7)' }}>New student registration</h2>
				<div className={styles.inputWrapper}>
					<InputField
						type="text"
						label="First name:"
						value={first_name}
						onTextChange={this.onValueChange('first_name')}
					/>
				</div>
				<div className={styles.inputWrapper}>
					<InputField
						type="text"
						label="Last name:"
						value={last_name}
						onTextChange={this.onValueChange('last_name')}
					/>
				</div>
				<div className={styles.inputWrapper}>
					<InputField
						type="email"
						label="Email:"
						value={email}
						onTextChange={this.onValueChange('email')}
					/>
				</div>
				<Button customClassName={styles.saveBtn} type="submit" label="Sign in" />
			</form>
		);
	}
}

export default connect(null, { studentRegister })(StudentRegister);

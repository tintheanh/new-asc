import * as React from 'react';
import { TutorFormProps } from './props';

import { InputField, Button, Checkbox } from 'components/common';

const TutorForm: React.SFC<TutorFormProps> = (props) => {
	const { disable, selected, toggleEdit, onTextChange, toggleCancel, handleSubmit } = props;
	return (
		<form>
			<InputField
				type="number"
				disabled={disable}
				label="ID"
				value={selected ? selected.staff_id : ''}
				onTextChange={onTextChange.updateBasicInfo('staff_id')}
			/>
			<InputField
				type="text"
				disabled={disable}
				label="First name"
				value={selected ? selected.first_name : ''}
				onTextChange={onTextChange.updateBasicInfo('first_name')}
			/>
			<InputField
				type="text"
				disabled={disable}
				label="Last name"
				value={selected ? selected.last_name : ''}
				onTextChange={onTextChange.updateBasicInfo('last_name')}
			/>
			<InputField
				type="email"
				disabled={disable}
				label="Email"
				value={selected ? selected.email : ''}
				onTextChange={onTextChange.updateBasicInfo('email')}
			/>
			<Checkbox
				disabled={disable}
				checked={selected ? selected.active : false}
				labelText="Active"
				onChange={onTextChange.updateBasicInfo('active')}
			/>
			{disable ? (
				<Button label="Edit" onClick={toggleEdit} />
			) : (
				<div>
					<Button type="submit" label="Save" onClick={handleSubmit} />
					<Button label="Cancel" onClick={toggleCancel} />
				</div>
			)}
		</form>
	);
};

export default TutorForm;

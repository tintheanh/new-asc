import * as React from 'react';
import { Link } from 'react-router-dom';

export const UserPanel = () => {
	return (
		<div>
			<h1>User Panel</h1>
			<Link to="/admin/tutors">Tutors</Link>
			<Link to="/admin/students">Student</Link>
		</div>
	);
};

import * as React from 'react';
import { Link } from 'react-router-dom';

export const AppoinmentPanel = () => {
	return (
		<div>
			<h1>Appoinment Panel</h1>
			<Link to="/admin/appointments">View/Cancel</Link>
		</div>
	);
};

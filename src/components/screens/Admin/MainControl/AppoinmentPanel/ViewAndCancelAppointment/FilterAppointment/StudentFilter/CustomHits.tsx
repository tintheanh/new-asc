import * as React from 'react';
import { connect } from 'react-redux';
import { connectHits } from 'react-instantsearch-dom';
import { selectAndUpdateStudent, searchStudent } from 'redux/store/student/action';

class Hits extends React.Component<any, any> {
	performHit = (student: any) => () => {
		this.props.selectAndUpdateStudent(student);
	};

	componentWillUnmount() {
		this.props.searchStudent('');
		this.props.selectAndUpdateStudent(null);
	}

	render() {
		return this.props.hits.map((hit: any) => (
			<p key={hit.objectID} onClick={this.performHit(hit)}>
				{`${hit.first_name} ${hit.last_name}`}
			</p>
		));
	}
}

const CustomHits = connectHits(Hits);
export default connect(null, { selectAndUpdateStudent, searchStudent })(CustomHits);

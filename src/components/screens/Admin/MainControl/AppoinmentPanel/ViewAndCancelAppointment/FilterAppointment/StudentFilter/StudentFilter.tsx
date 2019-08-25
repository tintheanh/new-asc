import * as React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { connect } from 'react-redux';
import { algolia_appId, algolia_searchId } from 'config';
import { InstantSearch } from 'react-instantsearch-dom';
import CustomSearchBox from './CustomSearchBox';
import CustomHits from './CustomHits';
import Select from 'react-select';

const searchClient = algoliasearch(algolia_appId, algolia_searchId);

class FilterAppointment extends React.Component<any, any> {
	shouldComponentUpdate(nextProps: any, _: any) {
		if (this.props.searchToken !== nextProps.searchToken) return true;
		if (this.props.selectedStudent !== nextProps.selectedStudent) return true;
		return false;
	}
	render() {
		return (
			<div style={{ marginTop: 8 }}>
				<InstantSearch indexName="students" searchClient={searchClient}>
					<CustomSearchBox />
				</InstantSearch>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	searchToken: state.student.data.searchToken,
	selectedStudent: state.appointment.data.filter.student
});

export default connect(mapStateToProps, null)(FilterAppointment);

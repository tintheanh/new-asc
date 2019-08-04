import * as React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { algolia_appId, algolia_searchId } from 'config';
import {
	InstantSearch,
	Hits,
	SearchBox,
	Pagination,
	Highlight,
	ClearRefinements,
	RefinementList,
	Configure
} from 'react-instantsearch-dom';

const searchClient = algoliasearch(algolia_appId, algolia_searchId);

class FilterAppointment extends React.Component {
	render() {
		return (
			<div>
				<h1>test</h1>
				<InstantSearch indexName="appointments" searchClient={searchClient}>
					<SearchBox />
					<Hits hitComponent={Hit} />
				</InstantSearch>
			</div>
		);
	}
}

function Hit(props: any) {
	return (
		<div>
			<Highlight attribute="first_name" hit={props.hit} />
		</div>
	);
}

export default FilterAppointment;

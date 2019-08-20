import * as React from 'react';
import { connect } from 'react-redux';
import { resetTutor } from 'redux/store/tutor/action';
import { Button, Modal } from 'components/common';
import { EditOffTimes } from '../Tables';
import styles from './styles.module.css';

class OffTimes extends React.Component<any, any> {
	state = { modalOffTime: false };

	handleModalChange = () => {
		return {
			open: () => this.setState({ modalOffTime: true }),
			close: () =>
				this.setState({ modalOffTime: false }, () => {
					if (this.props.selected) {
						const { uid } = this.props.selected;
						const { data } = this.props;
						this.props.resetTutor(uid, data);
					}
				}),
			closeAfterSave: () => this.setState({ modalOffTime: false })
		};
	};
	render() {
		const { selected, toggleAdd } = this.props;
		return (
			<div style={{ marginBottom: 10 }}>
				<Button
					customClassName={styles.btn}
					disabled={selected === null || toggleAdd}
					label="Off Times"
					onClick={this.handleModalChange().open}
				/>
				<Modal width="65%" show={this.state.modalOffTime} close={this.handleModalChange().close}>
					<EditOffTimes close={this.handleModalChange().close} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state: any) => ({
	data: state.tutor.data.tutors,
	selected: state.tutor.data.selectedTutor,
	toggleAdd: state.tutor.data.toggleAdd
});

export default connect(mapStateToProps, { resetTutor })(OffTimes);

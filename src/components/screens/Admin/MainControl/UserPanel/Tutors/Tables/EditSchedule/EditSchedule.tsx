// Dependencies
import * as React from 'react';
import { connect } from 'react-redux';

// Props/State types & additional type(s)
import { EditScheduleProps, EditScheduleStates } from './props';

// Common & additional component(s)
import { Button, Modal } from 'components/common';
import { EditScheduleTable } from '../';

// Action(s)
import { resetTutor } from 'redux/store/tutor/action';
import styles from './styles.module.css';

class EditSchedule extends React.Component<
  EditScheduleProps,
  EditScheduleStates
> {
  state = { modalSchedule: false };

  handleModalChange = () => {
    return {
      open: () => this.setState({ modalSchedule: true }),
      close: () =>
        this.setState({ modalSchedule: false }, () => {
          if (this.props.selected) {
            const { uid } = this.props.selected;
            const { data } = this.props;
            this.props.resetTutor(uid, data);
          }
        }),
      closeAfterSave: () => this.setState({ modalSchedule: false })
    };
  };

  render() {
    const { selected, toggleAdd } = this.props;
    return (
      <div style={{ marginBottom: 10 }}>
        <Button
          customClassName={styles.btn}
          disabled={selected === null || toggleAdd}
          label="Edit schedule"
          onClick={this.handleModalChange().open}
        />
        <Modal
          width="95%"
          show={this.state.modalSchedule}
          close={this.handleModalChange().close}
        >
          <EditScheduleTable close={this.handleModalChange().closeAfterSave} />
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

export default connect(
  mapStateToProps,
  { resetTutor }
)(EditSchedule);

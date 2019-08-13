import React from 'react';
import styles from './styles.module.css';
import { ModalProps } from './props';

export const Modal: React.SFC<ModalProps> = (props) => {
	const { show, close, children, width } = props;
	if (show) {
		return (
			<div className={styles.overlay} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<div className={styles.modalWrapper} style={{ width }}>
					<div className={styles.modalHeader}>
						<span className={styles.closeModalBtn} onClick={close}>
							×
						</span>
					</div>
					<div className={styles.modalBody}>{children}</div>
					<div className={styles.modalFooter}>
						<button className={styles.btnCancel} onClick={close}>
							CLOSE
						</button>
					</div>
				</div>
			</div>
		);
	}
	return null;
};

Modal.defaultProps = {
	width: 'auto'
};

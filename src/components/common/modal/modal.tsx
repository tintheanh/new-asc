import React from 'react';
import styles from './styles.module.css';
import { ModalProps } from './props';

export const Modal: React.SFC<ModalProps> = (props) => {
	const { show, close, children, width } = props;
	return (
		<div
			className={styles.overlay}
			style={{ display: show ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center' }}
		>
			<div
				className={styles.modalWrapper}
				style={{
					display: show ? 'block' : 'none',
					width
				}}
			>
				<div className={styles.modalHeader}>
					<span className={styles.closeModalBtn} onClick={close}>
						×
					</span>
				</div>
				<div className={styles.modalBody}>{show ? children : null}</div>
				<div className={styles.modalFooter}>
					<button className={styles.btnCancel} onClick={close}>
						CLOSE
					</button>
				</div>
			</div>
		</div>
	);
};

Modal.defaultProps = {
	width: 'auto'
};

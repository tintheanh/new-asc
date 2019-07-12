import React from 'react';
import styles from './styles.module.css';
import { ModalProps } from './props';

export const Modal: React.SFC<ModalProps> = (props) => {
	return (
		<div>
			<div
				className={styles.modalWrapper}
				style={{
					transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
					opacity: props.show ? 1 : 0
				}}
			>
				<div className={styles.modalHeader}>
					<span className={styles.closeModalBtn} onClick={props.close}>
						×
					</span>
				</div>
				<div className={styles.modalBody}>{props.children}</div>
				<div className={styles.modalFooter}>
					<button className={styles.btnCancel} onClick={props.close}>
						CLOSE
					</button>
				</div>
			</div>
		</div>
	);
};

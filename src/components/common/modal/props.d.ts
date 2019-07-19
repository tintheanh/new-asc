export interface ModalProps {
	width?: number | string;
	show: boolean;
	close: () => void;
	children: any;
}

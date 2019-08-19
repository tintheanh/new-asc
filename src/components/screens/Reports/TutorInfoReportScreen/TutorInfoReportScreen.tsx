import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { chunk } from 'utils/functions';
import logo from 'components/common/mission-logo.png';
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

class TutorInfoReportScreena extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			data: []
		};
	}

	componentDidMount() {
		ipcRenderer.on('tutor-info-report', (_: any, content: Tutor[]) => {
			this.setState({
				data: content
			});
		});
	}

	renderPage = (data: any[]) => {
		return data.map((chunk: any[], i: number) => {
			return (
				<div key={i}>
					<section className={`sheet padding-15mm ${styles.page}`}>
						{i === 0 ? (
							<div className={styles.header}>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
								<div>
									<h2>Report</h2>
									<h3>Tutor Info</h3>
								</div>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
							</div>
						) : null}

						{chunk.map((tutor: any, i: number) => {
							return (
								<div key={i}>
									<h4 className={styles.tutorName}>{`${tutor.first_name} ${tutor.last_name}`}</h4>
									<div>
										<p className={styles.even}>
											<strong>Email:</strong> {tutor.email}
										</p>
										<p className={styles.odd}><strong>Staff ID:</strong> {tutor.staff_id}</p>
									</div>
								</div>
							);
						})}
					</section>
					<p className={styles.pageNum}>{`page: ${i + 1}`}</p>
				</div>
			);
		});
	};

	processData = () => {
		const chunked = chunk(this.state.data, 6);
		return chunked;
	};

	render() {
		const { data } = this.state;
		if (data) {
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage(this.processData())}
				</div>
			);
		}
		return null;
	}
}

export default TutorInfoReportScreena;

import * as React from 'react';
import { chunk } from 'utils/functions';
import styles from './styles.module.css';
import logo from 'components/common/mission-logo.png';

const ipcRenderer = (window as any).ipcRenderer;

class SubjectListReportScreen extends React.Component<any, any> {
	state = { data: [] };
	componentDidMount() {
		ipcRenderer.on('subject-list-report', (_: any, content: any[]) => {
			this.setState({
				data: content
			});
		});
	}

	renderPage = (data: any[]) => {
		return data.map((ch: any, i: number) => {
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
									<h3>Subject List</h3>
								</div>
								<div>
									<img src={logo} alt="" width="50" />
								</div>
							</div>
						) : null}
						<div className={styles.subjectContainer}>
							{ch.map((subject: any, j: number) => {
								return (
									<div
										key={j}
										className={`${styles.subject} ${j % 2 === 0 ? styles.even : styles.odd}`}
									>
										<p>{subject.label}</p>
										<p>{subject.full}</p>
									</div>
								);
							})}
						</div>
					</section>
					<p className={styles.pageNum}>{`page: ${i + 1}`}</p>
				</div>
			);
		});
	};

	processData = () => {
		const chunked = chunk(this.state.data, 20);
		return chunked;
	};

	render() {
		if (this.state.data.length) {
			return (
				<div className="A4" style={{ marginTop: 66 }}>
					{this.renderPage(this.processData())}
				</div>
			);
		}
		return null;
	}
}

export default SubjectListReportScreen;

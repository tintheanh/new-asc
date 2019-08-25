import * as React from 'react';
import { chunk, arraySort } from 'utils/functions';
import styles from './styles.module.css';
import logo from 'components/common/mission-logo.png';

const ipcRenderer = (window as any).ipcRenderer;

class SubjectByTutorReportScreen extends React.Component<any, any> {
  state = { data: [] };
  componentDidMount() {
    ipcRenderer.on('subject-by-tutor-report', (_: any, content: any[]) => {
      this.setState({
        data: content
      });
    });
  }

  renderPage = (data: any[]) => {
    if (!data.length) {
      return (
        <div>
          <section className={`sheet padding-15mm ${styles.page}`}>
            <div className={styles.header}>
              <div>
                <img src={logo} alt="" width="50" />
              </div>
              <div>
                <h2>Report</h2>
                <h3>Subject By Tutor</h3>
              </div>
              <div>
                <img src={logo} alt="" width="50" />
              </div>
            </div>
          </section>
          <p className={styles.pageNum}>page: 1</p>
        </div>
      );
    }
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
                  <h3>Subject By Tutor</h3>
                </div>
                <div>
                  <img src={logo} alt="" width="50" />
                </div>
              </div>
            ) : null}
            <div className={styles.subjectContainer}>
              {ch.map((subject: any, j: number) => {
                return (
                  <div key={j}>
                    <h4
                      className={styles.subjectName}
                    >{`${subject.label} - ${subject.full}`}</h4>
                    {subject.tutors.map((tutor: any, k: number) => {
                      return (
                        <div
                          className={`${styles.tutor} ${
                            k % 2 === 0 ? styles.even : styles.odd
                          }`}
                          key={k}
                        >
                          <p>{tutor.name}</p>
                        </div>
                      );
                    })}
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
    const subjectWithTutor = this.state.data.map((subject: any) => {
      return subject.tutors.map((tutor: any) => ({
        name: tutor.name,
        uid: tutor.uid,
        subject: subject.id
      }));
    });
    const flatted = subjectWithTutor.flat(Infinity);
    const chunked = chunk(flatted, 10);

    const results = chunked.map((ch: any) => {
      const group_to_values = ch.reduce((obj: any, item: any) => {
        obj[item.subject] = obj[item.subject] || [];
        obj[item.subject].push({ name: item.name, uid: item.uid });
        return obj;
      }, {});

      const groups = Object.keys(group_to_values).map((key: any) => {
        const subject: any = this.state.data.filter(
          (sj: any) => sj.id === key
        )[0];
        return {
          ...subject,
          tutors: arraySort(group_to_values[key], 'name')
        };
      });
      return groups;
    });
    return results;
  };

  render() {
    if (this.state.data.length) {
      console.log(this.state.data);
      console.log(this.processData());
      return (
        <div className="A4" style={{ marginTop: 66 }}>
          {this.renderPage(this.processData())}
        </div>
      );
    }
    return null;
  }
}

export default SubjectByTutorReportScreen;

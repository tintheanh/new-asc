import * as React from 'react';
import { Tutor } from 'redux/store/tutor/types';
import { TinySchedule } from 'components/common';
import { TutorScheduleReportStates } from './props';
import { workDays } from 'config';
import { chunk } from 'utils/functions';
import logo from 'components/common/mission-logo.png';
import styles from './styles.module.css';

const ipcRenderer = (window as any).ipcRenderer;

class TutorScheduleReportScreen extends React.Component<
  any,
  TutorScheduleReportStates
> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    ipcRenderer.on('tutor-schedule-report', (_: any, content: Tutor[]) => {
      this.setState({
        data: content
      });
    });
  }

  renderSchedule = (data: Tutor): JSX.Element[] => {
    return data.work_schedule.map((sch: any, i: number) => {
      return <TinySchedule key={i} day={workDays[i]} data={sch} />;
    });
  };
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
                  <h3>Tutor Schedule</h3>
                </div>
                <div>
                  <img src={logo} alt="" width="50" />
                </div>
              </div>
            ) : null}

            {chunk.map((tutor: any, g: number) => {
              return (
                <div key={g}>
                  <h4
                    className={styles.tutorName}
                  >{`${tutor.first_name} ${tutor.last_name}`}</h4>
                  {Object.keys(tutor.work_schedule).map(
                    (key: string, j: number) => {
                      if (tutor.work_schedule[key].length) {
                        return (
                          <div key={j}>
                            <div className={styles.dayReport}>
                              <h4>{workDays[Number(key)]}</h4>
                              {tutor.work_schedule[key].map(
                                (shift: any, k: number) => {
                                  if (k % 2 === 0)
                                    return (
                                      <div key={k} className={styles.even}>
                                        <p>{`${shift.from.time} - ${shift.to.time}`}</p>
                                      </div>
                                    );
                                  return (
                                    <div key={k} className={styles.odd}>
                                      <p>{`${shift.from.time} - ${shift.to.time}`}</p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div className={styles.divider} />
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
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
    const tutorsWithObjWorkSchedule = this.state.data.map((tutor: any) => {
      const objWorkSchedule = { ...tutor.work_schedule };
      const newTutor = { ...tutor };
      newTutor.work_schedule = objWorkSchedule;
      return newTutor;
    });

    const breakShifts = tutorsWithObjWorkSchedule.map((tutor: any) => {
      return Object.keys(tutor.work_schedule).map((key: string) => {
        return tutor.work_schedule[key].map((shift: any) => {
          return {
            uid: tutor.uid,
            key,
            shift
          };
        });
      });
    });
    const flatted = breakShifts.flat(Infinity);
    const chunked = chunk(flatted, 6);

    const results = chunked.map((ch: any) => {
      const group_to_values = ch.reduce((obj: any, item: any) => {
        obj[item.uid] = obj[item.uid] || [];
        obj[item.uid].push({ key: item.key, shift: item.shift });
        return obj;
      }, {});

      const groups = Object.keys(group_to_values).map((key: any) => {
        const tutor = tutorsWithObjWorkSchedule.filter(
          (tt: any) => tt.uid === key
        )[0];
        return { ...tutor, work_schedule: group_to_values[key] };
      });
      return groups;
    });

    const finals = results.map((chunk: any) => {
      return chunk.map((tutor: any) => {
        const rebuiltWorkSchedule: any = {};
        for (
          let i = Number(tutor.work_schedule[0].key);
          i <= Number(tutor.work_schedule[tutor.work_schedule.length - 1].key);
          i++
        ) {
          rebuiltWorkSchedule[String(i)] = [];
        }

        tutor.work_schedule.forEach((shiftObj: any) => {
          rebuiltWorkSchedule[shiftObj.key].push(shiftObj.shift);
        });

        return { ...tutor, work_schedule: rebuiltWorkSchedule };
      });
    });

    console.log(finals);
    return finals;
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

export default TutorScheduleReportScreen;

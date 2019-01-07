import React from 'react';
import { Query } from 'react-apollo';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../css/UserProfile.css';
import { STUDENTS, LESSONS, USERS, RECEIVED_STARS } from '../db/queries';
import PwChangeForm from './PasswordChange';
import ChallengeBar from './ChallengeBar';
import { loadComponent } from './shared/shared';
import gitLabMR from '../helpers/gitlabMrs';

const getMrs = (name, created_before, created_after) => {
  return new Promise((resolve, reject) => {
    gitLabMR.retrieveMR(name, created_before, created_after, mrVal => {
      resolve(mrVal);
    });
  });
};

class MrComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      toggle: !this.state.toggle
    });
  }

  render() {
    return (
      <div>
        <span className="upvote-icon">
          <i className="fa fa-thumbs-up ml-2" aria-hidden="true" />
        </span>
        <span className="upvote-data">{this.props.mrequests.upvotes}</span>
        <button
          onClick={this.toggle}
          className="btn red lighten-1 gs-button text-capitalize"
        >
          Description
        </button>
        {this.state.toggle ? (
          <div>{this.props.mrequests.description}</div>
        ) : null}
      </div>
    );
  }
}

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    const isPrivate = !props.match.params.userId;
    const userId = isPrivate ? window.userInfo.id : props.match.params.userId;
    const tabLabel = isPrivate ? 'Settings' : '';
    this.state = {
      startDate: moment().subtract(7, 'd'),
      endDate: moment(),
      userId,
      isPrivate,
      tabLabel,
      contributions: []
    };
    this.handleChangeStart = this.handleChangeStart.bind(this);
    this.handleChangeEnd = this.handleChangeEnd.bind(this);
    this.togglePwChangeForm = this.togglePwChangeForm.bind(this);
  }

  getMrs = () => {
    getMrs(
      window.userInfo.userName,
      this.state.endDate,
      this.state.startDate
    ).then(mrs => {
      this.setState({ contributions: mrs || [] });
    });
  };

  componentWillMount() {
    this.getMrs();
  }

  handleChangeStart(date) {
    this.setState(
      {
        startDate: date || moment()
      },
      this.getMrs
    );
  }
  handleChangeEnd(date) {
    this.setState(
      {
        endDate: date || moment()
      },
      this.getMrs
    );
  }

  togglePwChangeForm() {
    this.setState({ displayPwChangeForm: !this.state.displayPwChangeForm });
  }

  render() {
    const mRs = this.state.contributions.map((mrequests, index) => {
      return (
        <div className="container" key={index}>
          <div className="row">
            <div className="col-lg-6">
              <a href={mrequests.web_url} target="_blank">
                {mrequests.title}
              </a>
            </div>
            <div className="col-lg-6 description">
              <MrComponent mrequests={mrequests} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              !{mrequests.iid} opened about{' '}
              {moment(mrequests.created_at).fromNow()} by{' '}
              {mrequests.author.name}
            </div>
            <div className="col-lg-8 merge-request-status">
              <span className="updated-mr">
                updated about {moment(mrequests.updated_at).fromNow()}
              </span>
              <span className="badge blue-grey darken-1">
                {mrequests.state}
              </span>
            </div>
          </div>
          <hr />
        </div>
      );
    });

    return (
      <div>
        <div className="gs-container-1">
          <h4 className="gs-h1">
            <Query
              query={USERS}
              variables={{
                in: {
                  userId: this.state.userId
                }
              }}
            >
              {loadComponent(data => {
                return (
                  <div>
                    {' '}
                    <b> {data.users[0].username}</b>{' '}
                  </div>
                );
              })}
            </Query>
            <Query
              query={RECEIVED_STARS}
              variables={{
                in: {
                  userId: this.state.userId
                }
              }}
            >
              {loadComponent(({ receivedStars }) => {
                const numStars = receivedStars.length;
                return <div> {numStars} Stars</div>;
              })}
            </Query>
          </h4>
        </div>
        <div className="gs-container-2">
          <div className="gs-body-space">
            <ul className="nav md-pills nav-justified pills-secondary">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-toggle="tab"
                  href="#panel11"
                  role="tab"
                >
                  Progress
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#panel12"
                  role="tab"
                >
                  Adopted Students
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#panel13"
                  role="tab"
                >
                  MR Contributions
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link"
                  data-toggle="tab"
                  href="#panel14"
                  role="tab"
                >
                  {this.state.tabLabel}
                </a>
              </li>
            </ul>
            <Query query={LESSONS}>
              {loadComponent(({ lessons }) => {
                return (
                  <div className="tab-content">
                    <div
                      className="tab-pane fade in show active"
                      id="panel11"
                      role="tabpanel"
                    >
                      {lessons.reduce((acc, lesson, key) => {
                        /* Taking out because its making the app hella slow. Also sending too many requests */
                        /*
                        acc.push(
                          <div key={key}>
                            <div>{lesson.title}</div>
                            <ChallengeBar
                              lid={lesson.id}
                              studentId={this.state.userId}
                              challenges={lesson.challenges}
                            />
                          </div>
                        );
                        */
                        return acc;
                      }, [])}
                    </div>

                    <div className="tab-pane fade" id="panel12" role="tabpanel">
                      {lessons.reduce((acc, lesson, key) => {
                        /* Taking out because its making the app hella slow. Also sending too many requests */
                        /*
                        acc.push(
                          <Query
                            key={key}
                            query={STUDENTS}
                            variables={{
                              in: {
                                userId: parseInt(this.state.userId, 10),
                                id: lesson.id
                              }
                            }}
                          >
                            {loadComponent(({ students }) => {
                              const title =
                                students.length === 0 ? '' : lesson.title;
                              return (
                                <div>
                                  <div>
                                    <h5>{title}</h5>
                                  </div>
                                  {students.reduce((acc, student, key) => {
                                    if (student.id !== this.state.userId) {
                                      acc.push(
                                        <div key={key}>
                                          <div>{student.username}</div>
                                          <ChallengeBar
                                            lid={lesson.id}
                                            studentId={student.id}
                                            challenges={lesson.challenges}
                                          />
                                        </div>
                                      );
                                    }
                                    return acc;
                                  }, [])}
                                </div>
                              );
                            })}
                          </Query>
                        );
                        */
                        return acc;
                      }, [])}
                    </div>

                    <div className="tab-pane fade" id="panel13" role="tabpanel">
                      <div className="date-picker">
                        <div className="md-form">
                          <DatePicker
                            todayButton={'start date'}
                            selected={this.state.startDate}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeStart}
                            withPortal
                            showWeekNumbers
                            showYearDropdown
                            dateFormatCalendar="MMMM"
                            scrollableYearDropdown
                            yearDropdownItemNumber={1}
                            showMonthDropdown
                            id="start date"
                          />
                          <label htmlFor="start date">Start Date</label>
                        </div>
                        <div className="md-form">
                          <DatePicker
                            todayButton={'end date'}
                            selected={this.state.endDate}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            onChange={this.handleChangeEnd}
                            withPortal
                            showWeekNumbers
                            showYearDropdown
                            dateFormatCalendar="MMMM"
                            scrollableYearDropdown
                            yearDropdownItemNumber={1}
                            showMonthDropdown
                            id="end date"
                          />
                          <label htmlFor="end date">End Date</label>
                        </div>
                        <div className="MergeRequest">{mRs}</div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="panel14" role="tabpanel">
                      <PwChangeForm toggleDisplay={this.togglePwChangeForm} />
                    </div>
                  </div>
                );
              })}
            </Query>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;

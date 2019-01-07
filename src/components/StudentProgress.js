import React from 'react';
import { LESSON_STATUS } from '../db/queries.js';
import { Query } from 'react-apollo';
import { loadComponent } from './shared/shared.js';

const StudentProgress = ({ lessons, userId }) => {
  const lessonsInfo = Object.values(lessons);
  const lessonsArr = lessonsInfo[0];

  const lessonStatus = lessonsArr.map(lesson => {
    return (
      <Query
        key={lesson.id}
        query={LESSON_STATUS}
        variables={{
          in: {
            id: lesson.id,
            userId: parseInt(userId, 10)
          }
        }}
      >
        {loadComponent(data => {
          const enrolled = data.lessonStatus.isEnrolled
            ? 'Currently Enrolled!'
            : 'Not enrolled yet.';
          const passed = data.lessonStatus.isPassed
            ? 'Successfully passed every challenge!'
            : 'Currently working on the challenges.';
          const teacherStatus = data.lessonStatus.isTeaching
            ? 'Is now a teacher!'
            : 'Not a teacher yet.';
          return (
            <div>
              <div>
                <div className="bg-primary">
                  <h4>{lesson.title}</h4>
                </div>
                <div>ENROLLMENT STATUS: {enrolled}</div>
                <div>CHALLENGES STATUS: {passed}</div>
                <div>TEACHER STATUS: {teacherStatus}</div>
              </div>
              <hr />
            </div>
          );
        })}
      </Query>
    );
  });

  return (
    <div>
      <h2>My progress in the curriculum: </h2>
      <div>{lessonStatus}</div>
    </div>
  );
};

export default StudentProgress;

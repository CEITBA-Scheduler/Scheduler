import { Subject, Commission, Timeblock } from './algorithm-object';
import { Weekday } from './algorithm-interface';

/**
 * Returns a Timeblock objects formatted from the raw data
 * got from a HTTP request to SGA
 * @param data  Raw object
 */
export function parseTimeblock(data: any): Timeblock {
  const day = data.day.toUpperCase();
  return new Timeblock(
    Weekday[day as string],
    Timeblock.parseHHmm(data.hourFrom),
    Timeblock.parseHHmm(data.hourTo),
    data.building,
    data.classRoom
  );
}

/**
 * Returns a list of subjects formatted as necessary to run
 * the algorithm.
 * @param data  Raw object returned from the HTTP request to SGA
 */
export function parseSubjects(data: any): Subject[] {
  const subjectCommissions = data.courseCommissions.courseCommission;
  const subjects: Subject[] = [];
  for (const subjectCommission of subjectCommissions) {

    // If subject does not exist, we create it
    if (subjects.find(subject => subject.code === subjectCommission.subjectCode) === undefined) {
      subjects.push(
        new Subject(
          subjectCommission.subjectName,
          subjectCommission.subjectCode
        )
      );
    }

    // Then, we create the new commission found, for which it is necessary first to create
    // all timeblocks... If timeblocks exist
    if (subjectCommission.hasOwnProperty('courseCommissionTimes')) {
      const timeblocks: Timeblock[] = [];
      if (Array.isArray(subjectCommission.courseCommissionTimes)) {
        for (const courseCommissionTime of subjectCommission.courseCommissionTimes) {
          timeblocks.push(parseTimeblock(courseCommissionTime));
        }
      } else {
        timeblocks.push(parseTimeblock(subjectCommission.courseCommissionTimes));
      }

      const newCommission: Commission = new Commission(
        subjectCommission.commissionName,
        subjectCommission.subjectCode,
        timeblocks,
        subjectCommission.professors
      );

      // Adding the new commission
      subjects.find(subject => subject.code === subjectCommission.subjectCode)
              .addCommission(newCommission);
    }
  }

  return subjects;
}

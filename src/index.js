/* @flow */
/* calculateConsent
=============================
  priorities are all priorities for a person
  votes is the number of votes to be allocated in this election
*/

type PRIORITY_TYPE = 'VISION' | 'GOAL' | 'MISSION';

type Vision = {
  id: string
};

type Goal = {
  id: string,
  vision: Vision
};

type Mission = {
  id: string,
  vision: Vision
};

type Priority = {
  id: string,
  type: PRIORITY_TYPE,
  value: number,
  vision: Vision
};

type ConsentMap = {
  [string]: number
};

const visionFilter = p => p.type.toUpperCase() === 'VISION';
const goalFilter = p => p.type.toUpperCase() === 'GOAL';
const missionFilter = p => p.type.toUpperCase() === 'MISSION';
// const policyFilter = p => p.type.toUpperCase() === 'POLICY';
let allocation;

// simple function used to get total priorites set
const sum = (a, b) => {
  return a + b.value;
};

const visionConsent = (priorities: Array<Priority>): ConsentMap => {
  const total = priorities.reduce(sum, 0);
  let tally = {};
  priorities.forEach(p => {
    tally[p.vision.id] = allocation * (p.value / total);
  });
  return tally;
};

const consent = (visionConsent, priorities: Array<Priority>) => {
  const visions = Object.keys(visionConsent);

  // for each vision in visionConsent, get consent for amount of vision consent
  let objectConsent = {};
  visions.forEach(visionId => {
    // get the type of this priority
    // get the priorities of this type for this vision
    const objects = priorities.filter(p => {
      return p[p.type.toLowerCase()].vision.id === visionId;
    });

    //if there are any priorities for this vision
    if (objects.length) {
      //get the total of the priorities
      const total = objects.reduce(sum, 0);

      // of the total priority for a vision, 20 percent goes to goals and 80
      // percent goes to missions
      const goalFactor = 0.2
      const missionFactor = 0.8

      let tally = {};


      // calculate the consent for the objects of this vision
      objects.forEach(p => {
        let factor =1
        if (p.type === 'GOAL') {
          factor = goalFactor
        }
        if (p.type === 'MISSION') {
          factor = missionFactor
        }
        const priorityValue = visionConsent[visionId] * factor * (p.value / total);
        tally[p[p.type.toLowerCase()].id] = priorityValue;
      });

      objectConsent = Object.assign({}, objectConsent, tally);
    }
  });
  return objectConsent;
};

const calculateConsent = (priorities: Array<Priority>, votes: number = 18) => {
  allocation = votes;
  const visionPriorities = priorities.filter(visionFilter);
  const goalPriorities = priorities.filter(goalFilter);
  const missionPriorities = priorities.filter(missionFilter);

  const visions = visionConsent(visionPriorities);

  const goals = consent(visions, goalPriorities);

  const missions = consent(visions, missionPriorities);

  const finalConsent = Object.assign({}, visions, goals, missions);
  return finalConsent;
};

export default calculateConsent;

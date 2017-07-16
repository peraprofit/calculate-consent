'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/* calculateConsent
=============================
  priorities are all priorities for a person
  votes is the number of votes to be allocated in this election
*/

const visionFilter = p => p.type.toUpperCase() === 'VISION';
const goalFilter = p => p.type.toUpperCase() === 'GOAL';
const missionFilter = p => p.type.toUpperCase() === 'MISSION';
// const policyFilter = p => p.type.toUpperCase() === 'POLICY';
let allocation;

// simple function used to get total priorites set
const sum = (a, b) => {
  return a + b.value;
};

const visionConsent = priorities => {
  const total = priorities.reduce(sum, 0);
  let tally = {};
  priorities.forEach(p => {
    tally[p.vision.id] = allocation * (p.value / total);
  });
  return tally;
};

const consent = (visionConsent, priorities) => {
  const visions = Object.keys(visionConsent);
  // for each vision in visionConsent, get consent for amount of vision consent
  let objectConsent = {};
  visions.forEach(visionId => {
    // get the type of this priority

    // get the priorities of this type for this vision
    const objects = priorities.filter(p => {
      p[p.type.toLowerCase()].vision.id === visionId;
    });
    //if there are any priorities for this vision
    if (objects.length) {
      //get the total of the priorities
      const total = objects.reduce(sum, 0);
      let tally = {};

      // calculate the consent for the objects of this vision
      objects.forEach(p => {
        const priorityValue = visionConsent[visionId] * (p.value / total);
        tally[p[p.type.toLowerCase()].id] = priorityValue;
      });
      objectConsent = Object.assign(objectConsent, tally);
    }
  });
  return objectConsent;
};

const calculateConsent = (priorities, votes = 15) => {
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

exports.default = calculateConsent;
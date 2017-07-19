import calculateConsent from '../src';
import data from './data.json';

test('calculateConsent default to 15 votes', () => {
  const consent = calculateConsent(data.priorities);
  expect(consent).toMatchSnapshot();
});

test('calculateConsent for 30 votes', () => {
  const consent = calculateConsent(data.priorities, 30);
  expect(consent).toMatchSnapshot();
});

test('calculateConsent returns 24 consent entries', () => {
  const consent = calculateConsent(data.priorities, 44);
  expect(Object.keys(consent).length).toBe(24);
});

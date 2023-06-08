import _ from 'lodash';
import { Chance } from 'chance';
const obj = {
  a: 1,
  b: '2',
  c: 3,
  'dash-key': 'john'
};

// console.log(obj);
const chance = new Chance();
const omit = _.omit(obj, ['c']);
console.log(chance.cc_type().toUpperCase());
// console.log(obj === omit);

// console.log(obj, omit);

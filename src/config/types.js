import {
  is,
  isNot,
  contains,
  notContain,
  beginsWith,
  endsWith,
  isBetween,
  isGreaterThan,
  isLessThan,
  inLast,
  notInLast,
  isEmpty,
  isNotEmpty,
  notEqual,
  equal,
  hasField
} from './operators'

export default {
  text: [equal, notEqual, contains, notContain, beginsWith, endsWith],
  number: [is, isNot, isGreaterThan, isLessThan, isBetween],
  cmd: [is],
  json: [equal, notEqual, contains, notContain, beginsWith, endsWith, hasField],
  date: [is, isNot, inLast, notInLast, isBetween],
  array: [isEmpty, isNotEmpty]
}
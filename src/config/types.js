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
  isNotEmpty
} from './operators'

export default {
  text: [is, isNot, contains, notContain, beginsWith, endsWith],
  number: [is, isNot, isGreaterThan, isLessThan, isBetween],
  cmd: [is],
  date: [is, isNot, inLast, notInLast, isBetween],
  array: [isEmpty, isNotEmpty]
}
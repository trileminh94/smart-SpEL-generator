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
  hasField,
  notHasField,
  notNull,
  isNull
} from './operators'

export default {
  text: [equal, notEqual, contains, notContain, beginsWith, endsWith],
  number: [is, isNot, isGreaterThan, isLessThan, isBetween],
  cmd: [is],
  json: [equal, notEqual, contains, notContain, beginsWith, endsWith, hasField, notHasField],
  date: [is, isNot, inLast, notInLast, isBetween],
  array: [isEmpty, isNotEmpty],
  column: [is, isNot, notNull, isNull]
}
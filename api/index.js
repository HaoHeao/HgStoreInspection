/* 全局接口 */
const global = require('./global.js')

/* 卖场巡检 */
const store = require('./store.js')

/* 计划巡检 */
const plan = require('./plan.js')

/* 会议室预约 */
const meeting = require('./meeting.js')

/* 店面抽盘 */
const spotcheck = require('./spotcheck.js')

export default Object.assign(global, store, plan, meeting, spotcheck);

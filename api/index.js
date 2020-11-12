/* 全局接口 */
const global = require('./global.js')

/* 首页接口 */
const layout = require('./layout.js')

/* 卖场巡检 */
const store = require('./store.js')

/* 计划巡检(包含巡检整改、巡检复核接口) */
const plan = require('./plan.js')

/* 会议室预约 */
const meeting = require('./meeting.js')

/* 店面抽盘 */
const spotcheck = require('./spotcheck.js')

export default Object.assign(global, layout, store, plan, meeting, spotcheck);

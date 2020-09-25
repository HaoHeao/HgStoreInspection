/* 计划巡检 */
const plan = require('./plan.js')
/* 会议室预约 */
const meeting = require('./meeting.js')
/* 店面抽盘 */
const spotcheck = require('./spotcheck.js')
/* 考核项目 */
const assessment = require('./assessment.js')
export default Object.assign(plan, meeting, spotcheck, assessment);

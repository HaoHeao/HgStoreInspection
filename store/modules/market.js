const moment = require('@/util/moment.js');
// 卖场巡检参数设置
let config = {
    pagesize: 20
}

export default {
    state: {
        marketDeptList: [],
        marketUserList: [],
        // 问题页筛选
        filterQuestion: {
            usernumber: "",
            sdate: moment(new Date(moment(new Date()).date.getTime() - 604800000)).format('YYYY-MM-DD'),
            edate: moment(new Date()).format('YYYY-MM-DD'),
            status: 0,
            senddpetid: [],
            inspectioncode: "",
            deptSelect: [],
            pagesize: config.pagesize,
            pageindex: 1
        },
        // 全部页筛选
        filterAll: {
            usernumber: "",
            sdate: moment(new Date(moment(new Date()).date.getTime() - 604800000)).format('YYYY-MM-DD'),
            edate: moment(new Date()).format('YYYY-MM-DD'),
            status: 0,
            senddpetid: [],
            inspectioncode: "",
            deptSelect: [],
            pagesize: config.pagesize,
            pageindex: 1
        },
        // 最近页筛选
        filterNear: {
            usernumber: "",
            sdate: moment(new Date(moment(new Date()).date.getTime() - 2592000000)).format('YYYY-MM-DD'),
            edate: moment(new Date()).format('YYYY-MM-DD'),
            status: 0,
            senddpetid: [],
            inspectioncode: "",
            deptSelect: [],
            pagesize: config.pagesize,
            pageindex: 1
        },
        // 卖场巡检添加巡检记录
        addMarket: {
            departmentList: [],
            person: [],
        }
    },
    mutations: {
        setMarketDeptList(state, data) {
            state.marketDeptList = data;
        },
        setMarketUserList(state, data) {
            state.marketUserList = data;
        },
        // 问题页筛选
        setFilterQuestion(state, data) {
            state.filterQuestion = data;
        },
        // 全部页筛选
        setFilterAll(state, data) {
            state.filterAll = data;
        },
        // 最近页筛选
        setFilterNear(state, data) {
            state.filterNear = data;
        },
        // 添加页部门
        setAddDepart(state, data) {
            state.addMarket.departmentList = data;
        },
        // 添加页人员
        setAddPerson(state, data) {
            state.addMarket.person = data;
        },
        // 添加页人员、部门
        setAddMarket(state, data) {
            state.addMarket = data;
        },
    }
}

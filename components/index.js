import uniPopup from '@/components/uni-popup/uni-popup.vue'
import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
const installComponent = {

	install: function(Vue) {

		Vue.component('uni-popup', uniPopup)
		Vue.component('haoheao-scroll', haoheaoScroll)

	}

}
export default installComponent

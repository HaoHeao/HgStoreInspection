import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
import popup from '@/components/uni-popup/uni-popup.vue'

const installComponent = {

	install: function(Vue) {

		Vue.component('haoheaoScroll', haoheaoScroll)
		Vue.component('popup', popup)

	}

}
export default installComponent

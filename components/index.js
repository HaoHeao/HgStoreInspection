import popup from '@/components/uni-popup/uni-popup.vue'
import haoheaoScroll from '@/components/haoheao-scroll/haoheao-scroll.vue'
console.log(popup)
const installComponent = {

	install: function(Vue) {

		Vue.component('popup', popup)
		Vue.component('haoheaoScroll', haoheaoScroll)

	}

}
export default installComponent

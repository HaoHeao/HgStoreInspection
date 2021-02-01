// 匹配数字和字母
let numberLetter = (str) => {
	return str.toString().replace(/[^a-zA-Z0-9]/g, '')
}


export {
	// 匹配数字和字母
	numberLetter
}

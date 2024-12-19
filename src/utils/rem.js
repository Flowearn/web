/**
 * 描述：修改html的基准font-size数值
 * @authorchenhua
 * @date 2022/2/28
 */

// rem等比适配配置文件
// 基准大小
const baseSize = 19.2
// 设置 rem 函数
function setRem() {
	// 当前页面宽度相对于 375宽的缩放比例，可根据自己需要修改(蓝湖都是375的设计图)。
	// clientWidth / 375 相对于屏幕大小的适配
	// 再除以 3.75 相当于可以直接写设计图的尺寸，单位换成 rem
	const scale = document.documentElement.clientWidth / 1920 / 19.2
	// 设置页面根节点字体大小放大比例，可根据实际业务需求调整
	document.documentElement.style.fontSize = baseSize * scale + "px"
}

// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
	setRem()
}

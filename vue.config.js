
const path = require("path");
 
function resolve(dir) {
  return path.join(__dirname, dir);
}
console.log(111, resolve('./'))
module.exports = {
	// 配置路径别名
	configureWebpack: {
		devServer: {
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true
		},
		resolve: {
			alias: {
				'@': resolve('/')
			}
		}
	},
	//productionSourceMap: false,
}

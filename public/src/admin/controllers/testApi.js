angular.module('apix').controller('ApiTestCtrl', ApiTestCtrl);

ApiTestCtrl.$inject = ['$stateParams', 'UtilService', 'ApixService'];

function ApiTestCtrl($stateParams, UtilService, ApixService) {

	var vm = this;

	////////////////////////// variables bind to view ///////////////////////////

	vm.api = {};	// api对象，通过id查得详情
	vm.formData = {};	// 页面数据

	// code-mirror 配置信息
	vm.cmOption = {
		theme: 'paraiso-dark',
		readOnly: true,
		mode: {name: "javascript", json: true}
	};

	// 模拟请求的tab页
	vm.formData.tabs = [{
		name: 'Params'
	},{
		name: 'Headers'
	},{
		name: 'Body'
	}];

	vm.selectTab = selectTab;	// 选择tab
	vm.add = add;	// 添加一条param
	vm.remove = remove;	// 删除一条param
	vm.send = send;	// 发送请求
    vm.clear = clear;   // 清除url
	vm.formatResp = formatResp;	// 格式化response data

	////////////////////////// functions bind to view ///////////////////////////

	function selectTab(tab) {
		vm.formData.selectedTab = tab;
	}

	function add(arr) {
		arr.push({
			key: '',
			value: ''
		})
	}

	function remove(arr, index) {
		arr.splice(index, 1);
		if(arr.length == 0){
			add(arr);
		}
	}

    function clear() {
        vm.formData.url = '';
    }

	function send() {
        UtilService.send(vm.formData).then(function(res){
            vm.formData.output = res;
        })
	}

	function formatResp() {
		vm.formData.output = UtilService.format(vm.formData.output);
	}

	////////////////////////////// inner functions /////////////////////////////

	function initParams() {
		vm.formData.selectedTab = vm.formData.tabs[0];	// 初始tab页为params
		vm.formData.method = 1;	// 初始方法为get
		vm.formData.params = [{key: '', value: ''}];	// request params
		vm.formData.headers = [{key: '', value: ''}];	// request headers
		vm.formData.body = [{key: '', value: ''}];	// request body
		vm.formData.output = '';
	}

	// 初始化，根据apiId查询api详情
	function init(){
		initParams();
		ApixService.getApi($stateParams.apiId, function(res){
			vm.api = res;
		}, function(err){
			console.log(err);
		})
	}

	init();
}

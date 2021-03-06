angular.module('apix').controller('MockApiCtrl', MockApiCtrl);

MockApiCtrl.$inject = ['$stateParams', 'UtilService', 'ApixService'];

function MockApiCtrl($stateParams, UtilService, ApixService) {

	var vm = this;

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

	vm.selectApi = selectApi;	// 选择api

	vm.selectTab = selectTab;	// 选择tab
	vm.add = add;	// 添加一条param
	vm.remove = remove;	// 删除一条param
	vm.send = send;	// 发送请求
    vm.clear = clear;   // 清除url
	vm.formatResp = formatResp;	// 格式化response data

	////////////////////////// functions bind to view ///////////////////////////

	function selectApi(api) {
		vm.activeApi = api;
		vm.formData.method = api.method;
		vm.formData.url = api.url;
		initParams();
	}

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
		vm.formData.params = [{key: '', value: ''}];	// request params
		vm.formData.headers = [{key: '', value: ''}];	// request headers
		vm.formData.body = [{key: '', value: ''}];	// request body
		vm.formData.output = '';
	}

	function init() {
		initParams();
		vm.formData.groupName = $stateParams.groupName;
		var params = {
			system: $stateParams.sysName,
			name: $stateParams.groupName
		}
		ApixService.getGroup(params, function(res){
			vm.mockApis = res.mockApis;
			vm.activeApi = vm.mockApis[0];
			selectApi(vm.activeApi);
		}, function(err){
			console.log(err);
		})
	}

	init();
}
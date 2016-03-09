// JavaScript Document
var schedule_data = [];
var schedule_detail_data = [];

angular.module('starter.controllers', [])

.controller('SignInCtrl', function($scope,$state,$http,$ionicPopup,$rootScope) {
	var userid = localStorage.getItem("userid");
	var username = localStorage.getItem("localusername");
	
	var logoutyn = localStorage.getItem("logoutyn");
	console.log(username);
	console.log(logoutyn);
	if((username != null) && (username != -1) && (logoutyn != 1)){
		var password = localStorage.getItem("localpassword");
		var data_parameters = "username="+username+ "&password="+password;
		$http.post("http://"+globalip+"/userauth",data_parameters, {
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status == "Y"){
				localStorage.setItem("therm_online",response[0].online);
				$state.go('eventmenu.checkin');
			}
		});
	}
	else{
		if((localStorage.getItem("localusername") != null) && (localStorage.getItem("localpassword") != null)){
			var uname = localStorage.getItem("localusername");
			var upassword = localStorage.getItem("localpassword");
			$scope.user = {
				username: uname,
				password : upassword,
				remember : true
			}
		}
		else{
			$scope.user = {
				username: '',
				password : '',
				remember : false
			};
		}
		$scope.signIn = function(user) {
			var username = user.username;
			var password = user.password;
			var check = user.remember;
			
			if(typeof username === "undefined" || typeof password === "undefined" || username == "" || password == ""){
				$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
			}
			else{
				/*var data_parameters = "username="+username+ "&password="+password;
				$http.post("http://"+globalip+"/userauth",data_parameters, {
					headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					if(response[0].status == "Y"){
						/*if(check){
							localStorage.setItem("localpassword",password);
						}*/
						/*localStorage.setItem("localpassword",password);
						localStorage.setItem("localusername",username);
						localStorage.setItem("userid", response[0].user_id);
						localStorage.setItem("slocid",response[0].sloc_id);
						localStorage.setItem("orgid", response[0].org_id);
						localStorage.setItem("thermame",response[0].thermostat_name);
						localStorage.setItem("thermid",response[0].therm_id);
						localStorage.setItem("token",response[0].token);
						localStorage.setItem("therm_online",response[0].online);
						$rootScope.$broadcast('eventThermname',{thermname:response[0].thermostat_name,thermid:response[0].therm_id});
						
						$state.go('eventmenu.checkin');
					}
					else{
						$ionicPopup.show({
						  template: '',
						  title: 'Username or password is wrong',
						  scope: $scope,
						  buttons: [
							{
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
						})
					}
				});*/
				$state.go('tabs.home');
			}
		};
	}
})

.controller('forgotCtrl', function($scope,$state,$http,$ionicPopup){
	$scope.user = {email: ''};
	$scope.forget = function(user) {
		var email = user.email;
		var flag = "A";
		
		if(email != ""){
			var data_parameters = "slocid="+0+ "&orgid="+0+ "&id="+0+ "&emailid="+email+ "&flag="+flag;
			$http.post("http://"+globalip+"/email_exists",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "N"){
					$ionicPopup.show({
					  template: '',
					  title: 'Email address not registered.',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}else{
					sendmail(email);
				}
			});
		}
		else{
			$ionicPopup.show({
			  template: '',
			  title: 'Please enter email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
	}
	
	function sendmail(email){
		var data_parameters = "emailid="+email;
		$http.post("http://"+globalip+"/forgot_password",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response){
			$scope.user = {email: ''};
			$ionicPopup.show({
			  template: '',
			  title: 'An email has been sent to the email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive',
				  onTap:function(e){
            			$state.go('signin');
       				}
				},
			  ]
			})
			
		});
	}
})

.controller('HomeTabCtrl', function($scope,$state) {
	//======================================Initiallize app=================================================
	app.initialize();

	//======================================initialize variables ==============================================================================
	$scope.data = {};
	$scope.data.pickup1 = 1;
	$scope.data.pickup2 = 1;
	$scope.data.pickup3 = 1;
	$scope.data.pickup4 = 1;
	$scope.data.status1 = false;
	$scope.data.status2 = false;
	$scope.data.status3 = false;
	$scope.data.status4 = false;
	
	//=====================================change status value================================================================================
	$scope.changestatus = function(device,status,intensity){
		app.sendData(device,status,intensity);
	};
	
	
	$scope.doLogout = function() {
		$state.go('signin');
		setTimeout(function () {
			window.location.reload(1);
		},10); 
  	};
})

.controller('settingCTRL', function($scope) {
	
})

.controller('scheduleCTRL', function($scope,$rootScope,$ionicPopup,$ionicModal,popupService,$cordovaDatePicker,$stateParams) {
	//localStorage.setItem("schedule_list","");
	//localStorage.setItem("schedule_details_data","");
	var schedule_Edit_index = 0;
	var response;
	$scope.data = {};
	$scope.data.schedulename = "";
	
	//===================================================save schedule_name======================================================================
	$scope.saveschedule = function(name){
		if(name != ""){
			if(schedule_data != ""){
				var hasMatch = false;
				var templist = JSON.stringify(schedule_data);
				templist = JSON.parse(templist);
				for (var index = 0; index < templist.length; index++) {
					if(templist[index].sname == name){
						hasMatch = true;
						break;
					}
				}
			}
			
			if(!hasMatch){
				schedule_data.push({sname:name});
				console.log(schedule_data);
				$scope.data.schedulename = "";
				response = JSON.stringify(schedule_data);
				localStorage.setItem("schedule_list",response); 
				$rootScope.$broadcast('schedule_list',response);
			}
			else{
				popupService.popup("Name already exists");
			}
		}
		else{
			popupService.popup("Please fill all fields");
		}
	}
	
	//===============================================reload schedule list=========================================================================
	$rootScope.$on('schedule_list', function(event, args) {
		$scope.response = JSON.parse(args);
	})
	
	//==============================================load schedule at first time ==================================================================
	if(localStorage.getItem("schedule_list") != ""){
		var response = JSON.parse(localStorage.getItem("schedule_list"));
		for(var i in response)schedule_data.push(response[i]);
		$scope.response = response;
	}
})

.controller('scheduledetailCTRL', function($scope,$ionicPopup,$ionicModal,popupService,$cordovaDatePicker,$stateParams,$rootScope) {
	var time1 = 0;
	var time2 = 0;
	var act_time1 = 0;
	var act_time2 = 0;
	
	$scope.onItemDelete = function(item) {
		schedule_detail_data.splice($scope.response.indexOf(item),1);
		var response_data = JSON.stringify(schedule_detail_data);
		localStorage.setItem("schedule_details_data",response_data);
		$rootScope.$broadcast('schedule_detail_list',response_data);
 	};
	
	$scope.onItemEdit = function(item) {
		schedule_Edit_index = $scope.response.indexOf(item);
		console.log($scope.response.indexOf(item));
		$scope.scheduleEditmodal.show();
		time1 = item.stime;
		time2 = item.etime;
		act_time1 = item.act_time;
		act_time2 = item.act_etime;
		$scope.slots = [
			{epochTime: item.act_time, step: 1, format: 12},
			{epochTime: item.act_etime, step: 1, format: 12}
		];
	
		$scope.user = {};
		$scope.user.device1status = item.device1S;
		$scope.user.device1intensity = item.device1I;
		
		$scope.user.device2status = item.device2S;
		$scope.user.device2intensity = item.device2I;
		
		$scope.user.device3status = item.device3S;
		$scope.user.device3intensity = item.device3I;
		
		$scope.user.device4status = item.device4S;
		$scope.user.device4intensity = item.device4I;
	};
	
	$scope.updatescheduledetail = function(user) {
		var response1 = JSON.stringify(schedule_detail_data);
		response1 = JSON.parse(response1);
				
		var flag = false;
		for(var i in response1){
			if((response1[i].sname == $stateParams.schedulename) && (i != schedule_Edit_index)){
				if((act_time1 >= response1[i].act_time) && (act_time1 < response1[i].act_etime)){
					flag = true;
				}
				else if((act_time2 > response1[i].act_time) && (act_time2 <= response1[i].act_etime)){
					flag = true;
				}
				else flag = false;
			}
			if(flag){
				console.log("true");
				break
			};
		}
			
		if(!flag){
			schedule_detail_data.splice(schedule_Edit_index,1,{sname:$stateParams.schedulename,act_time:act_time1,act_etime:act_time2,stime:time1,etime:time2,device1S:user.device1status,device1I:user.device1intensity,device2S:user.device2status,device2I:user.device2intensity,device3S:user.device3status,device3I:user.device3intensity,device4S:user.device4status,device4I:user.device4intensity});
			var response_data = JSON.stringify(schedule_detail_data);
			console.log(response_data);
			localStorage.setItem("schedule_details_data",response_data);
			$rootScope.$broadcast('schedule_detail_list',response_data);
			$scope.scheduleEditmodal.hide();
			}
		else {
			console.log("els");
			popupService.popup("Time already exists");
		}
	};
	
	//=============================Initilize variales =============================================================================================
	$scope.user = {};
	$scope.user.device1status = 0;
	$scope.user.device1intensity = 1;
	
	$scope.user.device2status = 0;
	$scope.user.device2intensity = 1;
	
	$scope.user.device3status = 0;
	$scope.user.device3intensity = 1;
	
	$scope.user.device4status = 0;
	$scope.user.device4intensity = 1;
	
	//===============================code for ionic model ===========================================================================================
	$ionicModal.fromTemplateUrl('tabs/scheduledetailmodal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.scheduledetailmodal = modal;
	});
	
	//===============================code for edit ionic model ===========================================================================================
	$ionicModal.fromTemplateUrl('tabs/scheduleEditmodal.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.scheduleEditmodal = modal;
	});
	
	//===============================code for timepicker=============================================================================================
	$scope.slots = [
		{epochTime: 0, step: 1, format: 12},
		{epochTime: 0, step: 1, format: 12}
	];
	console.log();
	$scope.timePickerCallback = function (val) {
		if (typeof (val) === 'undefined'){
			console.log('Time not selected');
		} else {
			act_time1 = val;
			time1 = epochParser(val,'time');
			console.log('Selected time is : ',act_time1);
		}
	};
	$scope.timePickerCallback1 = function (val) {
		if (typeof (val) === 'undefined'){
			console.log('Time not selected');
		} else {
			act_time2 = val;
			time2 = epochParser(val,'time');
			console.log('Selected time is 2 : ',act_time2);
		}
	};
	
	//===============================save schedule detail =================================================================================================
	$scope.savescheduledetail = function(user){
		if(act_time1 != 0 || act_time2 != 0){
			if(act_time1 > act_time2){
				popupService.popup("Start time should be less than End time");
			}
			else{
				var response1 = JSON.stringify(schedule_detail_data);
				response1 = JSON.parse(response1);
				
				if(response1.length > 0){
					var flag = false;
					var pflag = false;
					for(var i in response1){
						if(response1[i].sname == $stateParams.schedulename){
							pflag = true;
							if((act_time1 >= response1[i].act_time) && (act_time1 < response1[i].act_etime)){
								flag = true;
							}
							else if((act_time2 > response1[i].act_time) && (act_time2 <= response1[i].act_etime)){
								flag = true;
							}
							else flag = false;
						}
						else{
							if(!pflag)pflag = false;
						}
						if(flag){
							console.log("true");
							break
						};
					}
					
					if(pflag){
						if(!flag){
							schedule_detail_data.push({sname:$stateParams.schedulename,act_time:act_time1,act_etime:act_time2,stime:time1,etime:time2,device1S:user.device1status,device1I:user.device1intensity,device2S:user.device2status,device2I:user.device2intensity,device3S:user.device3status,device3I:user.device3intensity,device4S:user.device4status,device4I:user.device4intensity});
							var response_data = JSON.stringify(schedule_detail_data);
							console.log(response_data);
							localStorage.setItem("schedule_details_data",response_data);
							$scope.scheduledetailmodal.hide();
							$rootScope.$broadcast('schedule_detail_list',response_data);
						}
						else {
							console.log("els");
							popupService.popup("Time already exists");
						}
					}
					else{
						schedule_detail_data.push({sname:$stateParams.schedulename,act_time:act_time1,act_etime:act_time2,stime:time1,etime:time2,device1S:user.device1status,device1I:user.device1intensity,device2S:user.device2status,device2I:user.device2intensity,device3S:user.device3status,device3I:user.device3intensity,device4S:user.device4status,device4I:user.device4intensity});
						var response_data = JSON.stringify(schedule_detail_data);
						console.log(response_data);
						localStorage.setItem("schedule_details_data",response_data);
						$scope.scheduledetailmodal.hide();
						$rootScope.$broadcast('schedule_detail_list',response_data);
					}
				}else{
					schedule_detail_data.push({sname:$stateParams.schedulename,act_time:act_time1,act_etime:act_time2,stime:time1,etime:time2,device1S:user.device1status,device1I:user.device1intensity,device2S:user.device2status,device2I:user.device2intensity,device3S:user.device3status,device3I:user.device3intensity,device4S:user.device4status,device4I:user.device4intensity});
					var response_data = JSON.stringify(schedule_detail_data);
					localStorage.setItem("schedule_details_data",response_data);
					$scope.scheduledetailmodal.hide();
					$rootScope.$broadcast('schedule_detail_list',response_data);
					console.log(response_data);
				}// close else of response1.length > 0
			}// close else of atime is grater
		}
		else popupService.popup("Please fill all fields");//close else of time1 != 0 || time2 != 0
	};
	
	//===============================reload schedule detail =================================================================================================
	$rootScope.$on('schedule_detail_list', function(event, args) {
		var response = JSON.parse(args);
		$scope.shdresponse = {sname : $stateParams.schedulename};
		$scope.response = response;
	})
	
	//===============================load schedule detail =================================================================================================
	if(localStorage.getItem("schedule_details_data") != ""){
		var response = JSON.parse(localStorage.getItem("schedule_details_data"));
		var flag1 = 1;
		var arraydetail = JSON.stringify(schedule_detail_data);
		arraydetail = JSON.parse(arraydetail);
		if(arraydetail.length > 0)flag1 = 0;
		else flag1 = 1;
		for(var i in response){if(flag1 == 1)schedule_detail_data.push(response[i]);}
		
		$scope.shdresponse = {sname : $stateParams.schedulename};
		$scope.response = response;
	}
});

// function to conver miliseconds to time
function prependZero(param) {
	if (String(param).length < 2) {
		return "0" + String(param);
	}
	return param;
}

function epochParser(val, opType) {
	if (val === null) {
		return "00:00";
	} else {
		var meridian = ['AM', 'PM'];

		if (opType === 'time') {
			var hours = parseInt(val / 3600);
			var minutes = (val / 60) % 60;
			var hoursRes = hours > 12 ? (hours - 12) : hours;

			var currentMeridian = meridian[parseInt(hours / 12)];

			return (prependZero(hoursRes) + ":" + prependZero(minutes) + " " + currentMeridian);
		}
	}
}
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
				$state.go('tabs.home');
			}
		});
		$state.go('tabs.home');
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
				var method = "login";
				$http.get(globalip+"method="+method, {params: {login: username,password: password}})
				.success(function (data,status) {
				
					if(data.status == "ok"){
						console.log(data);
						token = data.data.token;
						console.log(token);
						$state.go('tabs.home');
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
				 });
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

.controller('HomeTabCtrl', function($scope,$state,$http,$ionicPopup,$rootScope) {
	
	var method = "device-list";
			$http.get(globalip+"method="+method, {params: {session_token: token}})
			.success(function (data,status) {
			
				if(data.status == "ok"){
					console.log(data);
					token = data.data.token;
					console.log(token);
					$state.go('tabs.home');
				}
	});
	
	$scope.doLogout = function() {
		$state.go('signin');
		setTimeout(function () {
			window.location.reload(1);
		},10); 
  	};
})

.controller('settingCTRL', function($scope,$ionicLoading,$http,$stateParams,$rootScope) {
	
	
	
	$scope.mapCreated = function(map) {
		$scope.map = map;
	};
	
	$scope.centerOnMe = function () {
		console.log("Centering");
		if (!$scope.map) {
		  return;
		}
	
		$scope.loading = $ionicLoading.show({
		  content: 'Getting current location...',
		  showBackdrop: false
		});
	
		navigator.geolocation.getCurrentPosition(function (pos) {
		  console.log('Got pos', pos);
		  $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
		  $scope.loading.hide();
		}, function (error) {
		  alert('Unable to get location: ' + error.message);
		});
	};
})

.controller('scheduleCTRL', function($scope,$rootScope,$ionicPopup,$ionicModal,popupService,$stateParams) {
	//localStorage.setItem("schedule_list","");
	
})

.controller('scheduledetailCTRL', function($scope,$ionicPopup,$ionicModal,popupService,$stateParams,$rootScope) {
	
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
angular.module('ionicApp', ['ionic','ngCordova','starter.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  	.state('signin', {
      url: "/sign-in",
      templateUrl: "templates/sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
		  url: "/forgot-password",
		  templateUrl: "templates/forgot-password.html",
		  controller: 'forgotCtrl'
    })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
		}
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
	.state('tabs.setting', {
      url: "/setting",
      views: {
        'setting-tab': {
          templateUrl: "templates/setting.html",
		  controller: 'settingCTRL'
        }
      }
    })
	.state('tabs.schedule', {
      url: "/schedule",
      views: {
        'setting-tab' :{
          templateUrl: "templates/schedule.html",
		  controller: 'scheduleCTRL'
		}
      }
    })
	.state('tabs.devicesetting', {
      url: "/devicesetting",
      views: {
        'setting-tab' :{
          templateUrl: "templates/devicesetting.html"
		}
      }
    })
	.state('tabs.scheduledetail', {
		url: "/scheduledetail/:schedulename",
		views: {
		  'setting-tab': {
			templateUrl: "templates/scheduledetail.html",
			controller: 'scheduledetailCTRL'
		  }
		}
	 })
	 .state('tabs.scan', {
		url: "/scan",
		views: {
		  'scan-tab': {
				templateUrl: "templates/scan.html"
			}
		}
	 })
	 .state('tabs.paired', {
		url: "/paired",
		views: {
		  'paired-tab': {
			templateUrl: "templates/paired.html"
			}
		}
	 })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
	.state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "templates/contact.html"
        }
      }
    });

	$urlRouterProvider.otherwise("/sign-in");
})

.directive('standardTimeMeridian', function () {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			etime: '=etime'
		},
		template: "<strong>{{stime}}</strong>",
		link: function (scope, elem, attrs) {

			scope.stime = epochParser(scope.etime, 'time');

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

			scope.$watch('etime', function (newValue, oldValue) {
				scope.stime = epochParser(scope.etime, 'time');
			});
		}
	};
})

.service('popupService', function($rootScope,$ionicPopup){
	this.popup = function(text){
		$ionicPopup.show({
		  template: '',
		  title: text,
		  buttons: [
			{ 
			  text: 'Ok',
			  type: 'button-assertive'
			},
		  ]
		})
	}
})


//Define an angular module for our app
var App = angular.module('App', ["ngRoute","ngSanitize","ngTouch"]).run(function( $location,$rootScope,$timeout,ProcessService) {
	 $rootScope.GATEWAYURL = "https://hybridapp.payroll2u.com/";
  // $rootScope.GATEWAYURL = "https://uatsvrhybrid3.payroll2u.com/"
	// $rootScope.GATEWAYURL = "https://devsvrhybrid.payroll2u.com/"
	// $rootScope.GATEWAYURL = "https://uatsvrhybrid.payroll2u.com/"
 // $rootScope.GATEWAYURL = "https://testhybridapp.payroll2u.com/"
 //   $rootScope.GATEWAYURL = "https://uatsvrhybrid2.payroll2u.com/"
  document.addEventListener("deviceready", function (evt) {
    // if(typeof window.ga !== undefined) {
    //   //window.ga.startTrackerWithId('UA-45746194-7', 30)
    // } else {
    //   console.log("Google Analytics Unavailable");
    // }
  }, false);

	$rootScope.$on('$routeChangeSuccess', function () {
		var checkLocation = $location.path();
		checkLocation  =  checkLocation.slice(1);
   // window.ga && window.ga.trackView(checkLocation);

    if(cordova.plugins.firebase && cordova.plugins.firebase.analytics){
      cordova.plugins.firebase.analytics.logEvent(checkLocation);
    }
		if(checkLocation =="Home" || checkLocation =="Login"){
			$rootScope.checkLocation = "notnav";
			$("#main").height("100%");
		}
		else{
			$rootScope.checkLocation = "havenav";
			$timeout(function () {
		var heightHeader = $("header").innerHeight();
		 var heightNav = $("#quick-link").innerHeight();
		var heightWindow = $rootScope.heightWindow;
		 $("#main").height(heightWindow- heightHeader - heightNav-10);
	 })
		}

	});


$rootScope.isRight = function(menuID){
		var result = false;
		angular.forEach($rootScope.MenuMobile, function(value, key) {
			if(value.Id==menuID){
				result = true;
				return false
			}
		})

		return result;
	}
		 $rootScope.MenuMobile =  $.jStorage.get("MenuMobile");
	$rootScope.processMenu = function(){
	  $rootScope.quickLinks1 =  [
		{menuID:682,title:$rootScope.lang.main.btn.chpass,icon:"ss_change_pass",background:"background-9933cc",dis:false,link:"#profileChangePass"},
		{menuID:699,title:$rootScope.lang.main.btn.leave,icon:"ss_apply_leave",background:"background-6600cc",dis:false,link:"#leaveApply"},
		{menuID:690,title:$rootScope.lang.main.btn.payslip,icon:"ss_view_payslip",background:"background-cc3366",dis:false,link:"#payrollPayslip"}
	  ];


	   angular.forEach( $rootScope.quickLinks1, function(value, key) {
		  if(!$rootScope.isRight(value.menuID)){
			  value.dis = true;
			  value.background="disable";
			  value.icon+="_dis";
			  value.link = "javscript:void(0)";
		  }
	  });

		 $rootScope.quickLinks2 =  [
		 {menuID:709,title:$rootScope.lang.main.btn.overtime,icon:"ss_submit_overtime",background:"background-990000",dis:false,link:"#claimOvertimeApply"},
		{menuID:733,title:$rootScope.lang.main.btn.roster,icon:"ss_view_roster",background:"background-ff9933",dis:false,link:"#tmsRosterEnquiry"},
		{menuID:721,title:$rootScope.lang.main.btn.reim,icon:"ss_submit_expenses",background:"background-88b824",dis:false,link:"#claimReimbursementApply"},
		{menuID:715,title:$rootScope.lang.main.btn.benefit,icon:"ss_submit_medical",background:"background-00a8a9",dis:false,link:"#claimBenefitApply"},

	  ];

	  angular.forEach( $rootScope.quickLinks2, function(value, key) {
		  if(!$rootScope.isRight(value.menuID)){
			  value.dis = true;
			  value.background="disable";
			  value.icon+="_dis";
			  value.link = "javascript:void(0)";
		  }
	  });


	   $rootScope.quickLinks3 = $rootScope.quickLinks1.concat( $rootScope.quickLinks2)
	 }
		if($.jStorage.get("lang")==null){

		ProcessService.ajaxGetLocalSite("lang/lang1.txt").then(function(result) {
			$.jStorage.set("lang",result.data);
			$rootScope.lang =  $.jStorage.get("lang");
			$rootScope.processMenu();
		})
	}
	else{
		$rootScope.lang =  $.jStorage.get("lang");
		 $rootScope.processMenu();
	}





  // get url



})

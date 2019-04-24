App.registerCtrl('myProfileCtrl', function ($scope, $rootScope, ProcessService, $location) {
	
	 $scope.listMenuProfile = [
					{id:682,href:"profileChangePass",icon:"pro682.png",name:$rootScope.lang.myprofile.changePass.tt,description:$rootScope.lang.myprofile.changePass.ct},
					//{id:683,href:"javascript:void(0)", ngClick:"ng-click='comingSoon()'",icon:"pro683.png",name:$rootScope.lang.myprofile.address.tt,description:$rootScope.lang.myprofile.address.ct},
					]	
		$scope.commingSoon = function(){
		window.plugins.toast.showShortBottom($rootScope.lang.myprofile.comingSoon);
		}
		
	processProfileChangePass = function(){				
		$scope.field = {
			CurrPass: "",
			NewPass: "",
			ConfirmNewPass: ""
		};
		//get message rule password
		ProcessService.ajaxGet("Common/GetTextPasswordRole").then(function(result) {
			data  = JSON.parse(result.data);
			$scope.TextPasswordRole= data.Result;
		})
		
		$scope.validation = function () {
			
			if ($scope.field.CurrPass == '') {
				$rootScope.error = {
				result : true,
				message : $rootScope.lang.myprofile.changePass.error.currpass
				};
				return false;
			}
			if ($scope.field.NewPass == '') {
			
				$rootScope.error = {
				result : true,
				message : $rootScope.lang.myprofile.changePass.error.newpass
				};
				
				return false;
			}
			if ($scope.field.ConfirmNewPass == '') {
				$rootScope.error = {
					result : true,
					message : $rootScope.lang.myprofile.changePass.error.cfmpass
				};
				return false;
			}
			if ($scope.field.ConfirmNewPass != $scope.field.NewPass) {
				$rootScope.error = {
					result : true,
					message : $rootScope.lang.myprofile.changePass.error.cfmpassandpassnotsame
				};
				return false;
			}
			return true;
		};
		
		$scope.changePass = function () {
			var param = {
			CurrPass: $scope.field.CurrPass,
			NewPass: $scope.field.NewPass,
			}
			if (!$scope.validation()) {
			return false;
			}
			
			ProcessService.ajaxPost("MyProfileChangePassword/ChangePassword", param).then(function (result) {
			
			objectData = JSON.parse(result.data);
			
			if (objectData.Result == false){
				$rootScope.error = {
				result : true,
				message : objectData.Message
				};
			}
			else
			{
				var message = $rootScope.lang.myprofile.changePass.your_password_has_been_changed;
				$rootScope.success = {
				title:$rootScope.lang.general.successful,
				result : true,
				message : message,
				callBack : function() {
				$rootScope.success = {
				result : false,
				message : "",
			}
				infoLogin = JSON.parse(sessionStorage.getItem('infoLogin'));
				infoLogin.Password = $scope.field.NewPass;
				ProcessService.ajaxPost("login/checklogin",infoLogin).then(function(result) {
					objectData  = JSON.parse(result.data);
					$.jStorage.set("MenuMobile",objectData.MenuMobile);
					$rootScope.MenuMobile =  $.jStorage.get("MenuMobile");
					$rootScope.processMenu();
					$location.path("/myProfile");
				})
			
			}
		}
		
		}
		
		
		})
			
		}
	} // end process profile change pass
	
switch ($location.path()) {

		case "/profileChangePass":
			processProfileChangePass();
			break;
	}

   
});

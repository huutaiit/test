App.registerCtrl('loginCtrl', function($scope,$rootScope,$location,$http,ProcessService,DateTimeService)
{
	var temp = false;
	$scope.PrivateImgFrog =  $.jStorage.get("PrivateImgFrog")!=null?$.jStorage.get("PrivateImgFrog"):"images/n_animal_logo.png";
	 loginField =  $.jStorage.get("loginField");
	 if(loginField!=null){
		   $scope.field = loginField;
		    $scope.field["password"] = ""
	 }
	 $.jStorage.deleteKey("user");
	 $.jStorage.deleteKey("MenuMobile");
	 sessionStorage.removeItem('listLang');

   function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
   $scope.showSelectImage = function(){

	   $(".overlay").show();
	     var _this = $("#select-image");

			$(window).off("resize");
			$(".overlay").show();
			_this.show();
			_this.css({ left: ($(window).width() - _this.width()) / 2, top: ($(window).height() - _this.height()) / 2 });
			input = _this.find("input")
			$(window).resize(function () {
				var top =  ($(window).height() - _this.height()) / 2;
				var left = ($(window).width() - _this.width()) / 2;
				_this.css({ left:left , top:  top});
			});

			return false;
   }
    $scope.getCameraPhoto = function(type){
		destinationType = navigator.camera.DestinationType;
		pictureSource = navigator.camera.PictureSourceType;
		var options = {
			quality : 100,
			allowEdit : true,
			correctOrientation: true,
			destinationType : destinationType.FILE_URI
		};
		if(type==1){
			options.sourceType = pictureSource.SAVEDPHOTOALBUM;
		}
		ProcessService.cameraPhoto(options).then(function(result){
			if(result.status==true){
				ProcessService.createFolder("payroll2u").then(function(result2){
					newFileUri = result2.data.nativeURL;
					date = new Date();
					fileName = "private_img_frog_"+date.getTime();
					ProcessService.moveFile(result.data,fileName,newFileUri).then(function(result3){

						 $.jStorage.set("PrivateImgFrog",result3.data.nativeURL);
						 $scope.PrivateImgFrog =  $.jStorage.get("PrivateImgFrog");



					});
				})

			}
			else
			{
				$rootScope.error = {
					result : true,
					message :$rootScope.lang.general.no_image_selected
				};
			}
			 $(".close-modal").trigger("click");
		})
	}


   $scope.checkValidateForgotPassword = function(){

	   if($scope.field.email == '' || !validateEmail($scope.field.email)){
			$rootScope.error = {
				result : true,
				message :  $rootScope.lang.login.invalid_email_address
			};
			return false;
	   }
	   if($scope.field.org == ''){
			$rootScope.error = {
				result : true,
				message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.org
			};
			return false;
	   }

	   if($scope.field.username == ''){
			$rootScope.error = {
				result : true,
				message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.user_id
			};
			return false;
	   }
	   return true;
   }

   $scope.checkValidateLogin = function(){


	   if($scope.field.org == ''){
			$rootScope.error = {
				result : true,
				message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.org
			};
			return false;
	   }

	   if($scope.field.username == ''){
			$rootScope.error = {
				result : true,
				message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.your_user_id
			};
			return false;
	   }

	   if($scope.field.password == ''){
			$rootScope.error = {
				result : true,
				message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.your_password
			};
			return false;
	   }
	   return true;
   }

    $scope.resetEmail = function(){
		$scope.field.email = "";
	}

    $scope.forGotPassword = function(){

		if( !$scope.checkValidateForgotPassword()){
			return false;
		}
		var param = {
			  OrgName:$scope.field.org,
			  UserId:$scope.field.username,
			  EmailEnter:$scope.field.email

		}


		ProcessService.ajaxPost("login/ForgetPassword",param).then(function(result) {
		  data = JSON.parse(result.data);
		  if(data.Message==true){
			  $rootScope.success = {
				result : true,
				message : $rootScope.lang.login.txt.email_sent,
				callBack : function() {
					$rootScope.success = {
						result : false,
						message : "",
					}
				}
			}
		  }
		  else{
			  var message = "";
			  switch(data.MessageInfo) {

					case "NOKS":
						message = $rootScope.lang.login.user_id_suspended
						break;

					case "InvalidEmail":
						message = $rootScope.lang.login.invalid_email_address
						break;

					case "MissingEmail":
						 message = $rootScope.lang.login.txt.invalid_email_please_contact_your_HR
						 break;

				    default:
        				message = "Invalid Organisation / User ID";
						break;

			  }
			   $rootScope.error = {
				result : true,
				message : message,
			}
		  }

	  })
	}
   $scope.login = function(){
	  cordova.plugins.Keyboard.close();
	   if(!$scope.checkValidateLogin())
	   		return false;
	    var param = {
		OrgName:$scope.field.org,
		UserId: $scope.field.username,
		Password: $scope.field.password,
	}

	ProcessService.ajaxPost("login/checklogin",param).then(function(result) {


		  var objectData = JSON.parse(result.data);

		  var param = {
				OrgName:  $scope.field["org"],
				UserId:   $scope.field.username,
				Password: $scope.field.password,
		  }


		  if(objectData.Error == true){
			  $rootScope.error = {
					result : true,
					message : $rootScope.lang.login.invalid_one_of
			  };

			  return false;
		  }
		  else{

				switch(objectData.Message) {
					//Login first time - user must be change pass
					case "OK1T":

					var infoLogin = {
						OrgName:objectData.OrgName,
						UserId:objectData.Userid,
					}
					infoLogin = JSON.stringify(infoLogin);

					sessionStorage.setItem('infoLogin', infoLogin);
					 $.jStorage.set("MenuMobile",null);
					$rootScope.MenuMobile  =  $.jStorage.get("MenuMobile");

					sessionStorage.setItem('rulePass', JSON.stringify(objectData.MainctrlData));
					$rootScope.positionMenu = 0; //possion menu
					$rootScope.noPrev=0;// reset top menu

					if(objectData.Last_Login!=null){
						var milli = objectData.Last_Login.replace(/\/Date\((-?\d+)\)\//, '$1');
						var date = new Date(parseInt(milli));
						var datetype = objectData.Date_Fmt=="1" ? "mediumDate": objectData.Date_Fmt=="2" ? "mediumDate2":"mediumDate3";
						date = DateTimeService.dateFormat(date,datetype);
					}
					else{
						date = null;
					}
					user = {"Last_Login":date,"FullName":objectData.FullName};
					$.jStorage.set("user",user);

					$location.path("/profileChangePass");
					break;

					//Userid is suppended
					case "NOKS":
					$rootScope.error = {
									result : true,
									message : $rootScope.lang.login.user_id_suspended
								};

					break;

					//Organisation/user/password not match
					case "NOK":
					$rootScope.error = {
									result : true,
									message : $rootScope.lang.login.not_match
								};

					break;
					// suscess
					case "OK":
						var infoLogin = {
						OrgName:objectData.OrgName,
						UserId:objectData.Userid,
						Ctry: objectData.Ctry
					}
					infoLogin = JSON.stringify(infoLogin);
					sessionStorage.setItem('infoLogin', infoLogin);
					sessionStorage.setItem('GeneralResource', JSON.stringify(objectData.Resource));
					sessionStorage.setItem('rulePass', JSON.stringify(objectData.MainctrlData));

						//console.log(objectData);

						sessionStorage.setItem('TMS_Photo', objectData.TMS_Photo);

						$.jStorage.set("MenuMobile",objectData.MenuMobile);
						 $scope.field.email = "";// reset null email in field
						  $scope.field.password = "";// reset null password in field
						  $.jStorage.set("loginField", $scope.field);
						var milli = objectData.Last_Login.replace(/\/Date\((-?\d+)\)\//, '$1');
						var date = new Date(parseInt(milli));


						var datetype = objectData.Date_Fmt=="1" ? "mediumDate": objectData.Date_Fmt=="2" ? "mediumDate2":"mediumDate3";
						date = DateTimeService.dateFormat(date,datetype);

						user = {"Last_Login":date,"FullName":objectData.FullName};
						$.jStorage.set("user",user);

							ProcessService.ajaxGetLocalSite($rootScope.GATEWAYURL+"resource/lang/lang"+objectData.Language+".txt")
	  						.then(function(result) {

	  						    $.jStorage.set("lang",result.data);
								$rootScope.lang =  $.jStorage.get("lang");
								DateTimeService.resetInternationalizationStrings();
								$rootScope.MenuMobile =  $.jStorage.get("MenuMobile");
								$rootScope.processMenu();
								sessionStorage.setItem('checkRegistrationId',0); // check to update token for notification
								$scope.goURL('Home');


	  						})

					break;

				}
		  }
    });

   }

});

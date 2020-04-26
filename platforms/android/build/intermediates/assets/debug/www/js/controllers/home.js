App.registerCtrl('homeCtrl', function($scope,$rootScope,$http,$location,$timeout,ProcessService,DateTimeService)
{
  var listLocation = null;
  var currentLocation = null
  function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }


  function checkValidLocation() {
    if(listLocation==null)
      return true;
    var  check = false;
    if(!currentLocation)
      return false;
    for(var key in listLocation){
      var position = listLocation[key].Coordinates;
      var arrPosition = position.split(',');
      var km = distance(arrPosition[0],arrPosition[1],currentLocation.latitude,currentLocation.longitude,'K');
      if(km<=0.05)
        check = true;
    }
    return check
  }

  ProcessService.ajaxPost("Common/CheckLocation",null).then(function(result) {
     listLocation = JSON.parse(result.data).data;
    console.log(listLocation);

  })


  // get location
  navigator.geolocation.getCurrentPosition(function (position) {
      currentLocation = position.coords;
      $scope.posLocation = currentLocation;
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //   'Longitude: '         + position.coords.longitude         + '\n' +
    //   'Altitude: '          + position.coords.altitude          + '\n' +
    //   'Accuracy: '          + position.coords.accuracy          + '\n' +
    //   'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //   'Heading: '           + position.coords.heading           + '\n' +
    //   'Speed: '             + position.coords.speed             + '\n' +
    //   'Timestamp: '         + position.timestamp                + '\n');
  }, function () {
    // alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
  },
    { maximumAge: 0, timeout: 60000, enableHighAccuracy: true }
  );
  $.jStorage.deleteKey("OTData"); // reset OTData in claim (for overtime,benefit,...)
	$rootScope.positionMenu = 0; //possion menu
	$rootScope.noPrev=0;// reset top menu

	//Permission has been granted
	 cordova.plugins.notification.badge.hasPermission(function (granted) {
    	// console.log('Permission has been granted: ' + granted);
	});
	cordova.plugins.notification.badge.registerPermission(function (granted) {
    	// console.log('Permission has been granted: ' + granted);
	});
	cordova.plugins.notification.badge.clear();

	//init PushNotification
	var push = PushNotification.init({
		android: {
			senderID: "916412225531"//"667418453555"
		},
		ios: {
			alert: "true",
			badge: "true",
			sound: "true"
		},
		windows: {}

	});

	 if(sessionStorage.getItem('checkRegistrationId')==0){

		cordova.getAppVersion.getPackageName(function (packageName) {

			push.on('registration', function(data) {
				// data.registrationId
				//cordova.plugins.notification.badge.set(2);
				console.log(data.registrationId);
				if(device.platform=="Android"){
					MobileOS = 1;
				}
				else{
					MobileOS = 2;
				}
				var param = {
					 MobileOS: MobileOS,
					 MobileToken: data.registrationId,
					 MobileApp_Name:packageName

				 };


				 ProcessService.ajaxPost("Common/UpdateMobileToken",JSON.stringify(param)).then(function(result) {
					 sessionStorage.setItem('checkRegistrationId', 1);
				 })

			});
	  })
	}

//listening notification
push.on('notification', function(data) {
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData
});



push.on('error', function(e) {
    // e.message
	console.log(e);
});


	 // get App info Version
	/*cordova.getAppVersion.getPackageName(function (result) {
		alert(result);
	})*/

	 $rootScope.MAC = {Photo_Url:""};
	 $rootScope.MAC["uuid"] = device && device.uuid?device.uuid.toUpperCase():null;
	 $scope.getMacAdd = function(){
     // if(device.platform=="Android"){
     //   try {
     //     if(window.wifi && window.wifi.lan){
     //       $rootScope.MAC["MacAddress"]= window.wifi.lan.BSSID;
     //     }
     //     else{
     //       $rootScope.MAC["MacAddress"] = "";
     //     }
     //   } catch (e) {
     //     $rootScope.MAC["MacAddress"] = "";
     //   }
     //
     // }
     // else
     // {
      WifiWizard2.getConnectedBSSID().then(function (macAddress) {
        $rootScope.MAC["MacAddress"] = macAddress;
     });

     // }
   }

   $scope.checkMenuActive = function(menuId){
	   var result = false;
	   if(!$rootScope.MenuMobile)
	     return false;
	   for(var i=0;i<$rootScope.MenuMobile.length;i++){
	     var item = $rootScope.MenuMobile[i];
	     if(menuId==item.Lvl1_Id){
         result =  true;
         break;
       }
     }
     return result;
   }

  $scope.getMacAdd();
  document.addEventListener("online", function (evt) {
      $scope.getMacAdd();
  }, false);

		cordova.getAppVersion.getVersionNumber(function (version) {
    				 $rootScope.MAC["Version"] = version;
      var param = {
        version: $rootScope.MAC["Version"],
        deviceType:device.platform
      }

      ProcessService.ajaxPost("Common/CheckVersion",JSON.stringify(param)).then(function(result) {
        const data = JSON.parse(result.data);
        if(data.Result){
          $rootScope.confirm = {
            result : true,
            message : data.Message,
            title:$rootScope.lang.general.confirm,
            callBack : function() {
              var nativeURL = device.platform=='Android'?"https://play.google.com/store/apps/details?id=com.payroll2u":"https://itunes.apple.com/us/app/payroll2u/id901475413?ls=1&mt=8";
              window.open(encodeURI(nativeURL) , '_blank', 'location=no,EnableViewPortScale=yes');
            },
            //cancel:data.cancel
          }
        }
        return;
      })
				});
     $scope.user =  $.jStorage.get("user");
	  $scope.changeLanguage = function (idLang){
		   var param = {
            	Language: idLang,
        	};

		   ProcessService.ajaxPost("Common/ChangeLanguage",JSON.stringify(param)).then(function(result) {
				ProcessService.ajaxGetLocalSite($rootScope.GATEWAYURL+"resource/lang/lang"+idLang+".txt")
					.then(function(result) {
						$.jStorage.set("lang",result.data);
						$rootScope.lang =  $.jStorage.get("lang");
						$rootScope.processMenu();
						//reset Internationalization Strings
						DateTimeService.resetInternationalizationStrings();
					})

		  })

	 }
	 $scope.listLang = sessionStorage.getItem('listLang')!= null ? JSON.parse(sessionStorage.getItem('listLang')): null;
	if($scope.listLang== null){
		ProcessService.ajaxGet("Common/GetLanguage")
		.then(function(result) {
			sessionStorage.setItem('listLang', result.data);
			$scope.listLang = JSON.parse(sessionStorage.getItem('listLang'));
		})
	}

	 $scope.checkBtnTms = function(){
		 return $rootScope.isRight (905);
	 };

	  $scope.showAbout = function(){
		_this = $("#about-application");
		 $(".overlay-about").show();
		_this.show();
		 _this.css({ left: ($(window).width() - _this.width()) / 2, top: ($(window).height() - _this.height()) / 2 });
	 }
  $scope.logout  = function(){
    ProcessService.ajaxPost("login/LogOut").then(function(result) {
      $rootScope.MenuMobile = null;
    })
    try {
      window.cookies.clear(function() {
        console.log('Cookies cleared!');
      });
    }
    catch (e) {

    }
    $scope.goURL('Login');
  }
	 $scope.closeAbout = function(){
		 $("#about-application").hide();
		 $(".overlay-about").hide();
	 }

	 function onPhotoDataSuccess(imageData) {
							// alert(imageData);
							uploadPhoto(imageData)

						}

						function onFail(message) {

							$rootScope.$apply(function() {
									$rootScope.error = {
									result : true,
									message :message
								};
								})
						}

						function uploadPhoto(imageURI) {

							// fix android 4.4 or higher
							if (imageURI.substring(0, 21) == "content://com.android") {
								photo_split = imageURI.split("%3A");
								imageURI = "content://media/external/images/media/"+ photo_split[1];

							}

							$(".loading").show();
							$(".overlay").show();
							window.resolveLocalFileSystemURL(
											imageURI,
											function(fileEntry) {
												var checkFile = true;
												var options = new FileUploadOptions();
												options.fileKey = "fileUpload";

												fileEntry.file(function(file) {
														generalResource = JSON.parse(sessionStorage.getItem('GeneralResource'));
														size = file.size/1024;


														if(size>generalResource.FileLenght){

															$rootScope.$apply(function() {
																$rootScope.error = {
																	result : true,
																	message :$rootScope.lang.general.maximum
																};

															})
															$(".loading").hide();
															$(".overlay").hide();
															return false;
														}

														options.fileName = fileEntry.nativeURL.substr(fileEntry.nativeURL.lastIndexOf('/') + 1);
														options.headers= {
												 		 Connection: "close" // very important
														};
														options.chunkedMode = false;
												var ft = new FileTransfer();
												ft.upload(imageURI,$rootScope.GATEWAYURL+"/api/uploadfile/uploadfilephoto",win, fail,options);

												});



											}, function(e) {
												console.log(e);
												// error
											});

						}

						function win(r) {

							$(".loading").hide();
							$(".overlay").hide();
							data = JSON.parse(r.response);
							data = JSON.parse(data);

							if(data.FileName!=""){

								$scope.$apply(function() {
									$rootScope.MAC["Photo_Url"] = data.FileName;
									 $scope.submitTms();
								})
							}
							else{
								$rootScope.$apply(function() {
									$rootScope.error = {
									result : true,
									message :data.MessageInfo
								};
								})
							}
						}

						function fail(error) {
							$(".loading").hide();
							$(".overlay").hide();
							console.log(error);

						}


							pictureSource = navigator.camera.PictureSourceType;
							destinationType = navigator.camera.DestinationType;


	 $scope.capturePhoto = function() {
     $scope.getMacAdd();
		if(device.platform=="Android"){

			ProcessService.checkPermission("CAMERA").then(function(response) {

				if(response.status==false){
						$rootScope.error = {
							result : true,
							message :"CAMERA permission is not turned on",
				   };
				}
				else{
					cordova.plugins.camerapreview.startCamera({x: 0, y: 0, width: window.innerWidth, height:window.innerHeight}, "front", true, false, false);
					$rootScope.camerapreview = 1;
					cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
						fileName = result[0].split("/");
						$(".loading").show();
						$(".overlay").show();
						 var ft = new FileTransfer();
						 var options = new FileUploadOptions();
							options.fileKey = "fileUpload";
							options.fileName = fileName[fileName.length-1];
							options.headers= {
							 Connection: "close" // very important
							};
							options.chunkedMode = false;
            ProcessService.resizeImage(500,result[0],function(rs){
              ft.upload(rs,$rootScope.GATEWAYURL+"/api/uploadfile/uploadfilephoto",win, fail,options);
             // console.log("rs",rs);
            })



						// cordova.plugins.camerapreview.hide();
						cordova.plugins.camerapreview.stopCamera();
					});
				}

			});

		}
		else{
			navigator.camera.getPicture(onPhotoDataSuccess,onFail,{
					quality : 50,
					correctOrientation: true,
					destinationType : destinationType.FILE_URI,
					cameraDirection: 1
			});
		}

	}



	 $scope.submitTms = function(){
     $scope.getMacAdd();
		 var param = {

            RegisEMAC: 1,
            EMac:  $rootScope.MAC.uuid,
            APMac: $rootScope.MAC.MacAddress,
			Photo_Url: $rootScope.MAC["Photo_Url"]
        };


 		ProcessService.ajaxPost("MyTMSClockInOut/Submit",JSON.stringify(param)).then(function(result) {
				data = JSON.parse(result.data);
				$rootScope.MAC["Photo_Url"] = "";
				if(data.Message==true){
					if($rootScope.MAC["Photo_Url"] != ""){
						window.plugins.toast.showShortBottom($rootScope.lang.main.txt.image_saved);
					}
					if($scope.RegisEMAC==1){
						window.plugins.toast.showShortBottom($rootScope.lang.main.txt.wellcome);
					}
					else{
						window.plugins.toast.showShortBottom($rootScope.lang.main.txt.see_you_again);
					}
					isHaveMacAddress = data.IsHaveMacAddress;
					if(isHaveMacAddress==0){
						$timeout(function(){
								$location.path("/Login");
						},3000);
					}
				}
				else{
					switch (data.MessageCode_SubmitClocking) {
						case 1:
						$rootScope.error = {
							result : true,
							message :data.MessageInfo
						};
						break;
						case 1:
						$rootScope.error = {
							result : true,
							message :$rootScope.lang.main.txt.invalid_location
						};
						break;
						case 2:
						$rootScope.error = {
							result : true,
							message :$rootScope.lang.main.txt.mobile_mac_not_setup
						};
						break;
						case 3:
						$rootScope.error = {
							result : true,
							message :$rootScope.lang.main.txt.different_mobile_mac_address
						};
						break;
						case 4:
						$rootScope.error = {
							result : true,
							message :$rootScope.lang.main.txt.badge_id_not_setup
						};
						break;


					}

				}
		 })
		}
	$scope.submitInOut = function(RegisEMAC) {
    if(listLocation==null)
    {
      $scope.RegisEMAC = RegisEMAC;
      if(sessionStorage.getItem('TMS_Photo')==1){
        $scope.capturePhoto();
      }
      else{
        $scope.submitTms();
      }
      return;
    }

      $(".loading").css({"display":"table"});
      $(".overlay-load").show();
      navigator.geolocation.getCurrentPosition(function (position) {
          currentLocation = position.coords;
          $scope.posLocation = currentLocation;
          var checkValid =  checkValidLocation();
          if(!checkValid){
            $(".loading").css({"display":"none"});
            $(".overlay-load").hide();
            $scope.$apply(function () {
              $rootScope.error = {
                result : true,
                message :"Invalid location"
              };
            })
          }
          else{
            $scope.RegisEMAC = RegisEMAC;
            if(sessionStorage.getItem('TMS_Photo')==1){
              $scope.capturePhoto();
            }
            else{
              $scope.submitTms();
            }
          }
        }, function () {
          $(".loading").css({"display":"none"});
          $(".overlay-load").hide();
          $rootScope.error = {
            result : true,
            message :"Can't get location on this device. Please try again"
          };
          // alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
        },
        { maximumAge: 0, timeout: 60000, enableHighAccuracy: true }
      );
    }

    $scope.copyToClipboard = function () {
      var text = "latitude:"+$scope.posLocation.latitude+",longitude:"+$scope.posLocation.longitude+",altitude:"+$scope.posLocation.altitude;
      cordova.plugins.clipboard.copy(text);
      window.plugins.toast.showShortBottom("copy successfully");
    }



 })

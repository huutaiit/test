App.registerCtrl('myTmsCtrl', function ($scope, $rootScope, ProcessService,DateTimeService,PoupService, $location) {

	$scope.listMenuTms = [
    {id:1247,href:"tmsClockingsEnquiry",icon:"tms733.png",name:$rootScope.lang.mytms.clockingsEnquiry.tt,description:$rootScope.lang.mytms.clockingsEnquiry.ct},
    {id:1248,href:"tmsClockOnBehalf",icon:"n_ic_tms_clock_behalf.png",name:$rootScope.lang.mytms.clockOnBehalf.tt,description:$rootScope.lang.mytms.clockOnBehalf.ct},
					{id:733,href:"tmsRosterEnquiry",icon:"tms733.png",name:$rootScope.lang.mytms.rosterEnquiry.tt,description:$rootScope.lang.mytms.rosterEnquiry.ct},
					{id:904,href:"tmsMobileMacAddress",icon:"tms904.png",name:$rootScope.lang.mytms.mobileMacAddress.tt,description:$rootScope.lang.mytms.mobileMacAddress.ct},


					]

	processRoseEnquiry = function(){
		$scope.currentDate = sessionStorage.getItem('currentMonth')!=null ? new Date(sessionStorage.getItem('currentMonth')):new Date();
		loadData();

	function loadData(){
		 var param = {
            Year: DateTimeService.dateFormat($scope.currentDate, "year"),
            Month:  DateTimeService.dateFormat($scope.currentDate, "month")
        };

			ProcessService.ajaxPost("MyTMSRosterEnquiry/GetListByYearMonth",param)
							.then(
							function(result) {
								var data = JSON.parse(result.data);
								$scope.listCalendar = data;
								$scope.events = processListCalendar();
							});
			}

			$scope.getSelectMonth = function(arg) {
							$scope.currentDate = new Date(arg);
							loadData();
	    }

	function processListCalendar() {
							var events = Array();
							var year = DateTimeService.dateFormat($scope.currentDate,"year");
							var month = DateTimeService.dateFormat($scope.currentDate,"month");
							var lastDay = new Date(year,month,0); // get last day of month
							lastDay = DateTimeService.dateFormat(lastDay,"day"); // format last day to "dd"
							angular.forEach($scope.listCalendar,function(value, key) {


											for (var i = 1; i <=lastDay; i++) {

											date = new Date(year,month-1,i);

											if (i == value.Day) {
												var description = Array();
												if(value.Detail!=null)
													description.push(value.Detail);
												if(value.Detail1!=null)
													description.push(value.Detail1);
												if(value.Detail2!=null)
													description.push(value.Detail2);
											events.push({
												"Date" : angular.copy(date),
												"CssClass" : "calendar-tms"+" tms-"+value.Type,
												"Title" : value.Code,
												"URL" : "",
												"Description" : description
											});
											}
											}

											})

							for (var i = 0; i < events.length; ++i) {

								for (var j = i + 1; j < events.length ; ++j) {

									if (DateTimeService.dateFormat(events[i]["Date"],
											"shortDate") == DateTimeService.dateFormat(
											events[j]["Date"],
											"shortDate")) {

										events[i]["Description"].push(events[j]["Description"]);
										events[i]["Title"] = events[j]["Title"]!=null?events[j]["Title"]:events[i]["Title"];
										events.splice(j--, 1);

									}
								}
							}
								return events;

						}

	} //end processRoseEnquiry
	processMobileMacAddress = function(){


	 		$scope.device= device.uuid.toUpperCase();

		$scope.submitMacAddress = function(){
			var param = {
            	App_Mac: $scope.device,
        	};
		ProcessService.ajaxPost("MyTMSMobileMacAddress/Submit",param)
							.then(
							function(result) {
								var data = JSON.parse(result.data);
								var message = $rootScope.lang.general.submitSuccess;
								$scope.processResultPost(data,"","myTms");

							});

		}


	} // end mobilemacaddress

	processRoseEnquiryDetail = function(){
		$scope.leaveCalendarDetail = JSON.parse(sessionStorage.getItem('calendarDetail'));
		console.log($scope.leaveCalendarDetail);

						$scope.leaveCalendarDetail.Date = DateTimeService.dateFormat(
								$scope.leaveCalendarDetail.Date, "longDate");
	}

 var  processClockingsEnquiry = function(){
      $scope.listClockingsEnquiry = [];
      ProcessService.ajaxGet("MyTMSClockingsEnquiry/GetClockings")
        .then(
          function(result) {
            var data = JSON.parse(result.data);
            for(var key in data){
              var arrDate =   data[key].Reader_Date.split("/");
              var arrTime =  data[key].Reader_Time.split(":");
              data[key].date = new Date(parseInt(arrDate[2]),parseInt(arrDate[1]),parseInt(arrDate[0]),parseInt(arrTime[0]),parseInt(arrTime[1]),0,0).getTime();
            }
            console.log("datadatadata",data)


            data.sort(function(a, b){
              var aa = a.Reader_Date.split('/').reverse().join();
              aa += a.Reader_Time.split(':').reverse().join();
              var  bb = b.Reader_Date.split('/').reverse().join();
              bb += b.Reader_Time.split(':').reverse().join();
              return aa < bb ? 1 : (aa > bb ? -1 : 0);
            });

            // data.sort(function(a,b){
            //    var prevDate = new Date(DateTimeService.dateFormat(a.date)).getTime();
            //   var nextDate = new Date(DateTimeService.dateFormat(b.date)).getTime();
            //     if(prevDate < nextDate){
            //       return 1;
            //     }
            //     else if(prevDate>nextDate){
            //       return -1;
            //     }
            //     else{
            //       return 0;
            //     }
            //  })

            $scope.listClockingsEnquiry = data;
            console.log($scope.listClockingsEnquiry);
          });
  }


  var processClockOnBehalf = function () {
    $scope.ListEmployee = [];
    $scope.employeeSelected = null;
    $scope.showPoupEmployee = function(){

      PoupService.showPoup("poup-employee",$scope);

      ProcessService.ajaxGet("MyTMSClockOnBehalf/GetEmployeeAccessTMS").then(function(result) {
        $scope.ListEmployee = JSON.parse(result.data);
      });
    }

    $scope.selectEmployee = function(fieldSelected,item) {
      $scope.employeeSelected = item;
      $scope.closePoup();

    }
    $scope.closePoup = function(){
      PoupService.closePoup();
    }
    $scope.MAC = {Photo_Url:""};
    $scope.MAC["uuid"] = device.uuid.toUpperCase();
    if(device.platform=="Android"){
      try {
        if(window.wifi && window.wifi.lan){
          $scope.MAC["MacAddress"]= window.wifi.lan.BSSID;
        }
        else{
          $scope.MAC["MacAddress"] = "";
        }
      } catch (e) {
        $scope.MAC["MacAddress"] = "";
      }

    }
    else
    {
      WifiWizard.getCurrentBSSID(function(macAddress){
        $scope.MAC["MacAddress"] = macAddress;
      }, function(error){
        console.log(error);
      });
    }
    $scope.submitTms = function(){
      var param = {

        RegisEMAC: 1,
        EMac:  $scope.MAC.uuid,
        APMac: $scope.MAC.MacAddress,
        Photo_Url: $scope.MAC["Photo_Url"],
        EE_ID:$scope.employeeSelected.Id
      };


      ProcessService.ajaxPost("MyTMSClockOnBehalf/Submit",JSON.stringify(param)).then(function(result) {
        data = JSON.parse(result.data);
        console.log(data);
        $scope.MAC["Photo_Url"] = "";
        if(data.Message==true){
          if($scope.MAC["Photo_Url"] != ""){
            window.plugins.toast.showShortBottom($rootScope.lang.main.txt.image_saved);
          }
          if($scope.RegisEMAC==1){
            window.plugins.toast.showShortBottom($rootScope.lang.main.txt.wellcome);
          }
          else{
            window.plugins.toast.showShortBottom($rootScope.lang.main.txt.see_you_again);
          }
         var isHaveMacAddress = data.IsHaveMacAddress;
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
    function win(r) {

      $(".loading").hide();
      $(".overlay").hide();
      data = JSON.parse(r.response);
      data = JSON.parse(data);

      if(data.FileName!=""){

        $scope.$apply(function() {
          $scope.MAC["Photo_Url"] = data.FileName;
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

    function onPhotoDataSuccess(imageData) {
      // alert(imageData);
      uploadPhoto(imageData)

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

    function onFail(message) {

      $rootScope.$apply(function() {
        $rootScope.error = {
          result : true,
          message :message
        };
      })
    }


   var  destinationType = navigator.camera.DestinationType;
    $scope.capturePhoto = function() {

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
              ft.upload(result[0],$rootScope.GATEWAYURL+"/api/uploadfile/uploadfilephoto",win, fail,options);


              // cordova.plugins.camerapreview.hide();
              cordova.plugins.camerapreview.stopCamera();
            });
          }

        });

      }
      else{
        navigator.camera.getPicture(onPhotoDataSuccess,onFail,{
          quality : 70,
          correctOrientation: true,
          destinationType : destinationType.FILE_URI,
          cameraDirection: 1
        });
      }

    }

    $scope.submitInOut = function(RegisEMAC) {
      if( $scope.employeeSelected==null){
        $rootScope.error = {
          result : true,
          message :$rootScope.lang.mytms.pleseSelectEmployee,
        };
        return false;
      }
      $scope.RegisEMAC = RegisEMAC;
      if(sessionStorage.getItem('TMS_Photo')==1){
        $scope.capturePhoto();
      }
      else{
        $scope.submitTms();
      }
    }




  }

    switch ($location.path()) {

					case "/myTms":
						sessionStorage.removeItem('currentMonth');
						break;

					case "/tmsRosterEnquiry":
						processRoseEnquiry();
						break;

					case "/tmsRosterEnquiryDetail":
						processRoseEnquiryDetail();
						break;

					case "/tmsMobileMacAddress":
						processMobileMacAddress();
						break;

          case "/tmsClockingsEnquiry":
            processClockingsEnquiry();
            break;

      case "/tmsClockOnBehalf":
        processClockOnBehalf();
        break;
		}
});

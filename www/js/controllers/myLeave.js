App.registerCtrl('myLeaveCtrl',function($scope, $rootScope, $location, $route, $routeParams,DateTimeService, ProcessService,FileService,PoupService) {



  // list menu myleave
  $scope.listMenuLeave = [
    {id:699,href:"leaveApply",icon:"n_ic_leave_apply.png",name:$rootScope.lang.myleave.apply.tt,description:$rootScope.lang.myleave.apply.ct},
    {id:700,href:"leaveCancellation",icon:"n_ic_leave_cancel.png",name:$rootScope.lang.myleave.cancellation.tt,description:$rootScope.lang.myleave.cancellation.ct},
    {id:701,href:"leaveEnquiry",icon:"n_ic_leave_enquiry.png",name:$rootScope.lang.myleave.enquiry.tt,description:$rootScope.lang.myleave.enquiry.ct},
    {id:702,href:"leaveCalendar",icon:"n_ic_leave_calendar.png",name:$rootScope.lang.myleave.calendar.tt,description:$rootScope.lang.myleave.calendar.ct},
    {id:703,href:"leavePlan",icon:"n_ic_leave_plan.png",name:$rootScope.lang.myleave.plan.tt,description:$rootScope.lang.myleave.plan.ct},
    {id:704,href:"leaveApproval",icon:"n_ic_leave_approval.png",name:$rootScope.lang.myleave.approval.tt,description:$rootScope.lang.myleave.approval.ct},
    {id:705,href:"leaveAdminApproval",icon:"n_ic_leave_approval.png",name:$rootScope.lang.myleave.adminApproval.tt,description:$rootScope.lang.myleave.adminApproval.ct},
    {id:706,href:"leaveDelegate",icon:"n_ic_leave_delegate.png",name:$rootScope.lang.myleave.delegate.tt,description:$rootScope.lang.myleave.delegate.ct}
  ]

  $scope.isRequired = function(required) {

    return (required == 1);
  }
  $scope.isActive = function (item1,item2) {
    return (item1==item2);
  };

  $scope.selectItem = function(item) {
    switch ($location.path()) {
      case "/leaveApproval":
      case "/leaveAdminApproval":
        sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));
        break;
      case "/leaveCancellation":
        sessionStorage.setItem('listCancelLation',JSON.stringify($scope.listCancelLation));
        break;
    }
    var leaveDetail = JSON.stringify(item);

    sessionStorage.setItem('leaveDetail', leaveDetail);
    $location.path("/leaveDetail");
  }
  // processLeaveApply
  processLeaveApply = function() {

    $rootScope.listFileAttached = [];

    $scope.showAttached = false;

    $scope.showAttachedList = function(){
      $scope.showAttached = true;
    }
    $scope.hideAttachedList = function(){
      $scope.showAttached = false;
    }
    $scope.typeDate = "mediumDate3";
    $scope.modelLeave = {
      leaveType : "",
      extent : "",
      fromDate : "",
      toDate : "",
      TimeFr : "",
      TimeTo : "",
      duration : {
        num : -1
      },
      remarks : "",
      approvingOffer :{"NotifyName":""},
      fileUpload : "",
      bussTripCtryCourse:null,
      ConfirmMessage:null
    }
    $scope.SearchText = "";
    var pageIndex = 0;
    $scope.showPoupEE = function(attr){
      $scope.fieldSelected = attr;
      PoupService.showPoup("poup-employee",$scope);
      $scope.SearchText = "";
      pageIndex = 0;
      searchDataEmployee();
      searchDataEmployee().then(function(data){
        $scope.ListEmployee = data!=null?data:[];
      });

    }

    searchDataEmployee = function(){
      var param = {
        PageIndex: pageIndex,
        SearchText: $scope.SearchText
      };

      return ProcessService.ajaxPostLocalSite($rootScope.GATEWAYURL+"api/MyLeaveApplyLeave/SearchNotifyEmployee",param).then(function(result){
        data = JSON.parse(result.data);
        $scope.disabledLoadMore = (data==null || data.length < 20) ? true:false;
        return  data;
      })
    }
    $scope.closePoup = function(){
      PoupService.closePoup();
    }

    $scope.searchEmployee = function(){
      pageIndex = 0;
      searchDataEmployee().then(function(data){

        $scope.ListEmployee = data!=null?data:[];
      });
    }

    $scope.loadMoreEE = function(){

      $scope.disabledLoadMore = true;
      pageIndex += 1;
      searchDataEmployee().then(function(data){
        if(data != null){
          angular.forEach(data,function(value,index){
            $scope.ListEmployee.push(value);
          })
        }

      });
    }

    $scope.checkValidate = function() {

      if ($scope.modelLeave.leaveType == "") {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.apply.validation.type_not_valid
        };
        return false;
      }
      if ($scope.modelLeave.fromDate == "") {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.general.please_enter +" "+$rootScope.lang.general.from
        };
        return false;
      }
      if ($scope.modelLeave.toDate == "") {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.general.please_enter +" "+$rootScope.lang.general.to
        };
        return false;
      }
      if ($scope.modelLeave.approvingOffer.AppName == "") {
        $rootScope.error = {
          result : true,
          message: $rootScope.lang.myleave.apply.validation.no_approving_officer
        };
        return false;
      }

      if ($scope.modelLeave.extent == "") {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.apply.validation.extent_not_valid
        };
        return false;
      }

      if ($scope.modelLeave.leaveType.Required.Buss_Trip!=3 && $scope.modelLeave.bussTripCtryCourse == null) {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.apply.validation.buss_trip_ctry_course_valid
        };
        return false;
      }

      //	|| $scope.modelLeave.duration.num < $scope.modelLeave.leaveType.Required.MinDuration
      //|| $scope.modelLeave.duration.num > $scope.modelLeave.leaveType.Required.MaxDuration
      if (jQuery.isEmptyObject($scope.modelLeave.duration) || $scope.modelLeave.duration.num<=0) {

        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.apply.validation.duration_not_valid
        };
        return false;
      }

      if ($scope.modelLeave.leaveType.Required.SelfRemark == 1 && $scope.modelLeave.remarks == '') {
        $rootScope.error = {
          result : true,
          message :  $rootScope.lang.myleave.apply.validation.remark_not_valid
        };
        return false;
      }

      if ($scope.modelLeave.leaveType.Required.SelfFile == 1 && $rootScope.listFileAttached.length ==0) {

        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.apply.validation.file_not_valid
        };
        return false;
      }
      return true;
    }



    $scope.selectDate = function(field) {
      var field2  = field == "fromDate"?"toDate":"fromDate";
      $scope.typeDate = $scope.modelLeave.extent.Opt==4?"mediumDate4":"mediumDate3";
      var temp = $scope.modelLeave[field];
      var temp2 =  $scope.modelLeave[field2];

      $scope.modelLeave[field] =  angular.copy(DateTimeService.selectDate.fullDate);
      fromDate = $scope.modelLeave.fromDate !='' ? DateTimeService.parseDate(DateTimeService.dateFormat($scope.modelLeave.fromDate,"mediumDate3")):0;
      toDate = $scope.modelLeave.toDate != ''  ? DateTimeService.parseDate(DateTimeService.dateFormat($scope.modelLeave.toDate,"mediumDate3")):0;

      if (($scope.modelLeave.extent.Opt == "2" || $scope.modelLeave.extent.Opt == "3")) {

        if(field=="fromDate" && DateTimeService.daydiff(fromDate, toDate)<0){
          $scope.modelLeave.toDate   =  angular.copy(DateTimeService.selectDate.fullDate);
        }
        else if(field=="toDate" && DateTimeService.daydiff(fromDate, toDate)<=0 ){

          $rootScope.error = {
            result : true,
            message : $rootScope.lang.myleave.apply.validation.to_is_less_than_from_date
          };
          $scope.modelLeave[field] = temp;
          return false;
        }
      }
      else if($scope.modelLeave.extent.Opt == "4"){

        $scope.typeDate = "mediumDate4";
        $scope.modelLeave[field] = angular.copy(DateTimeService.selectDate.fullDate);

        if($scope.modelLeave[field2]!='' && field=="toDate"){

          if(DateTimeService.dateFormat($scope.modelLeave[field2],"mediumDate3")!=DateTimeService.dateFormat($scope.modelLeave[field],"mediumDate3"))
          {

            $rootScope.error = {
              result : true,
              message : $rootScope.lang.myleave.apply.validation.from_is_equal_to_date
            }
            $scope.modelLeave[field] = temp;
            return false;

          }
        }
        else if($scope.modelLeave[field2]!='' && field=="fromDate")
        {
          var date = DateTimeService.dateFormat($scope.modelLeave.fromDate,"mediumDate3").split('/');
          var time = DateTimeService.dateFormat($scope.modelLeave["toDate"],"shortTime2");
          time = time.split(':');
          $scope.modelLeave["toDate"] = new Date(date[2], date[1] - 1, date[0],time[0],time[1]);
        }


      }



      fromDate = $scope.modelLeave.fromDate !='' ? DateTimeService.parseDate(DateTimeService.dateFormat($scope.modelLeave.fromDate,"mediumDate3")):0;
      toDate = $scope.modelLeave.toDate != ''  ? DateTimeService.parseDate(DateTimeService.dateFormat($scope.modelLeave.toDate,"mediumDate3")):0;

      fromTime =$scope.modelLeave.fromDate !='' ? DateTimeService.parseDateAndTime(DateTimeService.dateFormat($scope.modelLeave.fromDate,"mediumDate4")):0;
      toTime = $scope.modelLeave.toDate != '' ? DateTimeService.parseDateAndTime(DateTimeService.dateFormat($scope.modelLeave.toDate,"mediumDate4")):0;

      var num = ($scope.modelLeave.extent.Opt == 4) ?  DateTimeService.daydiff(fromTime, toTime): DateTimeService.daydiff(fromDate, toDate);


      if (num < 1 && $scope.modelLeave.fromDate != "" && $scope.modelLeave.toDate != ""  && $scope.modelLeave.extent.Opt==1) {
        if(field=="fromDate"){
          temp2 =  $scope.modelLeave["toDate"];

          $scope.modelLeave["toDate"] = angular.copy($scope.modelLeave["fromDate"]);
          $(".overlay").hide();
          $(".modal").hide();
          // $(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
        }
        else{
          $rootScope.error = {
            result : true,
            message : $rootScope.lang.myleave.apply.validation.to_is_less_than_from_date
          };
          $scope.modelLeave[field] = temp;
          return false;
        }

      }

      //else if (num-1 <= 0  && $scope.modelLeave.fromDate != "" && $scope.modelLeave.toDate != "" && $scope.modelLeave.extent.Opt==4) {

      /*	$rootScope.error = {
       result : true,
       message : $rootScope.lang.myleave.apply.validation.to_is_less_than_from_time
       }*/



      //$scope.modelLeave[field] = temp;
      //return false;

      //}
      else {
        $(".overlay").hide();
        $(".modal").hide();
        //$(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
      }

      if($scope.modelLeave.fromDate!='' && $scope.modelLeave.toDate!=''){

        if($scope.modelLeave.leaveType == "" || $.isEmptyObject($scope.modelLeave.leaveType)==true)
        {
          $rootScope.error = {
            result : true,
            message : $rootScope.lang.myleave.apply.validation.type_not_valid
          };
          $scope.modelLeave.fromDate = $scope.modelLeave.toDate = ""
          return false;
        }
        var param = {
          LcLeaveId: $scope.modelLeave.leaveType.Id,
          DateFr: DateTimeService.parseMilliSecondToUTC($scope.modelLeave.fromDate),
          DateTo: DateTimeService.parseMilliSecondToUTC($scope.modelLeave.toDate),
        };

        ProcessService.ajaxPost("MyLeaveApplyLeave/CalculateDays",JSON.stringify(param)).then(
          function(result) {
            data = JSON.parse(result.data);
            if(data==0){
              $rootScope.error = {
                result : true,
                message :  $rootScope.lang.myleave.apply.validation.not_choose_day_off_rest_holiday
              };

              $scope.modelLeave[field] = temp;
              $scope.modelLeave[field2] = temp2;

              //$scope.modelLeave.duration = {};
              return false;
            }
            else {


              var type = $scope.modelLeave.extent.Opt != "4"  ? " "+$rootScope.lang.general.days : " "+$rootScope.lang.general.hours;
              numHours = (num-1)*24>0?(num-1)*24:0;

              num =  $scope.modelLeave.extent.Opt == "2" || $scope.modelLeave.extent.Opt == "3"? data/2:$scope.modelLeave.extent.Opt == "4" ? numHours : data;
              $scope.modelLeave.duration = {
                num : num,
                description : accounting.formatNumber(num,2) + type
              };
            }

          });

      }


    }

    $scope.selectField = function(field, value) {
      $scope.modelLeave[field] = value;
    }
    $scope.setDuration= function(value) {
      var type = $scope.modelLeave.extent.Opt != "4"  ? " "+$rootScope.lang.general.days : " "+$rootScope.lang.general.hours;
      $scope.modelLeave.duration = {
        num : value,
        description:accounting.formatNumber(value,2) + type,
      };

    }
    $scope.selectExtent = function(value) {
      $scope.modelLeave.fromDate = "";
      $scope.modelLeave.toDate = "";
      $scope.modelLeave.duration = {
        num : -1
      };
      $scope.modelLeave["extent"] = value;

    }
    $scope.selectLeaveType = function(item) {
      $scope.modelLeave.leaveType = item;
      console.log("leaveType",$scope.modelLeave.leaveType )
      $scope.listExtent = item.extent;
      var param = {
        LcLeaveId : $scope.modelLeave.leaveType.Id
      };
      ProcessService.ajaxPost("MyLeaveApplyLeave/GetLeaveInfo",JSON.stringify(param)).then(
        function(result) {
          console.log("GetLeaveInfo",JSON.parse(result.data));
          var data = JSON.parse(result.data)
          $scope.modelLeave.notifyGroup = data.NotifyEmpId!=null?{Id:data.NotifyEmpId,Name:data.NotifyName}:{};
          $scope.modelLeave.approvingOffer = JSON.parse(result.data);

          $scope.modelLeave.extent = $scope.listExtent[0];
          $scope.modelLeave.fromDate = "";
          $scope.modelLeave.toDate = "";
          $scope.modelLeave.duration = {};
        });

    }

    $scope.selectBussTripCtryCourse = function(item) {
      $scope.modelLeave.bussTripCtryCourse = item;
    }
    $scope.selectNotifyGroup = function(item) {
      $scope.modelLeave.notifyGroup = {Id:item.Id,Name:item.Description}
    }

    $scope.selectEmployee = function(field,item) {
      PoupService.closePoup();
      $scope.modelLeave[field] = {Id:item.Id,Name:item.Name}
    }
    $scope.updateValueBlockLv = function(){
      $scope.modelLeave.blockLv = !$scope.modelLeave.blockLv;
    }
    $scope.applyLeave = function(ConfirmMessage) {
      if (!$scope.checkValidate()) {

        return false;
      }
      var file = "";
      angular.forEach($rootScope.listFileAttached,function(value,index){
        file += "#"+value;
      })
      file = file.slice(1);
      //console.log($scope.modelLeave.fromDate); return false;
      var param = {
        LcLeaveId : $scope.modelLeave.leaveType.Id,
        DateFr : DateTimeService.parseMilliSecondToUTC($scope.modelLeave.fromDate),
        DateTo : DateTimeService.parseMilliSecondToUTC($scope.modelLeave.toDate),
        TimeFr : $scope.modelLeave.extent.Opt == "4" ? DateTimeService.dateFormat($scope.modelLeave.fromDate,"hour")+":"+DateTimeService.dateFormat($scope.modelLeave.fromDate,"minute"):"00:00",
        TimeTo : $scope.modelLeave.extent.Opt == "4" ? DateTimeService.dateFormat($scope.modelLeave.toDate,"hour")+":"+DateTimeService.dateFormat($scope.modelLeave.toDate,"minute"):"00:00",
        ApplyType : $scope.modelLeave.extent.Opt,
        Duration :  accounting.formatNumber($scope.modelLeave.duration.num,2),
        Remarks : $scope.modelLeave.remarks,
        FileUrl : file,
        LcNotifyId: $scope.modelLeave.notifyGroup.Id, // Id Notify Group
        Esec_Id_Notify_1 : $scope.modelLeave.notifyEmployee.Id, // Id of Notify employee
        Esec_Id_Notify_2 : $scope.modelLeave.notifyEmployee2.Id ,// Id of Notify employee2,
        Block_Lv:$scope.modelLeave.blockLv?1:0,
        Buss_Trip:$scope.modelLeave.leaveType.Required.Buss_Trip,
        EcCtry_Id:$scope.modelLeave.bussTripCtryCourse!=null?$scope.modelLeave.bussTripCtryCourse.Id:0,
        EeCourseUqId:$scope.modelLeave.bussTripCtryCourse!=null?$scope.modelLeave.bussTripCtryCourse.Uqid:0,
        ConfirmMessage:ConfirmMessage==null?null:ConfirmMessage

      };

      ProcessService.ajaxPost("MyLeaveApplyLeave/SubmitApplyLeave",
        JSON.stringify(param)).then(
        function(result) {
         var data = JSON.parse(result.data);
          if(data.ConfirmMessage!=null){
            $scope.modelLeave.ConfirmMessage = data.ConfirmMessage
            data.callBack = function(){
              $scope.applyLeave(true);
            }
            data.cancel = function () {

            }

          }
          $scope.processResultPost(data,$rootScope.lang.myleave.apply.applyleavesubmitted,"myLeave");

        });
    }

    ProcessService.ajaxGet("MyLeaveApplyLeave/GetApplyLeave").then(
      function(result) {
        var data = JSON.parse(result.data);
        console.log(data);
        $scope.listLeaveType = data.Data.ListLeaveType;
        $scope.blockLv = data.DefaultOfficer.Block_Lv;
        $scope.CheckControlNotify = data.CheckControlNotify;

        $scope.modelLeave.notifyGroup = {Id:data.DefaultOfficer.NotifyEmpId,Name:data.DefaultOfficer.NotifyName};
        $scope.modelLeave.notifyEmployee = {Id:data.DefaultOfficer.EmployeeNotifyId,Name:data.DefaultOfficer.EmployeeNotifyName};

        $scope.modelLeave.notifyEmployee2 = {Id:data.DefaultOfficer.EmployeeNotifyId2,Name:data.DefaultOfficer.EmployeeNotifyName2};


        $scope.ListEmployee = data.ListEmployee;
        $scope.ListBussTripCtryCourse = data.ListBussTripCtryCourse;

        $scope.disabledLoadMore = ($scope.ListEmployee == null || $scope.ListEmployee.length < 20)  ? true:false;
        $scope.ListNotifyGroup = data.ListNotifyGroup;


        if($scope.listLeaveType.length==0){
          var successful = $rootScope.lang.general.successful;
          $rootScope.lang.general.successful = "Alert";
          $rootScope.success = {
            result : true,
            message : $rootScope.lang.general.not_entitled_to +" "+$rootScope.lang.myleave.apply.tt,
            callBack : function() {
              $rootScope.success = {
                result : false,
              }
              $rootScope.lang.general.successful = successful;
              history.back(-1);
            }
          }

        }

        $scope.listExtent = {0:data.Data.ListExtent[0]};

        angular.forEach($scope.listLeaveType,function(value, key) {
          value.extent = [];

          if (value.Required.Apply_Full == 1)

            value.extent.push(data.Data.ListExtent[0]);

          if (value.Required.Apply_Half == 1)
            value.extent.push(data.Data.ListExtent[1],data.Data.ListExtent[2]);

          if (value.Required.Apply_Hour == 1)
            value.extent.push(data.Data.ListExtent[3]);

          if(value.extent.length==0)
          {
            value.extent.push(data.Data.ListExtent[3]);
          }

        });

        //$scope.listExtent = $scope.listLeaveType[0]["extent"];

      })



    $scope.capturePhoto = function(){
      if(device.platform=="Android"){
        ProcessService.checkPermission("CAMERA").then(function(response) {

          if(response.status==false){
            $rootScope.error = {
              result : true,
              message :"CAMERA permission is not turned on",
            };
          }
          else{
            FileService.capturePhoto('Leave'); // get list attached: $rootScope.listFileAttached
          }
        });
      }
      else{
        FileService.capturePhoto('Leave'); // get list attached: $rootScope.listFileAttached
      }
    }
    $scope.getPhoto = function(){
      if(device.platform=="Android"){
        ProcessService.checkPermission("READ_EXTERNAL_STORAGE").then(function(response) {
          if(response.status==false){
            $rootScope.error = {
              result : true,
              message :"READ STORAGE permission is not turned on",
            };
          }
          else{
            if($rootScope.listFileAttached.length >= 3){
              $rootScope.error = {
                result : true,
                message :"Attached list exceeds limit"
              }
              return false;
            }

            window.imagePicker.getPictures(function(results) {
              for (var i = 0; i < results.length; i++) {
                FileService.uploadPhoto(results[i],i,'Leave');
              }
            }, function (error) {
              console.log('Error: ' + error);
            } ,{
              maximumImagesCount: 3-$rootScope.listFileAttached.length,
              //quality:70,
              height:920,
              width:750

            });
            //	FileService.getPhoto(); // get list attached: $rootScope.listFileAttached
          }
        })
      }
      else{

        if($rootScope.listFileAttached.length >= 3){
          $rootScope.error = {
            result : true,
            message :"Attached list exceeds limit"
          }
          return false;
        }

        window.imagePicker.getPictures(function(results) {
          for (var i = 0; i < results.length; i++) {
            FileService.uploadPhoto(results[i],i,'Leave');
          }
        }, function (error) {
          console.log('Error: ' + error);
        } ,{
          maximumImagesCount: 3-$rootScope.listFileAttached.length,
          //quality:70,
          height:920,
          width:750

        });
        //	FileService.getPhoto(); // get list attached: $rootScope.listFileAttached
      }
    }

    $scope.removeFile = function(item) {
      var index = $rootScope.listFileAttached.indexOf(item);
      $rootScope.listFileAttached.splice(index, 1);
    }
  }// end process apply leave

  /**
   * ****************Start leave
   * cancellation***********************
   */
  processLeaveCancellation = function() {

    $scope.checkIsChecked = function(item,postion){

      item.check=item.check==false?true:false;
      $scope.listCancelLation[postion] = item;
      sessionStorage.setItem('listCancelLation',JSON.stringify($scope.listCancelLation));
    }
    if($rootScope.cache==true && sessionStorage.getItem('listCancelLation')!=null){

      $scope.listCancelLation = JSON.parse(sessionStorage.getItem('listCancelLation'));
      $rootScope.cache = false;
    }
    else{
      ProcessService.ajaxGet("MyLeaveCancellation/GetList").then(function(result) {
        data = JSON.parse(result.data);
        console.log(data);
        $scope.listCancelLation = data;
        angular.forEach($scope.listCancelLation, function(value){
          value.check = false;
        })

      });
    }

    $scope.submitCancellation = function() {
      $scope.listCancelSubmit = $scope.listCancelLation.filter(function(item) {
        return item["check"] == true;
      })
      var Uqids = Array();
      angular.forEach($scope.listCancelSubmit, function(
        value, key) {
        Uqids.push(value["Uqid"]);
      })

      if(Uqids.length ==0){
        return false;
      }
      var param = {
        Uqids : Uqids,
      };
      ProcessService.ajaxPost("MyLeaveCancellation/Submit",
        JSON.stringify(param))
        .then(
          function(result) {
            data = JSON.parse(result.data);


            $scope.processResultPost(data,$rootScope.lang.myleave.cancellation.cancellation_successful,"myLeave");


          });

    }

  }// end leave cancellation

  /** ****************Start leave detail*********************** */
  processLeaveDetail = function() {

    $scope.leaveDetail = JSON.parse(sessionStorage.getItem('leaveDetail'));
    console.log($scope.leaveDetail);
    $scope.leaveDetail.Block_Lv = $scope.leaveDetail.Block_Lv==1?true:false;
    url = $rootScope.GATEWAYURL+"/api/uploadfile/getfile?FileName="+$scope.leaveDetail.FileUrl;
    var folder = "";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
      folder =fileSystem.root.nativeURL+"Download/";
      var fileTransfer = new FileTransfer();
      $scope.$apply(function(){
        $scope.filePath = folder + $scope.leaveDetail.FileUrl;
      })

      fileTransfer.download(
        url,
        $scope.filePath,
        function(entry) {

        })
    })



  }// end leave leave detail

  /**
   * ****************Start leave Enquiry
   * ***********************
   */
  processLeaveEnquiry = function() {

    function IsVisible( Ent_By, IsTakenApplied, Apply_By)
    {
      if (Ent_By == "9" && !IsTakenApplied)
      {
        return false;
      }
      if (Apply_By != "")
      {
        if (Apply_By == "3")
        {
          return true;
        }
        else
        {
          return false;
        }
      }
      return true;
    }
    var keyColor = 0;

    ProcessService.ajaxGet("MyLeaveEnquiry/GetList").then(
      function(result) {
        data = JSON.parse(result.data);

        console.log(data);
        $scope.listLeaveEnquiry = data;
        var listColorChar = Array("aa00aa","264200","dd99dd","999999","44aa77","88bb88","cc00cc","220022","334433");

        var listColorNumber = Array(0,2,4);
        angular.forEach($scope.listLeaveEnquiry, function(value, key) {
          var cIndex = (10+value.LeaveTypeId)%8;
          var rStr = ""+(10+value.LeaveTypeId)%10;
          var rIndex = listColorNumber[(10+(10+value.LeaveTypeId)%10)%3];
          var mColor = listColorChar[cIndex];
          var lColor = mColor.replaceAt(rIndex, rStr);

          value.color =lColor;


          var txtDay = value.Applied_Day > 1 ? $rootScope.lang.general.days : $rootScope.lang.general.day;
          var txtHour = value.Applied_Hour > 1 ? $rootScope.lang.general.hours : $rootScope.lang.general.hour;
          value.Applied = IsVisible(value.Ent_By,true,value.Apply_By) ? value.Applied_Day + txtDay +" "+ accounting.formatNumber(value.Applied_Hour, 2, ',', '.') + txtHour : accounting.formatNumber(value.Applied_Day, 2, ',', '.') + txtDay;

          value.Entitle =   value.Ent_By==9 ? "" : accounting.formatNumber(value.Entitle, 2, ',', '.');

          value.Earned =  value.Ent_By==9 ? "" : accounting.formatNumber(value.Earned, 2, ',', '.');

          value.BF  =    value.Ent_By==9 ? "" : IsVisible(value.Ent_By,false,value.Apply_By) ? value.BF_Day + "<br/>" +accounting.formatNumber(value.BF_Hour, 2, ',', '.') :accounting.formatNumber(value.BF_Day, 2, ',', '.');

          value.In_Lieu = value.Ent_By==9 ? "" : IsVisible(value.Ent_By,false,value.Apply_By) ? value.InLieu_Day + "<br/>" +accounting.formatNumber(value.InLieu_Hour, 2, ',', '.'):accounting.formatNumber(value.InLieu_Day, 2, ',', '.');
          value.Taken = IsVisible(value.Ent_By,true,value.Apply_By) ? value.Taken_Day +"<br/>"+ accounting.formatNumber(value.Taken_Hour, 2, ',', '.') : accounting.formatNumber(value.Taken_Day, 2, ',', '.');
          value.Bal = value.Ent_By==9 ? "" : IsVisible(value.Ent_By,false,value.Apply_By) ? value.Balance_Day + "<br/>"+ accounting.formatNumber(value.Balance_Hour, 2, ',', '.') : accounting.formatNumber(value.Balance_Day, 2, ',', '.');

          value.YearEndBal = value.Ent_By==9 ? "" : IsVisible(value.Ent_By,false,value.Apply_By) ? value.YearEndBalance_Day + "<br/>"+ accounting.formatNumber(value.YearEndBalance_Hour, 2, ',', '.') : accounting.formatNumber(value.YearEndBalance_Day, 2, ',', '.');




        })


      });

    $scope.setCharacter = function(index) {

      number = index + 1;

      if (number % 3 == 0) {
        ch = "H";
      }

      else {
        level = Math.floor((number / 3));

        if (number == (2 * (level + 1)) + level) {
          ch = "S";
        } else {
          ch = "A";

        }
      }

      return ch;
    }
  };// end leave leave Enquiry

  /** ****************Start leave taken*********************** */
  processLeaveEnquiryDetail = function() {
    $scope.title = $routeParams.StatusType==1?$rootScope.lang.myleave.enquiry.pending:$rootScope.lang.myleave.enquiry.taken;

    var param = {
      LcEntitleId : $routeParams.id,
      StatusType: $routeParams.StatusType
    };
    ProcessService.ajaxPost("MyLeaveEnquiry/GetAllLeave",
      JSON.stringify(param)).then(function(result) {
      data = JSON.parse(result.data);
      $scope.leaveEnquiryTaken = data;
    })


  }// end leave leave taken




  /**
   * ****************Start leave
   * calendar***********************
   */
  processLeaveCalendar = function() {

    $scope.events = null;
    var d = sessionStorage.getItem('currentMonth')!=null ? new Date(sessionStorage.getItem('currentMonth')):new Date();
    $scope.currentYear = d.getFullYear();
    $scope.currentMonth = d.getMonth() + 1;
    var dateCompare =  DateTimeService.dateFormat(d, "month")+"/"+DateTimeService.dateFormat(d, "year");
    if(sessionStorage.getItem('listLeaveCalendar')!=null){

      listEvents  = processListCalendar(JSON.parse(sessionStorage.getItem('listLeaveCalendar')));
      $scope.events = listEvents;
    }
    else{
      loadData();
    }
    // Optimal Performance only fillter date follow current month
    function filterEventsByMonth(listEvents){
      $scope.events = listEvents.filter(function(item) {
        var my = DateTimeService.dateFormat(item["Date"], "month")+"/"+DateTimeService.dateFormat(item["Date"], "year");
        return (my == dateCompare);
      });
    }
    $scope.getSelectYear = function(arg) {

      var year = DateTimeService.dateFormat(arg, "year");
      dateCompare =  DateTimeService.dateFormat(arg, "month")+"/"+DateTimeService.dateFormat(arg, "year");
      if (year != $scope.currentYear) {
        $scope.currentYear = year;
        loadData();
      } else {
        listEvents = processListCalendar(JSON.parse(sessionStorage.getItem('listLeaveCalendar')));
        filterEventsByMonth(listEvents);
      }

    }

    function loadData() {
      var param = {
        year : $scope.currentYear,
      };

      ProcessService.ajaxPost("MyLeaveCalendar/GetListByYear",JSON.stringify(param)).then(function(result) {

        var data = JSON.parse(result.data);
        $rootScope.offDayData = data.OffDayData
        console.log(data);
        listEvents = processListCalendar(data.Data);
        sessionStorage.setItem('listLeaveCalendar',JSON.stringify(data.Data));
        filterEventsByMonth(listEvents);
      });

    }

    function processListCalendar(listLeaveCalendar) {

      events = Array();
      angular.forEach(listLeaveCalendar,function(value, key) {
        if(value !=null){
          if (value.Type == "Applied" || value.Type == "Taken") {

            var fromDate = DateTimeService.parseDate(value.Date_Fr_Str);
            var toDate = DateTimeService.parseDate(value.Date_To_Str);

            diff = DateTimeService.daydiff(fromDate,
              toDate);

            if (diff > 0) {
              for(var k=0;k<=11;k++){
                lastDay = new Date($scope.currentYear,k+1,0); // get last day of month
                lastDay = DateTimeService.dateFormat(lastDay,"day"); // format last day to "dd"
                for (var i = 1; i <=lastDay; i++) {

                  date = new Date($scope.currentYear,k,i);
                  // if(DateTimeService.checkSunAndSat(date)==false){
                  var dayOfWeek = date.getDay()+1;

                  if($rootScope.offDayData!=null && (dayOfWeek != $rootScope.offDayData.OffDay || $rootScope.offDayData.OffDay_HalfDay==true) && (dayOfWeek != $rootScope.offDayData.RestDay || $rootScope.offDayData.RestDay_HalfDay==true)){
                    if (fromDate <= date && date <= toDate) {


                      events.push({
                        "Date" : angular.copy(date),
                        "CssClass" : value.Type,
                        "Title" : value.Legend,
                        "URL" : "#leaveCalendarDetail",
                        "Description" : [ {title:value.Description,class : value.Type}],

                      });
                    }
                  }
                }
              }

            } // end if diff>0
            else {
             // if(DateTimeService.checkSunAndSat(date)==false){
              var dayOfWeek = date.getDay()+1;

              if($rootScope.offDayData!=null && (dayOfWeek != $rootScope.offDayData.OffDay || $rootScope.offDayData.OffDay_HalfDay==true) && (dayOfWeek != $rootScope.offDayData.RestDay || $rootScope.offDayData.RestDay_HalfDay==true)){
                events.push({
                  "Date" : angular.copy(fromDate),
                  "CssClass" : value.Type,
                  "Title" : value.Legend,
                  "URL" : "#leaveCalendarDetail",
                  "Description" : [ {title:value.Description,class : value.Type} ]
                });
              }
            }


          } else {

            var fromDate = DateTimeService.parseDate(value.Date_Fr_Str);

            events.push({
              "Date" : angular.copy(fromDate),
              "CssClass" : value.Type,
              "Title" : value.Legend,
              "URL" : "#leaveCalendarDetail",
              "Description" : [{title:value.Description,class : value.Type} ]
            });

          }
        }


      })



      for (var i = 0; i < events.length; ++i) {



        for (var j = i+1; j <events.length ; ++j) {

          if (DateTimeService.dateFormat(events[i]["Date"],"shortDate") == DateTimeService.dateFormat(events[j]["Date"],"shortDate")) {
            // only push data when Type Applied or Taken
            // if type ph not push data
            if(events[i].CssClass == "PH"){
              events.splice(j--, 1);
            }

            else{
              // if events j type # PH push data events i
              if(events[j].CssClass != "PH"){

                events[i]["Description"].push({title:events[j]["Description"][0].title,class:events[j]["CssClass"]});
                events[i]["Title"] = events[j]["Title"];
              }
              // set events i = events j
              else{
                events[i] = events[j];

              }
              events.splice(j--, 1);
            }

          }
        }


      }

      return events;

    }




  }// end leave calendar

  processLeaveLegend = function(){
    ProcessService.ajaxGet("MyLeaveCalendar/GetListEntitle").then(function(result) {
      data = JSON.parse(result.data);
      $scope.listLegend = data;
    })
  }

  /**
   * ****************Start leave calendar
   * detail***********************
   */
  processLeaveCalendarDetail = function() {
    $scope.leaveCalendarDetail = JSON.parse(sessionStorage
      .getItem('calendarDetail'));

    $scope.leaveCalendarDetail.Date = DateTimeService.dateFormat(
      $scope.leaveCalendarDetail.Date, "longDate");

  }// end leave calendar detail

  /** ****************Start leave plan*********************** */
  processLeavePlan = function() {
    if(!$rootScope.filter1){
      $rootScope.filter1  = {
        Description: "N/A",
        Id: "",
        Language: 1,
        Opt: 0
      }
    }
    if(!$rootScope.filter2) {
      $rootScope.filter2 = {
        Description: "N/A",
        Id: "",
        Language: 1,
        Opt: 0
      }
    }
    $rootScope.listSelectedFilter1  = [];
    $rootScope.listSelectedFilter2  = [];
    $scope.selectFilter = function (type,item) {
      $scope.typeFilter = type;
      if(type=="filter1"){
        if(item.Opt==$rootScope.filter2.Opt)
          return false
        $rootScope.filter1 = item
        opt = $rootScope.filter1.Opt;
      }
      else{
        if(item.Opt==$rootScope.filter1.Opt)
          return false
        $rootScope.filter2 = item;
        opt = $rootScope.filter2.Opt
      }
      var param = {
        Filter1:  opt,
        Filter2: ""
      };

      ProcessService.ajaxPost("MyLeavePlan/GetDataClbByAction",JSON.stringify(param)).then(function(result) {

        $scope.clbByAction = {
          title : item.Description,
          list:JSON.parse(result.data)
        }
        $(".modal").hide();
        $(".modal").removeClass("zoomIn");
        setTimeout(function () {
          $("#clbByAction").removeClass("zoomOut");
          $("#clbByAction").addClass("zoomIn");
          $("#clbByAction").show();
          $("#clbByAction").css({ left: ($(window).width() - $("#clbByAction").width()) / 2, top: ($(window).height() - $("#clbByAction").height()) / 2 });
        },100)


      })
    }
    $scope.isDisableFilter = function (opt,type) {
      if(type=="filter1"){
        return (opt==$rootScope.filter2.Opt);
      }
      else{
        return (opt==$rootScope.filter1.Opt);
      }

    };
    $scope.checkListFilter = function (id) {
      var temp = $scope.typeFilter=='filter1'? $rootScope.listSelectedFilter1: $rootScope.listSelectedFilter2;

      if(temp.indexOf(id)== -1){
        temp.push(id);
      }
      else{
        angular.forEach(temp,function (value,index) {

          if(value==id){
            temp.splice(index, 1);
            return false;
          }

        })
      }
      if($scope.typeFilter=='filter1'){
        $rootScope.listSelectedFilter1 = temp;
      }
      else{
        $rootScope.listSelectedFilter2 = temp;
      }


    }
    $scope.checkActiveFilter = function (id) {
      if( $scope.typeFilter=='filter1') {
        return  ($rootScope.listSelectedFilter1.indexOf(id) > -1)
      }
      else{
        return ($rootScope.listSelectedFilter2.indexOf(id) > -1)
      }
    }


    $scope.refreshCalendarByFilter = function () {
      if( $scope.filter1.Id !="" || $scope.filter2.Id !="")
        loadData();

    }


    var d = sessionStorage.getItem('currentMonth')!=null?new Date(sessionStorage.getItem('currentMonth')):new Date();
    $scope.currentYear = d.getFullYear();
    $scope.currentMonth = d.getMonth() + 1;
    if(sessionStorage.getItem('listLeaveCalendar')!=null){

      $scope.events = processListCalendar(JSON.parse(sessionStorage.getItem('listLeaveCalendar')));
    }
    else{
      loadData();
    }

    $scope.getSelectYear = function(arg) {

      var year = DateTimeService.dateFormat(arg, "year");
      var month = DateTimeService.dateFormat(arg, "month");
      //if (month != $scope.currentMonth) {
      $scope.currentYear = year;
      $scope.currentMonth = month;
      loadData();
      //}

    }
    function loadData() {

      var param = {
        Year : $scope.currentYear,
        Month : $scope.currentMonth,
        Filter1: $rootScope.filter1.Opt,
        SelectedFilter1: $rootScope.listSelectedFilter1.toString(),
        Filter2: $rootScope.filter2.Opt,//
        SelectedFilter2: $rootScope.listSelectedFilter2.toString()
      };

      ProcessService.ajaxPost("MyLeavePlan/GetListByYearMonth",JSON.stringify(param)).then(function(result) {

        var data = JSON.parse(result.data);
        $rootScope.listFilter = data.ListFilter;
        $rootScope.offDayData = data.OffDayData;
        $rootScope.showTakenAppliedOnPHDay = data.ShowTakenAppliedOnPHDay;
        $rootScope.Is_OrgId_KS = data.Is_OrgId_KS;
        console.log(data)
        sessionStorage.setItem('listLeaveCalendar',JSON.stringify(data.Data));
        $scope.events = processListCalendar(data.Data);
      });

    }
    function groupBy(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    function processListCalendar(listLeaveCalendar) {
      events = Array();

      angular.forEach(listLeaveCalendar,function(value, key) {

        if (value.Type == "Applied"	|| value.Type == "Taken") {

          var fromDate = DateTimeService.parseDate(value.Date_Fr_Str);
          var toDate = DateTimeService.parseDate(value.Date_To_Str);

          diff = DateTimeService.daydiff(fromDate,
            toDate);

          if (diff > 0) {
            lastDay = new Date($scope.currentYear,$scope.currentMonth,0); // get last day of month
            lastDay = DateTimeService.dateFormat(lastDay,"day"); // format last day to "dd"
            for (var i = 1; i <= lastDay; i++) {

              var date = new Date(
                $scope.currentYear,
                $scope.currentMonth - 1,
                i);
              //if(DateTimeService.checkSunAndSat(date)==false){  // if other sat and sun
              var dayOfWeek = date.getDay()+1;

              if($rootScope.offDayData!=null && (dayOfWeek != value.OffDay || value.OffDay_HalfDay==true) && (dayOfWeek != value.RestDay || value.RestDay_HalfDay==true)){
                if (fromDate <= date && date <= toDate) {

                  events.push({
                    "Date" : angular.copy(date),
                    "CssClass" : value.Type,
                    "First_Ctry":value.First_Ctry,
                    "ShowLegend": value.ShowLegend,
                    "Title" : value.Legend.substring(0, 2),
                    "URL" : "#leaveCalendarDetail",
                    "Name" :  {title:value.Name,class : value.Type}
                  });
                }
              }
            }

          } // end if diff>0
          else {

           // if(DateTimeService.checkSunAndSat(date)==false){ // if other sat and sun
            var dayOfWeek = fromDate.getDay()+1;
            if($rootScope.offDayData!=null && (dayOfWeek != $rootScope.offDayData.OffDay || $rootScope.offDayData.OffDay_HalfDay==true) && (dayOfWeek != $rootScope.offDayData.RestDay || $rootScope.offDayData.RestDay_HalfDay==true)) {
              events.push({
                "Date": angular.copy(fromDate),
                "CssClass": value.Type,
                "First_Ctry":value.First_Ctry,
                "ShowLegend": value.ShowLegend,
                "Title": value.Legend,
                "URL": "#leaveCalendarDetail",
                "Name": {title: value.Name, class: value.Type}
              });
            }
            //}
          }

        } else {
          var fromDate = DateTimeService.parseDate(value.Date_Fr_Str);
          // var date = new Date(fromDate)
          //  var dayOfWeek = date.getDay()+1;
          //  if(dayOfWeek != $rootScope.offDayData.OffDay || $rootScope.offDayData.OffDay_HalfDay==true) {

          events.push({
            "Date": angular.copy(fromDate),
            "CssClass": value.Type,
            "First_Ctry":value.First_Ctry,
            "ShowLegend": value.ShowLegend,
            "Title": value.Legend.substring(0, 2),
            "URL": "#leaveCalendarDetail",
            "Name": {title: value.Name, class: value.Type}
          });
        }
        //	}

      })
      var groups = groupBy(events,'Date');
      var user = $.jStorage.get('user');
      var events = [];
      for(var key in groups){
        var group = groups[key];
        if(group.length>0){
          var obj = {
            CssClass:group[0].CssClass,
            Date:group[0].Date,
            ShowLegend:group[0].ShowLegend,
            Title:group[0].Title,
            URL:group[0].URL,
            Name:[]
          }
         var ctry = null;
          var checkPH = false;
          for(var key2 in group){
            // if(group[key2].CssClass == "PH" && $rootScope.showTakenAppliedOnPHDay==true){
            //   obj.Name.push(group[key2].Name);
            // }
            if(group[key2].ShowLegend==true){
              obj.Title = group[key2].Title.substring(0, 2);
            }
            if($rootScope.showTakenAppliedOnPHDay==false){
             // if(group[key2].CssClass != "PH"){
                obj.Name.push(group[key2].Name);
              //}
            }
            else{

              if(group[key2].CssClass=='PH'){
                obj.Name = [group[key2].Name];
                ctry = group[key2].First_Ctry;
                checkPH = true;
              }
              else if(checkPH==false || (ctry!=null && ctry != group[key2].First_Ctry)){
                obj.Name.push(group[key2].Name);
              }

            }

          }
        }
        events.push(obj);
      }
      // for (var i = 0; i < events.length; ++i) {
      //
      //   for (var j = i + 1; j < events.length; ++j) {
      //     if (DateTimeService.dateFormat(events[i]["Date"],"shortDate") == DateTimeService.dateFormat(events[j]["Date"],"shortDate")) {
      //
      //       // only push data when Type Applied or Taken
      //       // if type ph not push data
      //
      //       if(events[i].CssClass == "PH" && $rootScope.showTakenAppliedOnPHDay==true){
      //         events.splice(j--, 1);
      //       }
      //
      //       else{
      //         // if events j type # PH push data events i
      //         if(events[j].CssClass != "PH"){
      //
      //           events[i]["Name"].push({title:events[j]["Name"][0].title,class:events[j]["CssClass"]});
      //           events[i]["CssClass"] = events[j]["CssClass"];
      //
      //           // check ShowLegend==true show title
      //           if(events[i]["ShowLegend"]==true){
      //             events[i]["Title"] = events[i]["Title"].substring(0, 2);
      //           }
      //           else if(events[j]["ShowLegend"]==true){
      //             events[i]["Title"] =  events[j]["Title"].substring(0, 2);
      //           }
      //
      //         }
      //         // set events i = events j
      //         else{
      //           events[i] = events[j];
      //
      //         }
      //         events.splice(j--, 1);
      //       }
      //
      //     }
      //   }
      // }
      console.log("event");
      console.log(events);
      return events;


    }


  }// end leave plan

  /**
   * ****************Start leave plan
   * detail***********************
   */
  processLeavePlanDetail = function() {

    $scope.leavePlanDetail = JSON.parse(sessionStorage
      .getItem('calendarDetail'));



    $scope.leavePlanDetail.Date = DateTimeService.dateFormat(
      $scope.leavePlanDetail.Date, "longDate");


  }// end leave plan detail

  /**
   * ****************Start leave
   * Approval***********************
   */
  processLeaveApproval = function() {
    if($rootScope.cache==true && sessionStorage.getItem('listApproval')!=null){

      $scope.listApproval = JSON.parse(sessionStorage.getItem('listApproval'));
      $rootScope.cache = false;
    }
    else{
      var listColorChar = Array("aa00aa","ffffff","dd99dd","999999","44aa77","88bb88","cc00cc","220022","334433");
      ProcessService.ajaxGet("MyLeaveApproval/GetList").then(
        function(result) {
          data = JSON.parse(result.data);
          console.log(data);
          $scope.listApproval = data;
          var count = 1;
          angular.forEach($scope.listApproval,function(value, index) {
            //value.color = "color-" + count;
            //count = (count >= 4) ? 1 : count + 1;
            //value.char = value.LeaveDesc.substr(0, 1);
            var listColorNumber = Array(0,2,4);

            var cIndex = (10+value.LeaveTypeId)%8;
            var rStr = ""+(10+value.LeaveTypeId)%10;
            var rIndex = listColorNumber[(10+(10+value.LeaveTypeId)%10)%3];
            var mColor = listColorChar[cIndex];
            var lColor = mColor.replaceAt(rIndex, rStr);

            value.color =lColor;
          })
        });
    }

    $scope.isCheck = function(item, type) {
      if (type == "Approved") {
        item.Reject = false;
      } else {
        item.Approved = false;
      }
      sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));

    }
    $scope.submitApproval = function() {

      var param = {
        Uqids : [  ],
        Actions : [ ], // 1 Approved, 2 Reject
        Remarks : [], // remark item
      };
      $scope.listApprovalSubmit = $scope.listApproval.filter(function(item) {
        return (item["Approved"] == true || item["Reject"] == true);
      })

      if($scope.listApprovalSubmit.length == 0)
        return false;
      angular.forEach($scope.listApprovalSubmit, function(value,index){
        param.Uqids.push(value.Uqid);
        var action = (value["Approved"]==true) ? 1 : 2;
        param.Actions.push(action);
        var remarks =  null;
        param.Remarks.push(remarks);
      })

      ProcessService.ajaxPost("MyLeaveApproval/Submit",JSON.stringify(param)).then(function(result) {
        sessionStorage.removeItem('listApproval');
        data = JSON.parse(result.data);
        var message = "";
        $scope.processResultPost(data,message);

      });


    }

  }// end leave approval



  /**
   * ****************Start leave
   * Approval***********************
   */
  processLeaveAdminApproval = function() {
    if($rootScope.cache==true && sessionStorage.getItem('listApproval')!=null){

      $scope.listApproval = JSON.parse(sessionStorage.getItem('listApproval'));
      $rootScope.cache = false;
    }
    else{
      var listColorChar = Array("aa00aa","ffffff","dd99dd","999999","44aa77","88bb88","cc00cc","220022","334433");
      ProcessService.ajaxGet("MyLeaveAdminApproval/GetList").then(function(result) {
        data = JSON.parse(result.data);
        console.log(data);
        $scope.listApproval = data;
        var count = 1;
        angular.forEach($scope.listApproval,function(value, index) {
          /*value.color = "color-" + count;
           count = (count >= 4) ? 1 : count + 1;
           value.char = value.LeaveDesc.substr(0, 1);*/
          var listColorNumber = Array(0,2,4);

          var cIndex = (10+value.LeaveTypeId)%8;
          var rStr = ""+(10+value.LeaveTypeId)%10;
          var rIndex = listColorNumber[(10+(10+value.LeaveTypeId)%10)%3];
          var mColor = listColorChar[cIndex];
          var lColor = mColor.replaceAt(rIndex, rStr);

          value.color =lColor;
        })
      });
    }
    $scope.isCheck = function(item, type) {
      if (type == "Approved") {
        item.Reject = false;
      } else {
        item.Approved = false;
      }
      sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));

    }
    $scope.submitApproval = function() {

      var param = {
        Uqids : [],
        Actions : [], // 1 Approved, 2 Reject
        Remarks : [], // remark item
      };
      $scope.listApprovalSubmit = $scope.listApproval.filter(function(item) {
        return (item["Approved"] == true || item["Reject"] == true);
      })
      if($scope.listApprovalSubmit.length == 0)
        return false;

      angular.forEach($scope.listApprovalSubmit, function(value,index){
        param.Uqids.push(value.Uqid);
        var action = (value["Approved"]==true) ? 1 : 2;
        param.Actions.push(action);
        var remarks = null;
        param.Remarks.push(remarks);
      })

      ProcessService.ajaxPost("MyLeaveAdminApproval/Submit",JSON.stringify(param)).then(
        function(result) {
          sessionStorage.removeItem('listApproval');
          data = JSON.parse(result.data);
          var message = "";
          $scope.processResultPost(data,message);

        });


    }

  }// end leave approval


  processLeaveDelegate = function() {

    $scope.field = {
      ReRoute_Fr_String: "",
      ReRoute_To_String: "",
    };
    ProcessService.ajaxGet("MyLeaveDelegate/GetDetail").then(function(result) {
      data = JSON.parse(result.data);
      var durationDescription = null;
      var fromDate = data.Date_fr != null ? DateTimeService.parseDate(data.Date_fr):null;
      var toDate   = data.Date_to != null ? DateTimeService.parseDate(data.Date_to):null;
      if(data.Duration != ""){
        durationDescription = data.Duration>1 ? " "+$rootScope.lang.general.days: " "+$rootScope.lang.general.day;
      }
      $scope.field = {
        Esec_Id_Re: {Id:data.ApprovingId,Name:data.ApprovingOfficer},
        ReRoute_Fr_String: fromDate,
        ReRoute_To_String: toDate,
        duration:durationDescription!=null? {num:data.Duration,description : data.Duration + durationDescription}:{num:0,description:""}
      };


    });

    //Get list employee
    ProcessService.ajaxGet("MyLeaveDelegate/GetListEmployee").then(
      function(result) {
        data = JSON.parse(result.data);
        $scope.listEmployee = data;
        //console.log($scope.listEmployee);

        $scope.listEmployee.splice(0, 0, {Id: 0,Name: $rootScope.lang.general.none});
      });

    $scope.selectApprovingOfficer = function(value) {
      $scope.field.Esec_Id_Re = value;
    }



    $scope.selectDate = function(field) {
      var field2  = field == "ReRoute_Fr_String"?"ReRoute_To_String":"ReRoute_Fr_String";

      var date = angular.copy(DateTimeService.selectDate);
      date = new Date(date.year,date.month-1,date.day);
      temp = $scope.field[field];
      $scope.field[field] = date;


      var fromDate = DateTimeService.dateFormat($scope.field.ReRoute_Fr_String,"mediumDate3");
      fromDate = DateTimeService.parseDate(fromDate);

      var toDate = DateTimeService.dateFormat($scope.field.ReRoute_To_String,"mediumDate3");
      toDate = DateTimeService.parseDate(toDate);


      var num = Math.ceil(DateTimeService.daydiff(fromDate, toDate));

      if (num <= 0 && $scope.field[field] !="" && $scope.field[field2]!="") {
        if(field=="ReRoute_Fr_String"){
          $scope.field[field2] = $scope.field[field];
          num = 1;
        }
        else{
          $rootScope.error = {
            result : true,
            message : $rootScope.lang.myleave.apply.validation.to_is_less_than_from_date
          }
          num = 0;
          $scope.field[field] = temp;
          return false;
        }



      }

      $(".overlay").hide();
      $(".modal").hide();
      var typeDuration = num > 1 ? " "+$rootScope.lang.general.days: " "+$rootScope.lang.general.day;
      $scope.field.duration = {
        num : num,
        description : num + typeDuration
      };

    }

    $scope.submitLeaveDelegate = function() {

      if ($scope.field.duration.num<1) {
        $rootScope.error = {
          result : true,
          message : $rootScope.lang.general.please_enter +" "+$rootScope.lang.myleave.delegate.tt +" "+$rootScope.lang.myleave.apply.period
        };
        return false;
      }

      if($scope.field.Esec_Id_Re.Id==null){

        $rootScope.error = {
          result : true,
          message : $rootScope.lang.myleave.delegate.please_select_an_approving_officer
        };
        return false;
      }



      var param = {
        IdOfficer:$scope.field.Esec_Id_Re.Id,
        DateFr: DateTimeService.parseMilliSecondToUTC($scope.field.ReRoute_Fr_String),
        DateTo: DateTimeService.parseMilliSecondToUTC($scope.field.ReRoute_To_String),

      };


      ProcessService.ajaxPost("MyLeaveDelegate/Submit",JSON.stringify(param)).then(function(result) {
        data = JSON.parse(result.data);
        $scope.processResultPost(data,"","myLeave");
      });

    }

  }






  switch ($location.path()) {

    case "/leaveApply":
      processLeaveApply();
      break;
    case "/leaveEnquiry":
      processLeaveEnquiry();
      break;

    case "/leaveEnquiryDetail/" + $routeParams.id + "/"+$routeParams.StatusType:
      processLeaveEnquiryDetail();
      break;



    case "/leaveCancellation":
      processLeaveCancellation();
      break;

    case "/leaveDetail":
      processLeaveDetail();
      break;

    case "/leaveCalendar":
      processLeaveCalendar();
      break;

    case "/leaveCalendarDetail":
      processLeaveCalendarDetail();
      break;


    case "/leaveLegend":
      processLeaveLegend();
      break;




    case "/leavePlan":
      processLeavePlan();
      break;

    case "/leavePlanDetail":
      processLeavePlanDetail();
      break;

    case "/leaveApproval":
      processLeaveApproval();
      break;

    case "/leaveAdminApproval":
      processLeaveAdminApproval();
      break;

    case "/leaveDelegate":
      processLeaveDelegate();
      break;

    case "/myLeave":
      $rootScope.cache = false;
      sessionStorage.removeItem("listCancelLation");
      sessionStorage.removeItem('currentMonth');
      sessionStorage.removeItem('listApproval');
      sessionStorage.removeItem('listLeaveCalendar');
      delete  $rootScope.listFilter;
      delete  $rootScope.filter1;
      delete  $rootScope.filter2;
      break;

  }





});

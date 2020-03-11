App.registerCtrl('myClaimCtrl', function($scope,$rootScope,$routeParams,$location,$templateCache,ProcessService,DateTimeService,FileService,PoupService)
{
/***********************set list menu claim**********************/
$scope.listMenuClaim = [
					{
						id:708,href:"claimOvertime",icon:"ic_overtime.png",name:$rootScope.lang.myclaim.ot.tt,description:$rootScope.lang.myclaim.ot.ct,background:"background-88b824",
						submemu:[
								{id:709,href:"claimOvertimeApply",icon:"ot709.png",name:$rootScope.lang.myclaim.ot.apply.tt,description:$rootScope.lang.myclaim.ot.apply.ct},
								{id:710,href:"claimOvertimeCancellation",icon:"ot710.png",name:$rootScope.lang.general.cancellation,description:$rootScope.lang.myclaim.ot.cancellation.ct},
								{id:711,href:"claimOvertimeEnquiry",icon:"ot711.png",name:$rootScope.lang.general.enquiry,description:$rootScope.lang.myclaim.ot.enquiry.ct},
								{id:712,href:"claimOvertimeApproval",icon:"ot712.png",name:$rootScope.lang.general.approval,description:$rootScope.lang.myclaim.ot.approval.ct},
								{id:713,href:"claimOvertimeDelegate",icon:"ot713.png",name:$rootScope.lang.general.delegate,description:$rootScope.lang.myclaim.ot.delegate.ct},

							]
						},

					{id:714,href:"claimBenefit",icon:"ic_benefit.png",name:$rootScope.lang.myclaim.ben.tt,description:$rootScope.lang.myclaim.ben.ct,background:"background-059b90",
					submemu:[
								{id:715,href:"claimBenefitApply",icon:"ben715.png",name:$rootScope.lang.myclaim.ben.apply.tt,description:$rootScope.lang.myclaim.ben.apply.ct},
								{id:1009,href:"claimBenefitSubmitSavesClaims",icon:"ben1009.png",name:$rootScope.lang.myclaim.sc.tt,description:$rootScope.lang.myclaim.sc.ct},
								{id:716,href:"claimBenefitCancellation",icon:"ben716.png",name:$rootScope.lang.general.cancellation,description:$rootScope.lang.myclaim.ben.cancellation.ct},
								{id:717,href:"claimBenefitEnquiry",icon:"ben717.png",name:$rootScope.lang.general.enquiry,description:$rootScope.lang.myclaim.ben.enquiry.ct},
								{id:718,href:"claimBenefitApproval",icon:"ben718.png",name:$rootScope.lang.general.approval,description:$rootScope.lang.myclaim.ben.approval.ct},
								{id:719,href:"claimBenefitDelegate",icon:"ben719.png",name:$rootScope.lang.general.delegate,description:$rootScope.lang.myclaim.ben.delegate.ct},

							]
					},
					{id:720,href:"claimReimbursement",icon:"ic_expense.png",name:$rootScope.lang.myclaim.reim.tt,description:$rootScope.lang.myclaim.reim.ct,background:"background-28903b",
					submemu:[
								{id:721,href:"claimReimbursementApply",icon:"ex721.png",name:$rootScope.lang.myclaim.reim.apply.tt,description:$rootScope.lang.myclaim.reim.apply.ct},
								{id:1009,href:"claimReimbursementSubmitSavesClaims",icon:"ex1009.png",name:$rootScope.lang.myclaim.sc.tt,description:$rootScope.lang.myclaim.sc.ct},
								{id:722,href:"claimReimbursementCancellation",icon:"ex722.png",name:$rootScope.lang.general.cancellation,description:$rootScope.lang.myclaim.reim.cancellation.ct},
								{id:723,href:"claimReimbursementEnquiry",icon:"ex723.png",name:$rootScope.lang.general.enquiry,description:$rootScope.lang.myclaim.reim.enquiry.ct},
								{id:724,href:"claimReimbursementApproval",icon:"ex724.png",name:$rootScope.lang.general.approval,description:$rootScope.lang.myclaim.reim.approval.ct},
								{id:725,href:"claimReimbursementDelegate",icon:"ex725.png",name:$rootScope.lang.general.delegate,description:$rootScope.lang.myclaim.reim.delegate.ct},

							]
					},
					{id:726,href:"claimRequestForPayment",icon:"req_pay_ico.png",name:$rootScope.lang.myclaim.pay.tt,description:$rootScope.lang.myclaim.pay.ct,background:"background-718138",
					submemu:[
								{id:727,href:"claimRequestForPaymentApply",icon:"pm727.png",name:$rootScope.lang.myclaim.pay.apply.tt,description:$rootScope.lang.myclaim.pay.apply.ct},
								{id:728,href:"claimRequestForPaymentCancellation",icon:"pm728.png",name:$rootScope.lang.general.cancellation,description:$rootScope.lang.myclaim.pay.cancellation.ct},
								{id:729,href:"claimRequestForPaymentEnquiry",icon:"pm729.png",name:$rootScope.lang.general.enquiry,description:$rootScope.lang.myclaim.pay.enquiry.ct},
								{id:730,href:"claimRequestForPaymentApproval",icon:"pm730.png",name:$rootScope.lang.general.approval,description:$rootScope.lang.myclaim.pay.approval.ct},
								{id:731,href:"claimRequestForPaymentDelegate",icon:"pm731.png",name:$rootScope.lang.general.delegate,description:$rootScope.lang.myclaim.pay.delegate.ct},

							]
					},


        {id:1423,href:"travelRequest",icon:"req_pay_ico.png",name:'Travel Request',description:'Travel Request',background:"background-718138",
          submemu:[
            {id:1424,href:"travelRequestApproval",icon:"n_ic_leave_approval.png",name:$rootScope.lang.myleave.approval.tt,description:$rootScope.lang.myleave.approval.ct},
          ]
        },

					]


	/***********************General function**********************/
	$scope.checkFutureDate = function(date){
			currentDate = new Date();
			currentDate = DateTimeService.dateFormat(currentDate,"mediumDate3");
			currentDate = DateTimeService.parseDate(currentDate);

			var toDate = DateTimeService.dateFormat(date,"mediumDate3");
			toDate = DateTimeService.parseDate(toDate);
			if(DateTimeService.daydiff(currentDate,toDate)>1){
				$rootScope.error = {
					result  : true,
					message : $rootScope.lang.myclaim.validation.future_date_not_allowed
				};
				return false;
			};
			return true;
	}
 	$scope.isRequired = function(required) {
		return (required == 1);
	}

	$scope.isActive = function (item1,item2) {

		 return (item1==item2);
	};


	processClaimOvertimeApply = function(){
		var date = new Date();
		$scope.currentDate = sessionStorage.getItem('currentMonth')!=null?new Date(sessionStorage.getItem('currentMonth')):date;

			if($.jStorage.get("OTData")==null){
		  // load OTTypes and WeekOT
			ProcessService.ajaxGet("MyClaimsOvertimeClaimApplyOvertime/PageLoad").then(function(result) {

							  var data = JSON.parse(result.data);

							  if(data.RoleAccess==0){
							    $rootScope.success = {
									result : true,
									title:	  $rootScope.lang.general.alert,
									message : $rootScope.lang.general.not_entitled_to +" "+$rootScope.lang.myclaim.tt,
									callBack: function(){
										 $rootScope.success.result = false;
										 history.back(-1);
									}
								}

							};

							if( $.jStorage.get("OTData")!=null){
							 	 OTData = $.jStorage.get("OTData");
							 	 OTData.OTTypes = data.OTTypes;
								 OTData.WeekOT = data.WeekOT;
								 $.jStorage.set("OTData",OTData);
							  }else{
								 $.jStorage.set("OTData",data);
							  }
							getDataByMonthAndYear();

						  })

			}
			else{
				$scope.getListApplyOverTime = $.jStorage.get("OTData").ListData;
				console.log($scope.getListApplyOverTime);
				processListCalendar();
			}
		// get Data by month and year
		 function getDataByMonthAndYear(){
			  var param = {
              Year: $scope.currentDate.getFullYear(),
              Month: $scope.currentDate.getMonth()+1
        };

			ProcessService.ajaxPost("MyClaimsOvertimeClaimApplyOvertime/GetList",JSON.stringify(param)).then(function(result) {
					  data = JSON.parse(result.data);
					   console.log(data);

					  if($.jStorage.get("OTData")!=null){
						 OTData = $.jStorage.get("OTData");
						 OTData.ListData = data;
						 $.jStorage.set("OTData",OTData);
					  }
					  else{
						   OTData = {ListData:data};
						   $.jStorage.set("OTData",OTData);
					  }

					  $scope.getListApplyOverTime = data;
					  processListCalendar();
			})
		}


		$scope.getSelectMonth = function(arg) {
					$scope.currentDate = new Date(arg);
					getDataByMonthAndYear();
	    }



	function processListCalendar() {
	$scope.events = Array();

			for (var i = 1; i <= 31; i++) {
				var title = "";
				angular.forEach($scope.getListApplyOverTime.PhDays,function(value, key) {

					if(value==i){
						title = "PH";
						date = new Date($scope.currentDate.getFullYear(),$scope.currentDate.getMonth(),i);
						$scope.events.push({
							"Date" : angular.copy(date),
							"CssClass" : "ot-ph",
							"Title" : title,
							"URL" : "#claimOvertimeApplyDetail",
						});
						return false;
					}

				})


				angular.forEach($scope.getListApplyOverTime.OverTimes,function(value, key) {

					if(value.Date==i){
						title = "OT";
						cssClass = value.Status==2?"ot-approved":"ot-pending";
						date = new Date($scope.currentDate.getFullYear(),$scope.currentDate.getMonth(),i);
						$scope.events.push({
							"Date" : angular.copy(date),
							"CssClass" : cssClass,
							"Title" : title,
							"URL" : "#claimOvertimeApplyDetail",
						});
						return false;
					}

				})

			}


		}
	}// end claim overtime apply

	$scope.getDetailDelegate = function(url){
		ProcessService.ajaxGet(url+"/GetDetail").then(function(result) {
			data = JSON.parse(result.data);
				var type = null;
			fromDate = (data.Date_fr != null &&  data.Date_fr != "") ? DateTimeService.parseDate(data.Date_fr) : "";
			toDate = (data.Date_to != null &&  data.Date_to != "") ?  DateTimeService.parseDate(data.Date_to) : "";

			if(data.Duration != ""){
				type = data.Duration>1 ? " "+$rootScope.lang.general.days : " "+$rootScope.lang.general.day;
			}
			$scope.field = {
									ApprovingOfficer: {Id:data.ApprovingId,Name:data.ApprovingOfficer},
									DateFr:fromDate,
									DateTo: toDate,
									duration:type!=null?{num:data.Duration,description : accounting.formatNumber(data.Duration,2)+ type}:{num:0,description:""}
							};

		});
	}






	/***********************start claim overtime apply detail**********************/
	processClaimOvertimeApplyDetail = function(){
		 var OTData = $.jStorage.get("OTData");
		 if(OTData==null){
			 $location.path('/claimOvertimeApply');
			 return false;
		 }
		 $scope.OTTypes = OTData.OTTypes;
		 $scope.WeekOT = OTData.WeekOT;


		 var PhDays = OTData.ListData.PhDays;

		calendarDetail = JSON.parse(sessionStorage.getItem('calendarDetail'));
		day = calendarDetail["Date"];
		fullDate =  new Date(day)
	// init data when page load

		 $scope.field = {
		 fullDate: angular.copy(fullDate),
		 date:DateTimeService.dateFormat(day, "fullDate"),
		 from: "",
		 to: "",
		 type: $scope.OTTypes!=null ? $scope.OTTypes[0]:null,
		 duration: {num:0,description:accounting.formatNumber(0, 2, ',', '.')+" "+$rootScope.lang.general.hour},
		 approvingOfficer:($scope.OTTypes!=null && $scope.OTTypes.length>0)?{ApprovalId:$scope.OTTypes[0].ApprovalId,ApprovalName:$scope.OTTypes[0].ApprovalName}:{},
		 remarks:""

	 };
	var phday  = 0;
	 dayOfWeek = fullDate.getDay()+1;
		angular.forEach(PhDays, function(value) {

		 if(fullDate.getDate()==value){
			 phday = fullDate.getDate();
			 return false;
		 }
	});


    if(phday!=0){
		CurrentWeekOT = $scope.WeekOT["BcItem_IdPh"];
	}
	  else{
	 	CurrentWeekOT = $scope.WeekOT["BcItem_Id"+dayOfWeek];

	 }


	 if($scope.OTTypes!=null){
			typeOT = $scope.OTTypes.filter(function(item) {
					return (item["Id"] == CurrentWeekOT);
			});
	 }

	$scope.field.type =  typeOT[0];


	$scope.saveRemarks = function(remarks){
		$scope.field.remarks = remarks;
	}
	$scope.setDuration = function(value){
		$scope.field.duration.num = value;
	}
	 $scope.selectType = function(item){
		  $scope.field.type = item;
		  $scope.field.approvingOfficer = {ApprovalId:item.ApprovalId,ApprovalName:item.ApprovalName}

	 }
	 $scope.selectTime = function(type){

		 var temp =  $scope.field[type];
		  $scope.field[type]  = angular.copy(DateTimeService.selectDate.fullDate);
		  fromTime =$scope.field.from !='' ? DateTimeService.parseDateAndTime(DateTimeService.dateFormat($scope.field.from,"mediumDate4")):0;
		toTime = $scope.field.to != '' ? DateTimeService.parseDateAndTime(DateTimeService.dateFormat($scope.field.to,"mediumDate4")):0;
		var num =   DateTimeService.daydiff(fromTime, toTime);

		if($scope.field["from"]!="" && $scope.field["to"]!=""){

			if(DateTimeService.dateFormat($scope.field["from"],"mediumDate3") != DateTimeService.dateFormat($scope.field["to"],"mediumDate3")){
				//set dateTO = dateFROM
				$scope.field["to"] = new Date(DateTimeService.dateFormat($scope.field["from"],"year"),DateTimeService.dateFormat($scope.field["from"],"month")-1,DateTimeService.dateFormat($scope.field["from"],"day"),DateTimeService.dateFormat($scope.field["to"],"hour"),DateTimeService.dateFormat($scope.field["to"],"minute"),DateTimeService.dateFormat($scope.field["to"],"second"));
				toTime = DateTimeService.parseDateAndTime(DateTimeService.dateFormat($scope.field.to,"mediumDate4"));


			}
      $scope.field.fullDate = angular.copy(fullDate);
      if(fromTime.getHours()>toTime.getHours()){
        toTime.setDate(fromTime.getDate() + 1);
        // yêu cầu bỏ dòng này 07/02/2020 (ko set lại ngay chọn cái nào cố định luôn cái đó)
       // $scope.field.fullDate.setDate($scope.field.fullDate.getDate() + 1);
      }
      // yêu cầu bỏ dòng này 07/02/2020 (ko set lại ngay chọn cái nào cố định luôn cái đó)
      //$scope.field.date = DateTimeService.dateFormat($scope.field.fullDate, "fullDate");

      num =   DateTimeService.daydiff(fromTime, toTime);

			/*if(num<=1){
				 if(type=="from"){
						 $scope.field["to"] = angular.copy($scope.field["from"]);
						 $scope.field.duration = {num:0,description:"0 Hour"};
						 $(".overlay").hide();
						 $(".modal").hide();
				}
				else{
					$scope.field[type] = temp;
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.myclaim.validation.to_is_less_equal_from_time
					};

			 	//}
				return false;
			}
			 else{*/

				duration =  (num-1)*24>0? (num-1)*24:0;

				typeDuration = Math.round(duration) >1 ? $rootScope.lang.general.hours : $rootScope.lang.general.hour;
		  		duration = accounting.formatNumber(duration, 2, ',', '.');

			   $scope.field.duration = {num:duration,description:accounting.formatNumber(duration,2, ',', '.')+" "+typeDuration};


			   $(".overlay").hide();
			   $(".modal").hide();

			  // $(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
			//}
		 }
		 else{
			  $(".overlay").hide();
			   $(".modal").hide();
			   //$(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
		 }

	}


   $scope.nextDate = function(){
		var day = $scope.field["fullDate"].getDate();
		$scope.field["fullDate"].setDate(day + 1);
		$scope.field.date = DateTimeService.dateFormat($scope.field.fullDate, "fullDate");
   };

     $scope.prevDate = function(){
		var day = $scope.field["fullDate"].getDate();
		$scope.field["fullDate"].setDate(day - 1);
		$scope.field.date = DateTimeService.dateFormat($scope.field.fullDate, "fullDate");
   };// end claim overtime apply detail


	$scope.checkValidate = function() {
						if($scope.field.type ==null || $scope.field.type==''){
							$rootScope.error = {
								result  : true,
								message : $rootScope.lang.myclaim.ot.apply.invalid_data_type
							};
							return false;
						}
						if($scope.field.from ==''){
							$rootScope.error = {
								result  : true,
								message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.general.from
							};
							return false;
						}

						if($scope.field.to ==''){
							$rootScope.error = {
								result  : true,
								message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.general.to
							};
							return false;
						}


						if ( $scope.field.duration.num <=0) {

							$rootScope.error = {

								result  : true,
								message : $rootScope.lang.myleave.apply.validation.duration_not_valid
							};
							return false;
						}
							if($scope.field.remarks =='' && $scope.field.type.Self_Remarks==1){

								$rootScope.error = {
									result : true,
									message : $rootScope.lang.myleave.apply.validation.remark_not_valid
								};
								return false;
							}

							/*if($scope.field.approvingOfficer.ApprovalId==null || $scope.field.approvingOfficer.ApprovalId==''){

								$rootScope.error = {
									result : true,
									message : $rootScope.lang.myleave.apply.validation.no_approving_officer
								};
								return false;
							}*/
							return true;
	}
     $scope.submitClaimOvertimeApply = function(){

		if(!$scope.checkFutureDate($scope.field["fullDate"])){
			return false;
		}
		if(!$scope.checkValidate()){
			return false;
		}

		  var param = {

            BcItemId: $scope.field.type.Id,
            ClaimDate: DateTimeService.parseMilliSecondToUTC($scope.field["fullDate"]),
            TimeFr: DateTimeService.dateFormat($scope.field.from,"shortTime2"),
            TimeTo: DateTimeService.dateFormat($scope.field.to,"shortTime2"),
            ClaimUnit: $scope.field.duration.num,
            Remarks: $scope.field.remarks,
			OfficerId:$scope.field.approvingOfficer.ApprovalId

        };
		ProcessService.ajaxPost("MyClaimsOvertimeClaimApplyOvertime/Submit",JSON.stringify(param))
						  .then(function(result) {
							  data = JSON.parse(result.data);
							    var message = $rootScope.lang.general.application_submit;
							  if(data.MessageInfo!=''){
								   message = data.MessageInfo;
							  }

								$scope.processResultPost(data,message,"claimOvertime");
								 if(data.MessageInfo!=''){
									$rootScope.success.title = "Warning";
									$rootScope.success.callBack = function() {
										$rootScope.success.title = $rootScope.lang.general.successful;
										$rootScope.success.message = $rootScope.lang.general.application_submit;
										$rootScope.success.callBack =  function() {
											$rootScope.success.result = false;
											$rootScope.success.message = "";
											$location.path("/claimOvertime");
										}
									}

								}
							})

	 }


	}// end claim overtime apply

	 /* ****************Start overtime cancellation************************/
	processClaimCancellation = function (url){
		$scope.getListCancellation = function(url){

			if($rootScope.cache==true && sessionStorage.getItem('listCancelLation')!=null){
				$scope.listCancelLation = JSON.parse(sessionStorage.getItem('listCancelLation'));
				$rootScope.cache = false;
			}
			else{
				ProcessService.ajaxGet(url+"/GetList").then(function(result) {
					sessionStorage.setItem('listCancelLation',result.data);
					data = JSON.parse(result.data);

					$scope.listCancelLation = data;
					console.log($scope.listCancelLation);
				});
			}
		}
		$scope.saveListItem = function(){
			 sessionStorage.setItem('listCancelLation',JSON.stringify($scope.listCancelLation));

		}
		submitCancellation = function(url) {
			if($scope.listCancelLation!=null){
					$scope.listCancelSubmit = $scope.listCancelLation.filter(function(item) {
						return item["check"] == true;
					})
			}
							var Uqids = Array();
							var TypeCancel = Array();
							angular.forEach($scope.listCancelSubmit, function(value, key) {
								Uqids.push(value["Uqid"]);
								TypeCancel.push(value["ClaimType"]);

							})

							if(Uqids.length ==0){
								return false;
							}
							var param = {
								Uqids : Uqids,
							};
							if(TypeCancel.length>0){
								param.TypeCancel = TypeCancel;
							}
							switch (url) {

								case "MyClaimsOvertimeClaimCancellation":
									backUrl = "claimOvertime";
									break;
								case "MyClaimsBenefitClaimCancellation":
									backUrl = "claimBenefit";
									break;

								case "MyClaimsExpenseClaimCancellation":
									backUrl = "claimReimbursement";
									break;

								case "MyClaimsRequestForPaymentCancellation":
									backUrl = "claimRequestForPayment";
									break;


							}

							ProcessService.ajaxPost(url+"/Submit",JSON.stringify(param)).then(function(result) {
													data = JSON.parse(result.data);
													var message = $rootScope.lang.general.cancellation+" "+$rootScope.lang.general.successful;
													$scope.processResultPost(data,message,backUrl);
							});

						}
						$scope.getListCancellation(url);
						$scope.submitCancellation = function(){
							submitCancellation(url);
						}


	}// end overtime cancellation
	$scope.viewDetail = function(item,url){
							var claimDetail = JSON.stringify(item);
							switch ($location.path()) {
								case "/claimOvertimeApproval":
								case "/claimBenefitApproval":
								case "/claimReimbursementApproval":
								case "/claimRequestForPaymentApproval":
									sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));
									break;
								case "/claimOvertimeCancellation":
								case "/claimBenefitCancellation":
								case "/claimReimbursementCancellation":
								case "/claimRequestForPaymentCancellation":
									sessionStorage.setItem('listCancelLation',JSON.stringify($scope.listCancelLation));
									break;
							}
							sessionStorage.setItem('claimDetail', claimDetail);
							$location.path("/"+url);
						}
	 /* ****************Start claim detail************************/
	processClaimDetail = function(type){

		$scope.filePath = Array();
		$scope.claimDetail = JSON.parse(sessionStorage.getItem('claimDetail'));
		console.log($scope.claimDetail);



	/*if(type=="attach"){
		var arrFileUrl = [$scope.claimDetail.FileUrl,$scope.claimDetail.FileUrl2,$scope.claimDetail.FileUrl3];
			var folder = "";
			angular.forEach(arrFileUrl,function(value){
				if(value!=""){
				url = $rootScope.GATEWAYURL+"api/uploadfile/getfile?FileName=";

							window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
							folder =fileSystem.root.nativeURL+"Download/";
							var fileTransfer = new FileTransfer();
							$scope.$apply(function(){

									$scope.filePath.push(folder + value);
								})

							fileTransfer.download(url+value,folder + value,
							function(entry) {

								console.log(entry);
								})
							})
				}

			})
	}*/





	}// end overtime detail

	processClaimEnquryView = function(){

		$scope.listClaimEnquiry = JSON.parse(sessionStorage.getItem('listClaimEnquiry'));
		console.log($scope.listClaimEnquiry);


	}



   processClaimEnquiry = function(url){

	   ProcessService.ajaxGet(url+"/GetList")
						  .then(function(result) {
							 data = JSON.parse(result.data);
							 console.log("datadata",data)
							$scope.listEnquiry = data;

								if(url != "MyClaimsOvertimeClaimEnquiry"){
									var count = 1;
									angular.forEach($scope.listEnquiry,function(value,index){
										value["class"]  = "type_"+count;
										if(url == "MyClaimsRequestForPaymentEnquiry")
											value.char = value.ReceiptNo != null ? value.ReceiptNo.substr(0, 1) : null;
										else
											value.char = value.TypeDesc != null ? value.TypeDesc.substr(0, 1) : null;
										if(count==3)
											count = 1;
										else count++;
									})
								}

							})

							$scope.viewClaimed = function(item,url,type){

								switch (url) {

									case "claimBenefitEnquiryView":
										var title = type==1 ? $rootScope.lang.myclaim.ben.enquiry.benefit_enquiry_claimed:$rootScope.lang.myclaim.ben.tt2 + " " + $rootScope.lang.general.enquiry+" - "+ $rootScope.lang.general.applications;
										break;

									case "claimReimbursementEnquiryView":
										var title = type==1 ? $rootScope.lang.myclaim.reim.enquiry.benefit_enquiry_claimed:$rootScope.lang.myclaim.reim.tt2 + " "+ $rootScope.lang.general.enquiry+" - "+ $rootScope.lang.general.applications;
										break;

									case "claimRequestForPaymentEnquiryView":
										var title = type==1 ? $rootScope.lang.myclaim.pay.enquiry.pay_enquiry_claimed:$rootScope.lang.myclaim.pay.enquiry.pay_enquiry_pending_approval;
										break;
								}

								var obj = {"title":title,"data":item};
								var listClaimEnquiry = JSON.stringify(obj);
								sessionStorage.setItem('listClaimEnquiry', listClaimEnquiry);
								$location.path("/"+url);
							}

							$scope.viewCoverage = function(id,url){

								$location.path("/"+url+"/"+id);
							}

   }

   processClaimCoverage = function(){
	   var param = {
            ClaimId:  $routeParams.id
        };

	    ProcessService.ajaxPost("Common/GetClaimtal",param).then(function(result) {
				 data = JSON.parse(result.data);
				$scope.listCoverage = data;

		})

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

   }



  processClaimTravelRequestApproval = function(){
    if($rootScope.cache==true && sessionStorage.getItem('listTravelRequestApproval')!=null){

      $scope.listApproval = JSON.parse(sessionStorage.getItem('listTravelRequestApproval'));
      $rootScope.cache = false;
    }
    else{
      var listColorChar = Array("aa00aa","ffffff","dd99dd","999999","44aa77","88bb88","cc00cc","220022","334433");
      ProcessService.ajaxGet("MyClaimsTravelRequestApproval/GetList").then(
        function(result) {
          data = JSON.parse(result.data);
          console.log("data",data);
          $scope.listApproval = data;
          var count = 1;
          angular.forEach($scope.listApproval,function(value, index) {
            //value.color = "color-" + count;
            //count = (count >= 4) ? 1 : count + 1;
            //value.char = value.LeaveDesc.substr(0, 1);
            // var listColorNumber = Array(0,2,4);
            //
            // var cIndex = (10+value.LeaveTypeId)%8;
            // var rStr = ""+(10+value.LeaveTypeId)%10;
            // var rIndex = listColorNumber[(10+(10+value.LeaveTypeId)%10)%3];
            // var mColor = listColorChar[cIndex];
            // var lColor = mColor.replaceAt(rIndex, rStr);
            //
            // value.color =lColor;
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

      ProcessService.ajaxPost("MyClaimsTravelRequestApproval/Submit",JSON.stringify(param)).then(function(result) {
        sessionStorage.removeItem('listApproval');
        data = JSON.parse(result.data);
        var message = "";
        $scope.processResultPost(data,message);

      });


    }
  }

   processClaimApproval = function(url){
	  if($rootScope.cache==true && sessionStorage.getItem('listApproval')!=null){
			$scope.listApproval = JSON.parse(sessionStorage.getItem('listApproval'));
			$scope.IsClaimsBatch = sessionStorage.getItem('IsClaimsBatch');
			$rootScope.cache = false;
		}
		else{
	    	 ProcessService.ajaxGet(url+"/GetList").then(function(result) {
					data = JSON.parse(result.data);
					console.log(data);
					$scope.listApproval = data.Data;
					$scope.IsClaimsBatch = data.IsClaimsBatch;
					sessionStorage.setItem('IsClaimsBatch',$scope.IsClaimsBatch);

			})
		}

		$scope.viewBatchDetail = function(item,url){
							var claimBatchDetail = JSON.stringify(item.ListItems);

							sessionStorage.setItem('claimBatchDetail', claimBatchDetail);
							$location.path("/"+url);
						}

	$scope.isCheck = function(item, type) {
							if (type == "Approved") {
								item.Reject = false;
							} else {
								item.Approved = false;
							}
							sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));

						}
						$scope.setActiveRow = function(index){
		          $scope.activeRow = index;
              $scope.textRemark = $scope.listApproval[index].textRemark;
            }
            $scope.changeRemark = function(textRemark){

              $scope.listApproval[$scope.activeRow].textRemark = textRemark;
              sessionStorage.setItem('listApproval',JSON.stringify($scope.listApproval));
            }
						$scope.submitApproval = function() {
							var param = {
									Uqids : [ ],
									Actions : [ ], // 1 Approved, 2 Reject
									Remarks : [ ], // remark item
								};
							$scope.listApprovalSubmit = $scope.listApproval.filter(function(item) {
								return (item["Approved"] == true || item["Reject"] == true);
							});

							if($.isEmptyObject(	$scope.listApprovalSubmit)){
								return false;
							}
								if($scope.IsClaimsBatch==1){
									angular.forEach($scope.listApprovalSubmit, function(value,index){
										if(value.ListItems.length>0)
										{
											angular.forEach(value.ListItems, function(value2,index2){
												param.Uqids.push(value2.Uqid);
												var action = (value["Approved"]==true) ? 1 : 2;
												param.Actions.push(action);
												var remarks  = (value["Approved"]==true) ? null:value["textRemark"];
												param.Remarks.push(remarks);
											})
										}
									})

								}
								else{
									angular.forEach($scope.listApprovalSubmit, function(value,index){
										param.Uqids.push(value.Uqid);
										var action = (value["Approved"]==true) ? 1 : 2;
										param.Actions.push(action);
                    var remarks  = (value["Approved"]==true) ? null:value["textRemark"];
										param.Remarks.push(remarks);
									})
								}

								switch (url) {

													case "MyClaimsOvertimeClaimApproval":
														backUrl = "claimOvertime";
														break;
													case "MyClaimsBenefitClaimApproval":
														backUrl = "claimBenefit";
														break;

													case "MyClaimsExpenseClaimApproval":
														backUrl = "claimReimbursement";
														break;

													case "MyClaimsRequestForPaymentApproval":
														backUrl = "claimRequestForPayment";
														break;


												}
							ProcessService.ajaxPost(url+"/Submit",
									JSON.stringify(param)).then(
									function(result) {
											data = JSON.parse(result.data);
											var message = "";
											$scope.processResultPost(data,message,backUrl);
									});


						}
  }
  processClaimBatchDetail = function(){
		$scope.claimBatchDetail = JSON.parse(sessionStorage.getItem('claimBatchDetail'));
	}
  /****************************Claim Overtime Delegate *************************************/
   processClaimDelegate = function(url) {

	//getListEmployeeDelegate
		ProcessService.ajaxGet(url+"/GetListEmployee").then(
							function(result) {
								data = JSON.parse(result.data);
								$scope.listEmployee = data;
							});


	   $scope.getDetailDelegate(url);

	   $scope.checkValidateDelegate = function() {
				if(url=="MyClaimsOvertimeClaimDelegate"){
					if ($scope.field.duration.num<1) {
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter +" "+$rootScope.lang.myleave.delegate.tt +" "+$rootScope.lang.myleave.apply.period
								};
								return false;
							}
				}

			if ($scope.field.DateTo == "" && $scope.field.DateFr == "") {
				$rootScope.error = {
					result : true,
					message :  $rootScope.lang.general.please_enter + " " +  $rootScope.lang.myclaim.date
				};
				return false;
			}

			if($scope.field.ApprovingOfficer.Id ==null){
				$rootScope.error = {
					result : true,
					message : $rootScope.lang.myclaim.validation.approving_officer
				};
				return false;
			}
			return true;
	 }



		$scope.selectApprovingOfficer = function(value) {
				$scope.field.ApprovingOfficer = value;
		}

							$scope.selectDate = function(field) {
								var field2 ="DateFr" ? "DateTo": "DateFr";

							temp = $scope.field[field];
							$scope.field[field] = angular.copy(DateTimeService.selectDate.fullDate);



							var fromDate = DateTimeService.dateFormat($scope.field.DateFr,"mediumDate3");
							fromDate = DateTimeService.parseDate(fromDate);

							var toDate = DateTimeService.dateFormat($scope.field.DateTo,"mediumDate3");
							toDate = DateTimeService.parseDate(toDate);

							var num =  Math.ceil(DateTimeService.daydiff(fromDate, toDate));
							 if (num <= 0 && $scope.field[field] !="" && $scope.field[field2]!="") {
								  if(field=="DateFr"){
									 $scope.field[field2] = $scope.field[field];
									   num = 1;
								}
								else{
									$rootScope.error = {
												result : true,
												message :  $rootScope.lang.myclaim.validation.to_is_less_than_from_date
											}
											 num = 0;
								   $scope.field[field] = temp;
								   return false;
								}
							 }



							$(".overlay").hide();
								$(".modal").hide();
								//$(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
								typeDuration = num > 1 ? " days" : " day";
								$scope.field.duration = {
									num : num,
									description : num + typeDuration
								};
						}


						$scope.submitDelegate = function() {

							if(!$scope.checkValidateDelegate()){
								return false;
							}

							var param = {

							 IdOfficer:$scope.field.ApprovingOfficer.Id,
							 DateFr: $scope.field.DateFr != "" ? DateTimeService.parseMilliSecondToUTC($scope.field.DateFr) : "",
							 DateTo: $scope.field.DateTo != "" ? DateTimeService.parseMilliSecondToUTC($scope.field.DateTo) : "",

							};

							switch (url) {

													case "MyClaimsOvertimeClaimDelegate":
														backUrl = "claimOvertime";
														break;
													case "MyClaimsBenefitClaimDelegate":
														backUrl = "claimBenefit";
														break;

													case "MyClaimsExpenseClaimDelegate":
														backUrl = "claimReimbursement";
														break;

													case "MyClaimsRequestForPaymentDelegate":
														backUrl = "claimRequestForPayment";
														break;


												}
							ProcessService
									.ajaxPost(url+"/Submit",
											JSON.stringify(param))
									.then(
											function(result) {
												data = JSON.parse(result.data);

												var message = '';
												$scope.processResultPost(data,message,backUrl);


											});

  					  }
	}

	processClaimSubmitSavesClaims = function(ClaimType){

						var param = {ClaimType:ClaimType};
						if($rootScope.cache==true && sessionStorage.getItem('listSubmitSavedClaims')!=null){

							$scope.listSubmitSavedClaims = JSON.parse(sessionStorage.getItem('listSubmitSavedClaims'));
							$scope.Clamtal =  JSON.parse(sessionStorage.getItem('Clamtal'));
							$scope.CheckClaimtalOnClient =  sessionStorage.getItem('CheckClaimtalOnClient');
							$rootScope.cache = false;
						}
						else{
						ProcessService.ajaxPost("MyClaimsSubmitSavedClaims/GetList",JSON.stringify(param)).then(
								function(result) {

									data = JSON.parse(result.data);

									$scope.listSubmitSavedClaims = data.Data;
									$scope.CheckClaimtalOnClient = data.CheckClaimtalOnClient;
									sessionStorage.setItem('listSubmitSavedClaims',JSON.stringify(data.Data));

									sessionStorage.setItem('Clamtal',JSON.stringify(data.Clamtal));
									sessionStorage.setItem('CheckClaimtalOnClient',$scope.CheckClaimtalOnClient);
									$scope.Clamtal = data.Clamtal;
								});
						}

						$scope.insufficientBalance = function(index,message){
							$rootScope.error = {
								result : true,
								message : message,

							};
							$scope.listSubmitSavedClaims[index].Approved = false;
						}
						$scope.checkClamtal = function(claimItem,position) {

							var listClaimApproved = $scope.listSubmitSavedClaims.filter(function(item) {
								return (item["Approved"] == true && claimItem.ClaimId == item.ClaimId);
							});
							if(claimItem["Approved"]==true){

								var totalBalance = 0;
								angular.forEach(listClaimApproved, function(value,index){

									if(claimItem.Id == value.Id){
										var receiptAmount =  value.ReceiptAmount;
										totalBalance += parseFloat(receiptAmount);
									}
								});
								var currentClamtal = {}
								for(var i=0;i<$scope.Clamtal.length;i++){

									if(claimItem.ClaimId == $scope.Clamtal[i].BcItemId){
										currentClamtal = $scope.Clamtal[i];
										break;
									}

								}

								if(currentClamtal.Allocation==1){

									angular.forEach(currentClamtal.ClaimtalInfo , function(value,index){
											if(claimItem.Incurred_Opt == value.Incurred && totalBalance > value.Balance){
												totalBalance = totalBalance - parseFloat(claimItem.ReceiptAmount);
												 balance = value.Balance - (totalBalance);

												 message = "Your "+claimItem.Incurred+" "+claimItem.ClaimTypeDesc+" balance is "+balance+". Please change and submit again.",
												$scope.insufficientBalance(position,message)
												return false;
											}
									})
								 }

								 else if(currentClamtal.Allocation==2){
									 if(totalBalance > currentClamtal.ClaimtalInfo[0].Balance){
										 totalBalance = totalBalance - parseFloat(claimItem.ReceiptAmount);
										 balance = currentClamtal.ClaimtalInfo[0].Balance - (totalBalance);

										  message = "Your Total "+claimItem.ClaimTypeDesc+" balance is "+balance+". Please change and submit again.",
										$scope.insufficientBalance(position,message)
										return false;
									 }
								 }

								 else if(currentClamtal.Allocation==3){


									if(claimItem.Incurred_Opt==1){ // Employee
										totalBalance = 0;
										angular.forEach(listClaimApproved, function(value,index){

										if(claimItem.Id == value.Id && value.Incurred_Opt==1){
											var receiptAmount =  value.ReceiptAmount;
											totalBalance += parseFloat(receiptAmount);
										}
									});
										if(totalBalance > currentClamtal.ClaimtalInfo[0].Balance){
										 totalBalance = totalBalance - parseFloat(claimItem.ReceiptAmount);
										balance = currentClamtal.ClaimtalInfo[0].Balance - (totalBalance);
										 message = "Your Employee "+claimItem.ClaimTypeDesc+" balance is "+balance+". Please change and submit again.",
											$scope.insufficientBalance(position,message)
											return false;
										}
									}
									else{
										totalBalance = 0;
										angular.forEach(listClaimApproved, function(value,index){

										if(claimItem.Id == value.Id && value.Incurred_Opt!=1){
											var receiptAmount =  value.ReceiptAmount;
											totalBalance += parseFloat(receiptAmount);
										}
										});

									 if(totalBalance > currentClamtal.ClaimtalInfo[1].Balance)
									{

										 totalBalance = totalBalance - parseFloat(claimItem.ReceiptAmount);
										balance = currentClamtal.ClaimtalInfo[1].Balance - (totalBalance);

										 message = "Your Dependants "+claimItem.ClaimTypeDesc+" balance is "+balance+". Please change and submit again.",
										$scope.insufficientBalance(position,message)
										return false;
									}
									}

								 }

							}
						}
						$scope.isCheck = function(item, type,index) {
							if (type == "Approved") {
								item.Reject = false;
								if($scope.CheckClaimtalOnClient==1){
									$scope.checkClamtal(item,index);
								}
							} else {
								item.Approved = false;
							}
							 sessionStorage.setItem('listSubmitSavedClaims',JSON.stringify($scope.listSubmitSavedClaims));

						}
						$scope.submitSavesClaims = function() {

							var param = {
									Uqids : [ ],
									Actions : [ ],
									ClaimTypes:[],
								};
							$scope.listSubmit = $scope.listSubmitSavedClaims.filter(function(item) {
								return (item["Approved"] == true || item["Reject"] == true);
							});
							if($.isEmptyObject(	$scope.listSubmit)){
								return false;
							}
							angular.forEach($scope.listSubmit, function(value,index){
								param.Uqids.push(value.Uqid);
								var action = (value["Approved"]==true) ? 1 : 2;
								param.Actions.push(action);
								param.ClaimTypes.push(ClaimType);
							})



							ProcessService.ajaxPost("MyClaimsSubmitSavedClaims/Submit",JSON.stringify(param)).then(
									function(result) {
										data = JSON.parse(result.data);
										var message = "";
										sessionStorage.removeItem("listSubmitSavedClaims");
										$scope.processResultPost(data,message);
							});

						}

						$scope.updateClaim = function(item){
							var claimType = item.ClaimType;
							console.log(item);
							var claimItem = JSON.stringify(item);
							sessionStorage.setItem("claimItem",claimItem);
							if(claimType==1)
								 url = "/claimBenefitApply";
							else
								url = "/claimReimbursementApply";
							$location.path(url);

						}

	}

	processClaimApply = function(url){

		 $scope.$on('$viewContentLoaded', function() {
     		 $templateCache.removeAll();
   		});

		$rootScope.listFileAttached = [];
			currentDate = new Date();
			$scope.resetField = function(field){
				$scope.field[field] = "";
			}


						$scope.SearchText = "";
						var pageIndex = 0;
						searchDataCustomer = function(){
							var param = {
										PageIndex: pageIndex,
										SearchText: $scope.SearchText
   								 	};

							return ProcessService.ajaxPostLocalSite($rootScope.GATEWAYURL+"api/"+url+"/SearchCustomer",param).then(function(result){
								data = JSON.parse(result.data);

								$scope.disabledLoadMore = (data == null || data.length < 20) ? true:false;

								return data;


								})
						}
						$scope.showPoupCustomer = function(attr){
							$scope.fieldSelected = attr;
							PoupService.showPoup("poup-customer",$scope);

							$scope.SearchText = "";
							searchDataCustomer().then(function(data){
								$scope.listCustomer = data!=null?data:[];
							});
						}

						$scope.closePoup = function(){
							PoupService.closePoup();
						}

						$scope.searchCustomer = function(){

							$scope.pageIndex = 0;
							searchDataCustomer().then(function(data){
								$scope.listCustomer = data!=null?data:[];
							});

						}

						$scope.loadMoreCustomer = function(){

							$scope.disabledLoadMore = true;
							pageIndex += 1;
							searchDataCustomer().then(function(data){
								if(data!=null){
									angular.forEach(data,function(value,index){
										$scope.listCustomer.push(value);
									})
								}
							});

						}

			switch (url) {

				case "MyClaimsBenefitClaimApplyBenefit":
						$scope.field = {
							benefitType: {},
							currency: {},
							exChangeRate: "",
							date:currentDate,
							incurredFrom:"",
							incurredTo:"",
							clinic: {},
							receiptNo: '',
							receiptAmount: '',
							gstAmount:"0",
							amount:'',
							remarks: '',
							fileUrl: '',
							inCurred: {},
							dependant: {},
							description:{}

						};
						break;
				case "MyClaimsExpenseClaimApplyReimbursement":

				$scope.field = {
						reimbursenmentType: {},
						date: currentDate,
						incurredFrom:"",
						incurredTo:"",
						receiptNo: '',
						from: '',
						to: '',
						mileage: '',
						gstAmount: "0",
						receiptAmount:'',
						amount:'',
						currency:{},
						exChangeRate: "",
						billable: false,
						bcCustomer: {},
						customer: "",
						invoiceType:"",
						gstRegistrationNo:"",
						invoiceName:"",
						description:{},
						invoiceAddress:"",
						remarks: "",
						approvingOfficer:{}
				};
				break;
				case "MyClaimsRequestForPaymentApplyPayment":


				$scope.resetClaimItem = function(index){
					$scope.field["claimItem"+index] = {RequestPaymentData:{Self_Remark:0,Self_File:0}};
					$scope.field["receiptAmount"+index] = "";
					$scope.field["claimDesc"+index] = {};
					$("#textReceiptAmount"+index).val("");
					$("#claim-item-"+index).css({"height":"auto"});
					$(".list li").removeClass("touch");
				}



				$scope.checkValidClaimItem = function(index){
					if($scope.field["claimItem"+index].hasOwnProperty("Id") && ($scope.field["receiptAmount"+index]=="" || $scope.field["receiptAmount"+index]<0)){

									$rootScope.error = {
										result : true,
										message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.amount +" " +index
									};
									return false;
								}
					if($scope.field["receiptAmount"+index]>0 && (!$scope.field["claimItem"+index].hasOwnProperty("Id"))){
						$rootScope.error = {
										result : true,
										message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.claim_item.tt +" " +index
									};
									return false;
						}
					if($scope.IsClaimDesc ==1 ){
					if($scope.field["claimItem"+index].RequestPaymentData.ClaimDesc!=null && $scope.field["claimItem"+index].RequestPaymentData.ClaimDesc.length>0 && $.isEmptyObject($scope.field["claimDesc"+index])){

										$rootScope.error = {
											result : true,
											message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.description +" "+ index
										};
										return false;
									}
					}
					$(".overlay2").hide();
					$(".modal2").removeClass("zoomIn");
					$(".modal2").addClass("zoomOut");
					setTimeout(function(){
						$(".modal2").hide();
					},500);
				}
				$scope.numberClaimItem = [1,2,3,4,5];
				$scope.claimNumber = 1;
				$scope.selectClaimNumber = function(number){
					$scope.claimNumber = number;
					var listClaimItem = $("#list-claim-item");
					listClaimItem.removeClass("zoomOut");
				 	listClaimItem.addClass("zoomIn");
				 	listClaimItem.show();
					$(".overlay2").show();
			    	listClaimItem.css({ left: ($(window).width() - listClaimItem.width()) / 2, top: ($(window).height() - listClaimItem.height()) / 2 					});
				}
				$scope.field = 	{
									date: currentDate,
									orderNo: "",
									company: {},
									payTo: {},
									claimFrom: {},
									claimItem1: {RequestPaymentData:{Self_Remark:0,Self_File:0}},
									claimItem2: {RequestPaymentData:{Self_Remark:0,Self_File:0}},
									claimItem3: {RequestPaymentData:{Self_Remark:0,Self_File:0}},
									claimItem4: {RequestPaymentData:{Self_Remark:0,Self_File:0}},
									claimItem5: {RequestPaymentData:{Self_Remark:0,Self_File:0}},
									gstAmountPay: "0",
									receiptAmount1:'',
									receiptAmount2:'',
									receiptAmount3:'',
									receiptAmount4:'',
									receiptAmount5:'',
									amount:'',
									claimDesc1:'',
									claimDesc2:'',
									claimDesc3:'',
									claimDesc4:'',
									claimDesc5:'',
									currency:{},
									exChangeRatePay: "",
									invoiceType:"",
									invoiceName:"",
									gstRegistrationNo:"",
									invoiceAddress:"",
									paymentMethod: "",
									remarks: "",
									approvingOfficer:{}
								};

								$scope.checkSelfRemark = function() {
									return ($scope.field.claimItem1["RequestPaymentData"]["Self_Remark"]==1||$scope.field.claimItem2["RequestPaymentData"]["Self_Remark"]==1||$scope.field.claimItem3["RequestPaymentData"]["Self_Remark"]==1||$scope.field.claimItem4["RequestPaymentData"]["Self_Remark"]==1 || $scope.field.claimItem5["RequestPaymentData"]["Self_Remark"]==1);
								}

								$scope.checkSelfFile = function() {
									return ($scope.field.claimItem1.RequestPaymentData.Self_File==1||$scope.field.claimItem2.RequestPaymentData.Self_File==1||$scope.field.claimItem3.RequestPaymentData.Self_File==1||$scope.field.claimItem4.RequestPaymentData.Self_File==1 || $scope.field.claimItem5.RequestPaymentData.Self_File==1);
								}


								break;


			}

		var claimItem = sessionStorage.getItem("claimItem")!=null ? JSON.parse(sessionStorage.getItem("claimItem")) : null;

		$scope.isApplicationSaved = sessionStorage.getItem("claimItem")!=null?true:false;
		sessionStorage.removeItem("claimItem");
		ProcessService.ajaxGet(url+"/PageLoad").then(function(result) {
							 data = JSON.parse(result.data);
							 console.log(data);
							 if(data.RoleAccess<=0){
								$rootScope.success = {
									result : true,
									title:	  $rootScope.lang.general.alert,
									message : $rootScope.lang.general.not_entitled_to +" "+$rootScope.lang.myclaim.tt,
									callBack: function(){
										 $rootScope.success.result = false;
										 history.back(-1);
									}
								}
							 }

							 $scope.defaultCurrency =  angular.copy(data.CurrencySelected);
							 $scope.IsClaimDesc =  data.IsClaimDesc==1?true:false;
							 $scope.defaultExChangeRate =  angular.copy(data.ExChangeRate);
							 $scope.field.currency = data.CurrencySelected != null ? data.CurrencySelected : {};

							 $scope.field.exChangeRate = data.ExChangeRate;
							 $scope.IsGstDetail =  data.IsGstDetail;
							switch (url) {

								case "MyClaimsBenefitClaimApplyBenefit":

										$scope.listBenefitType = data.ListBenefitType;
										//$scope.field.benefitType = data.ListBenefitType!=null ? data.ListBenefitType[0]:{};
										$scope.listIncurred = data.ListIncurred;
										$scope.listCurrency = data.ListCurrency;
										$scope.listBcClinic = data.ListBcClinic;
										//$scope.addListInCurred();
										/*if(claimItem==null){
											$scope.setDefaultAmtForBennefit();
										}*/
										if(claimItem!=null){

											if(claimItem.FileUrl !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl);
											if(claimItem.FileUrl2 !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl2);
											if(claimItem.FileUrl3 !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl3);
											var inCurred = {};
											var benefitType = {};
											var description = {};
											var dependant= {};

											 $scope.listBenefitType.filter(function(item) {
												if(item["Id"] == claimItem.ClaimId){
													$scope.field.benefitType = item;
													$scope.addListInCurred();
													if(	$scope.field.benefitType.BenefitInfo.ClaimDesc!=null){

															$scope.field.benefitType.BenefitInfo.ClaimDesc.filter(function(item) {
															if(item["Id"] == claimItem.ClaimDescriptionId){
																description = 	item;
																return false;
															}
														});
													}

													return false;
												}
											});

											 $scope.listBcClinic.filter(function(item) {
												if(item["Id"] == claimItem.BcClinic_Id){
													$scope.field.clinic = item;
													return false;
												}
											});


											$scope.listIncurred.filter(function(item) {
												if(item["Opt"] == claimItem.Incurred_Opt){
													inCurred = item;
													if(	inCurred.ListDependents!=null){
														 inCurred.ListDependents.filter(function(item) {
															if(item["Uqid"] == claimItem.DependentId){
																dependant = item;
																return false;
															}
														});
													}
													return false;
												}
											});


											 $scope.listCurrency.filter(function(item) {
												if(item["Id"] == claimItem.CurrencyId){
													currency = item;
													return false;
												}
											});



											$scope.field.currency = currency;
											$scope.field.exChangeRate = claimItem.ExChangeRate;
											$scope.field.date = DateTimeService.parseDate(claimItem.Date);
											$scope.field.incurredFrom = claimItem.Incurred_To!=""?DateTimeService.parseDate(claimItem.Incurred_Fr):"";
											$scope.field.incurredTo = claimItem.Incurred_To!=""?DateTimeService.parseDate(claimItem.Incurred_To):"";
											$scope.field.receiptNo = claimItem.ReceiptNo;
											$scope.field.receiptAmount = claimItem.ReceiptAmount;
											$scope.field.gstAmount = claimItem.GstAmount;
											$scope.field.amount = claimItem.Amount;
											$scope.codeCurrency =  parseFloat($scope.field.amount) > 0 ? $scope.defaultCurrency.Code:"";
											$scope.field.remarks = claimItem.Remark;
											$scope.field.inCurred = inCurred;
											$scope.field.dependant = dependant;
											$scope.field.description = description;
										}

										break;

								case "MyClaimsExpenseClaimApplyReimbursement":



										//$scope.field.reimbursenmentType = data.ListClaimType!=null ? data.ListClaimType[0]:{};
										$scope.listReimbursenmentType = data.ListClaimType;
										$scope.listCurrency = data.ListCurrency;
										$scope.listCustomer = data.ListCustomer;
										$scope.disabledLoadMore = ($scope.listCustomer == null || $scope.listCustomer.length < 20) ? true:false;
										$scope.IsInvoiceType = data.IsInvoiceType;
										$scope.ListNoitype =  data.ListNoitype;
										$scope.field.invoiceType = $scope.ListNoitype!=null ? $scope.ListNoitype[0]:{};
										/*if(claimItem==null){
											$scope.setDefaultAmtForReim();
										}*/
										if(claimItem!=null){
											if(claimItem.FileUrl !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl);
											if(claimItem.FileUrl2 !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl2);
											if(claimItem.FileUrl3 !="")
												$rootScope.listFileAttached.push(claimItem.FileUrl3);
											var inCurred = {};
											var reimbursenmentType = {};
											var description = {};
											var dependant= {};
											 $scope.listReimbursenmentType.filter(function(item) {
												if(item["Id"] == claimItem.ClaimId){
													$scope.field.reimbursenmentType = item;
													if($scope.field.reimbursenmentType.ReimbursementData.ClaimDesc!=null && $scope.field.reimbursenmentType.ReimbursementData.ClaimDesc.length > 0){
															$scope.field.reimbursenmentType.ReimbursementData.ClaimDesc.filter(function(item) {
															if(item["Id"] == claimItem.ClaimDescriptionId){
																	$scope.field.description  =	item;
																return false;
															}
														});
													}
													return false;
												}
											});
											 $scope.listCurrency.filter(function(item) {
												 if(item["Id"] == claimItem.CurrencyId){
													 	$scope.field.currency = item;
													 return false;
												 }

											 });
											 	if($scope.listCustomer!=null){
													$scope.listCustomer.filter(function(item) {
													 if(item["Id"] == claimItem.BcCustommer_Id){
														 $scope.field.bcCustomer  = item;
														 return false;
													 }
												 });
												}


											 if( $scope.ListNoitype!=null){
												  $scope.ListNoitype.filter(function(item) {
													 if(item["Id"] == claimItem.GST_Type){
														 $scope.field.invoiceType  = item;
														 return false;
													 }
												 });
											 }



											$scope.field.date  = DateTimeService.parseDate(claimItem.Date);
											$scope.field.incurredFrom  = claimItem.Incurred_Fr != "" ? DateTimeService.parseDate(claimItem.Incurred_Fr):claimItem.Incurred_Fr;
											$scope.field.incurredTo  = claimItem.Incurred_To != "" ? DateTimeService.parseDate(claimItem.Incurred_To):claimItem.Incurred_To;
											$scope.field.receiptNo  = claimItem.ReceiptNo;
											$scope.field.from  = claimItem.From;
											$scope.field.to  = claimItem.To;
											$scope.field.mileage  = claimItem.Distance;
											$scope.field.gstAmount  = claimItem.GstAmount;

											$scope.field.receiptAmount  = claimItem.ReceiptAmount;
											$scope.field.amount  = claimItem.Amount;
											$scope.codeCurrency =   $scope.field.amount>0 ? $scope.defaultCurrency.Code:"";
											$scope.field.exChangeRate  = claimItem.ExChangeRate;
											$scope.field.billable  = claimItem.Billable==1?true:false;
											$scope.field.customer  = claimItem.Custommer;
											$scope.field.gstRegistrationNo  = claimItem.GST_Reg;
											$scope.field.invoiceName  = claimItem.GST_Name;

											$scope.field.invoiceAddress  =claimItem.GST_Address;
											$scope.field.remarks  = claimItem.Remark;

										}

										break;

							case "MyClaimsRequestForPaymentApplyPayment":

										$scope.field.paymentMethod = data.ListPayment!=null?data.ListPayment[0]:{};
										$scope.listCurrency = data.ListCurrency;
										$scope.listCustomer = data.ListCustomer;
										$scope.disabledLoadMore = ($scope.listCustomer == null || $scope.listCustomer.length < 20) ? true:false;
										$scope.listPayment	= data.ListPayment;

										$scope.field.exChangeRatePay = data.ExChangeRate;
										$scope.listClaimType = data.ListClaimType;
										$scope.field.approvingOfficer = data.ApprovingOfficer;
										$scope.IsInvoiceType = data.IsInvoiceType;
										$scope.ListGstType = data.ListGstType;
										$scope.field.invoiceType = $scope.ListGstType!=null ? $scope.ListGstType[0]:{};
										$scope.ListCompany =  data.ListCompany;
										$scope.field.company =  data.CompanyDefault;
										$scope.codeCurrency =   $scope.field.amount>0 ? $scope.defaultCurrency.Code:"";
										break;
							}


						  })

		$scope.showAttached = false;

		$scope.showAttachedList = function(){
			$scope.showAttached = true;


		}
		$scope.hideAttachedList = function(){
			$scope.showAttached = false;

		}
		$scope.selectTypeDate = function(field){
			var temp = $scope.field[field] ;
			$scope.field[field] = angular.copy(DateTimeService.selectDate.fullDate);
			if(field=="date"){
			 	$scope.getAmount();
			 }
			if(field=="incurredFrom" || field=="incurredTo"){

				from = $scope.field.incurredFrom!='' ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredFrom):0;
				to = $scope.field.incurredTo!="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredTo):0;
				if( from>to && $scope.field.incurredFrom!='' && $scope.field.incurredTo!=''){
					if(field=="incurredFrom")
					{
						$scope.field["incurredTo"] = $scope.field["incurredFrom"];
						$(".modal").hide();
						$(".overlay").hide();
						$(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
					}
					else{
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.myclaim.reim.apply.incurred_to_is_less_than_from
							};
							$scope.field[field] = temp;
					}

				}
				else{
					$(".modal").hide();
					$(".overlay").hide();
					$(".scroll").css({"overflow":"auto"}); // fix android 4.2.2
				}
			}
		}
		$scope.getAmount = function(){

			var ClaimAmt = $scope.field.receiptAmount*$scope.field.exChangeRate;
			var claimNegative = url=="MyClaimsExpenseClaimApplyReimbursement" ? $scope.field.reimbursenmentType.ReimbursementData.Claim_Negative: $scope.field.benefitType.BenefitInfo.Claim_Negative;
		/*	if(ClaimAmt<=0 && claimNegative==0){
				 $scope.field.amount = "";
				$scope.codeCurrency = "";
				return false;
			}*/
			BcItemId = url=="MyClaimsBenefitClaimApplyBenefit"? $scope.field.benefitType.Id:url=="MyClaimsExpenseClaimApplyReimbursement"? $scope.field.reimbursenmentType.Id: null;
			inCurred =  url=="MyClaimsBenefitClaimApplyBenefit"?$scope.field.inCurred.Opt:1;
			var param = {
						BcItemId:  BcItemId,
						ClaimAmt: ClaimAmt,
						CurrencyId: $scope.defaultCurrency.Id,
						Date:  DateTimeService.parseMilliSecondToUTC($scope.field.date),
						GtsAmt: $scope.field.gstAmount,
						InCurred:inCurred,
       			 	};
				 if(url!="MyClaimsRequestForPaymentApplyPayment"){

				   ProcessService.ajaxPost("Common/GetReimburseAmt",JSON.stringify(param)).then(function(result) {
					   data = JSON.parse(result.data);
						 if( claimNegative==1){
							 $scope.field.amount = data.ReimburseAmount!=0 ? data.ReimburseAmount : "0";
						 }
						 else if(parseFloat(data.ReimburseAmount) > 0){
							 	 $scope.field.amount = parseFloat(data.ReimburseAmount);
						 }
						 else{

							  $scope.field.amount = "0";
						 }

					    $scope.codeCurrency =  $scope.defaultCurrency.Code;
					})
				}
				else{

					$scope.field.amount = (parseFloat($scope.field.gstAmount)+parseFloat($scope.field.receiptAmount))*$scope.field.exChangeRate;
					 $scope.codeCurrency =   $scope.field.amount>0 ? $scope.defaultCurrency.Code:"";
				}



		}

		$scope.getAmountRequestForPayment = function(){
			var amount1 = (!$.isEmptyObject($scope.field.claimItem1) && $scope.field.receiptAmount1>0)?$scope.field.receiptAmount1:0;
			var amount2 = (!$.isEmptyObject($scope.field.claimItem2) && $scope.field.receiptAmount2>0)?$scope.field.receiptAmount2:0;
			var amount3 = (!$.isEmptyObject($scope.field.claimItem3) && $scope.field.receiptAmount3>0)?$scope.field.receiptAmount3:0;
			var amount4 =(!$.isEmptyObject($scope.field.claimItem4) && $scope.field.receiptAmount4>0)?$scope.field.receiptAmount4:0;
			var amount5 = (!$.isEmptyObject($scope.field.claimItem5) && $scope.field.receiptAmount5>0)?$scope.field.receiptAmount5:0;
			var gstAmountPay = $scope.field.gstAmountPay>0?$scope.field.gstAmountPay:0

			$scope.field.amount =  (parseFloat(amount1)+parseFloat(amount2)+parseFloat(amount3)+parseFloat(amount4)+parseFloat(amount5)+parseFloat(gstAmountPay));

			$scope.field.totalAmount = $scope.field.amount * $scope.field.exChangeRatePay;
			$scope.codeCurrency =   $scope.field.amount>0 ? $scope.defaultCurrency.Code:"";



		}
    $scope.updateValueBillable = function () {
      $scope.field.billable = !$scope.field.billable;
    }
		$scope.getExchangeRate = function(){
			  var param = {
						CurrencyId:  $scope.field.currency.Id,
						Date: DateTimeService.parseMilliSecondToUTC($scope.field.date),
       			   };
		 ProcessService.ajaxPost("Common/GetExchangeRate",JSON.stringify(param)).then(function(result) {
						data = JSON.parse(result.data);
						if($location.path()=="/claimRequestForPaymentApply"){
							$scope.field.exChangeRatePay = data.ExChangeRate;
							$scope.field.totalAmount = $scope.field.amount * $scope.field.exChangeRatePay;
						}
						else{
							$scope.field.exChangeRate = data.ExChangeRate;

							$scope.getAmount();
						}

					});
		}

		 $scope.selectField = function(field,item){

			 $scope.field[field] = angular.copy(item);
			 if(field == "exChangeRate"){
				 if(item == 0)
				 	 $scope.field.exChangeRate = 0.000001;
			 }

			  if(field == "exChangeRatePay"){
				 if(item == 0)
				 	 $scope.field.exChangeRatePay = 0.000001;
			 }

			  if(field == "gstAmount" || field == "exChangeRate" || field=="receiptAmount")
			  {

				    $scope.getAmount();
			  }

			   if(field=="benefitType"){
				 $scope.addListInCurred();
				 $scope.setDefaultAmtForBennefit();
			   }
			    if(field=="reimbursenmentType"){
			   		$scope.setDefaultAmtForReim();
			  	}
			    if(field=="inCurred"){
				 $scope.setDefaultAmtForBennefit();
			   }

			   if(field == "currency"){
				   $scope.getExchangeRate();
			   }
			  //for the Apply Reimbursement Claim
			   if(field=="Rate_Value" || field=="Unit_Value"){
			     //code old
           //$scope.field.receiptAmount =  item*$scope.field.reimbursenmentType.ReimbursementData.Mileage_Rate;

           // code new edit 18/10/2016
           if(field == "Rate_Value"){
             $scope.field.reimbursenmentType.ReimbursementData.Rate_Value =item;
           }
				  $scope.field.receiptAmount =  $scope.field.reimbursenmentType.ReimbursementData.Rate_Value*$scope.field.Unit_Value;
				  $scope.getAmount();

			  }
			    if(field=="inCurred"){

					if($scope.field.inCurred.ListDependents!=null){
						$scope.field.dependant = $scope.field.inCurred.ListDependents[0];
					}
					else{
						$scope.field.dependant = {};
					}

				}

				//for the Apply request for payment
				 if(field == "company"){
					 $scope.field["payTo"] = {};
					 $scope.field["claimFrom"] = {};
					 var arrClaim = [1,2,3,4,5];
					 angular.forEach(arrClaim,function(value){
						 	$scope.field["claimItem"+value] = {RequestPaymentData:{Self_Remark:0,Self_File:0}};
							$scope.field["receiptAmount"+value] = "";
							$scope.field["claimDesc"+value] = {};
					 })

					 var param = {
            				EcCo_Id:  $scope.field.company.Id
       				 };
					// change list company
					 ProcessService.ajaxPost("MyClaimsRequestForPaymentApplyPayment/GetAllDataByCompany",JSON.stringify(param)).then(function(result)     {
							  data = JSON.parse(result.data);
							  $scope.listCustomer = data.ListCustomer;
							  $scope.listClaimType =  data.ListClaimType;
								$scope.field.approvingOfficer = data.ApprovingOfficer;

					  })

				 }
				 if(field == "claimItem1" || field=="claimItem2" || field == "claimItem3" || field == "claimItem4" || field == "claimItem5"){

					 	index = field.substr(field.length - 1);
						var arrClaim = [1,2,3,4,5];
						arrClaim.splice(index-1, 1);

						angular.forEach(arrClaim,function(value){
							if($scope.field["claimItem"+index].Id == $scope.field["claimItem"+value].Id){
								$rootScope.error = {
									result : true,
									message : "Duplicate Record",
								};
								$scope.field["claimItem"+index] = {RequestPaymentData:{Self_Remark:0,Self_File:0}};
								return false;
							}
						})

						$scope.field["receiptAmount"+index] = "";
						$("#textReceiptAmount"+index).val("");
						$scope.field["claimDesc"+index] = {};
					 	$scope.getAmountRequestForPayment();
				 }
				 if(field=="receiptAmount1" ||field=="receiptAmount2"||field=="receiptAmount3"|| field=="receiptAmount4" || field=="receiptAmount5" || field == "gstAmountPay" || field == "exChangeRatePay"){

					 $scope.getAmountRequestForPayment();

				}

				 if(field == "bcCustomer" || field=="payTo" || field=="claimFrom"){
					 PoupService.closePoup();
				 }





		 }
		 $scope.checkChangeExChangeRate = function(){
			 if("Id" in $scope.field["currency"])
			 return  $scope.defaultCurrency.Id != $scope.field["currency"]["Id"];
		 }
		$scope.addListInCurred = function(){
			$scope.field.benefitType["ListIncurred"] = [];
			if($scope.field.benefitType.BenefitInfo.Cov_Ee==1)
				$scope.field.benefitType["ListIncurred"].push($scope.listIncurred[0]);
			if($scope.field.benefitType.BenefitInfo.Cov_Spouse==1)
				$scope.field.benefitType["ListIncurred"].push($scope.listIncurred[1]);
			if($scope.field.benefitType.BenefitInfo.Cov_Child==1)
				$scope.field.benefitType["ListIncurred"].push($scope.listIncurred[2]);
			if($scope.field.benefitType.BenefitInfo.Cov_Parent==1)
				$scope.field.benefitType["ListIncurred"].push($scope.listIncurred[3]);

				if("ListIncurred" in $scope.field.benefitType){
					$scope.field.inCurred = $scope.field.benefitType.ListIncurred[0];
					if("ListDependents" in $scope.field.benefitType.ListIncurred)
					$scope.field.dependant = $scope.field.benefitType.ListIncurred[0].ListDependents[0];
				}
				else
				{
					$scope.field.inCurred = {"ListDependents":[]};
				}

		}
		$scope.setDefaultAmtForBennefit = function(){

			if($scope.field.benefitType.BenefitInfo.SelfAmt == 1){
				var AmtDefaultValue = null;
				angular.forEach($scope.field.benefitType.BenefitInfo.AmtDefaultValue,function(value,index){
					if(value.Incurred == $scope.field.inCurred.Opt){
						AmtDefaultValue = value;
						return false;
					}
				})
				$scope.field.receiptAmount = AmtDefaultValue.Amt_Claim;
			}
			else{
				$scope.field.receiptAmount = '';
			}
			$scope.getAmount();
		}
		$scope.setDefaultAmtForReim = function(){

			if($scope.field.reimbursenmentType.ReimbursementData.SelfAmt == 1){
				var AmtDefaultValue = $scope.field.reimbursenmentType.ReimbursementData.AmtDefaultValue[0];

				$scope.field.receiptAmount = AmtDefaultValue.Amt_Claim;
			}
			else{
				$scope.field.receiptAmount = '';
			}
			$scope.getAmount();
		}
		$scope.checkValidateBenefit = function() {

						if($.isEmptyObject($scope.field.benefitType)){
							$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.ben.apply.benefit_type
								};
							return false;
						}
						if($scope.field.receiptNo ==""){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.receipt_no.tt
								};
								return false;
						}


						if($.isEmptyObject($scope.field.dependant)==true && $scope.field.inCurred.Opt!=1){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.dependant
							};
							return false;
						}


						if($scope.field.receiptAmount ==0 || $scope.field.receiptAmount ==''){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.general.please_enter + " "+ $rootScope.lang.myclaim.receipt_amount.tt
							};
							return false;
						}

						if($scope.field.amount<=0 && $scope.field.benefitType.BenefitInfo.Claim_Negative==0){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.myclaim.validation.insufficient_balance
							};
							return false;
						}

            if($scope.field.incurredFrom =='' && $scope.field.benefitType.BenefitInfo.Self_Incurred==1){
              $rootScope.error = {
                result : true,
                message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.incurred_from
              };
              return false;
            }

            if($scope.field.incurredTo =='' && $scope.field.benefitType.BenefitInfo.Self_Incurred==1){
              $rootScope.error = {
                result : true,
                message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.incurred_to
              };
              return false;
            }

						if($scope.field.incurredFrom != "" || $scope.field.incurredTo != ""){
							from = $scope.field.incurredFrom!='' ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredFrom):0;
							to = $scope.field.incurredTo!="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredTo):0;
							if(from>to || $scope.field.incurredFrom==""){
								$rootScope.error = {
								result : true,
								message : $rootScope.lang.myclaim.reim.apply.incurred_to_is_less_than_from
							};
								return false;
							}
						}

						if($scope.field.receiptAmount > $scope.field.amount && $scope.field.benefitType.BenefitInfo.Self_FullReimb==1){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.myclaim.validation.insufficient_reimburse_amount
							};
							return false;
						}



						if($scope.IsClaimDesc ==1 && $scope.field.benefitType.BenefitInfo.ClaimDesc!=null && $scope.field.benefitType.BenefitInfo.ClaimDesc.length>0 && $.isEmptyObject($scope.field.description)){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.description
							};
							return false;
						}


						if($scope.field.remarks =='' && $scope.field.benefitType.BenefitInfo.SelfRemark==1){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.remarks.tt
							};
							return false;
						}

		/*if($scope.field.benefitType.BenefitInfo.ApprOfficer =='' || $scope.field.benefitType.BenefitInfo.ApprOfficer==null){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.myleave.apply.validation.no_approving_officer
							};
							return false;
						}*/



						if($rootScope.listFileAttached.length ==0 && $scope.field.benefitType.BenefitInfo.SelfFile==1){
							$rootScope.error = {
								result : true,
								message : $rootScope.lang.general.please_upload_file
							};
							return false;
						}
						return true;
	}

	$scope.checkValidateReimbursement = function() {
				if($.isEmptyObject($scope.field.reimbursenmentType)){
					$rootScope.error = {
							result : true,
							message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.reimbursement_type
						};
					return false;
				}
				if($scope.field.receiptNo ==""){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.receipt_no.tt
					};
					return false;
				}


				if($scope.field.from =='' && $scope.field.reimbursenmentType.ReimbursementData.Mileage==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.general.from
					};
					return false;
				}


				if($scope.field.to =='' && $scope.field.reimbursenmentType.ReimbursementData.Mileage==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.general.to
					};
					return false;
				}


				/*if($scope.field.reimbursenmentType.ReimbursementData.Mileage==1 && $scope.field.mileage == ''){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.mileage.tt
					};
					return false;
				}*/

    if($scope.field.reimbursenmentType.ReimbursementData.Rate_IsShow==1 && ($scope.field.reimbursenmentType.ReimbursementData.Rate_Value == '' || $scope.field.reimbursenmentType.ReimbursementData.Rate_Value == 0)){
      $rootScope.error = {
        result : true,
        message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.rate
      };
      return false;
    }

    if($scope.field.reimbursenmentType.ReimbursementData.Rate_IsShow==1 && $scope.field.Unit_Value == ''){
      $rootScope.error = {
        result : true,
        message : $rootScope.lang.general.please_enter+" Unit"
      };
      return false;
    }


				if( $scope.field.receiptAmount ==''){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter +" "+ $rootScope.lang.myclaim.receipt_amount.tt
					};
					return false;
			  }

				if($scope.field.incurredFrom =='' && $scope.field.reimbursenmentType.ReimbursementData.Self_Incurred==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.incurred_from
					};
					return false;
				}

				if($scope.field.incurredTo =='' && $scope.field.reimbursenmentType.ReimbursementData.Self_Incurred==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.incurred_to
					};
					return false;
				}

				/*if($scope.IsGstDetail==1 && $scope.field.reimbursenmentType.ReimbursementData.GST==1 && $scope.field.gstAmount ==''){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter +" "+ $rootScope.lang.myclaim.reim.apply.reimburse +" "+$rootScope.lang.myclaim.gst_amount.tt
					};
					return false;
			  }*/
			  /* check min value for GST
				*if country MY is min value is 0*/

				if($scope.IsInvoiceType==1 && $scope.field.gstAmount == 0 && $scope.field.reimbursenmentType.ReimbursementData.GST==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.myclaim.validation.invalid_reimburse_gst
					};
					return false;
				 }


				if($scope.field.amount == ''){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.amount
					};
					return false;
				}
				if($scope.field.amount<=0 && $scope.field.reimbursenmentType.ReimbursementData.Claim_Negative==0){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.myclaim.validation.insufficient_balance
					};
					return false;
				}

				if($scope.field.receiptAmount == $scope.field.amount && $scope.field.reimbursenmentType.ReimbursementData.Self_FullReimb==1){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.myclaim.validation.insufficient_reimburse_amount
					};
					return false;
				}

				if($scope.field.billable == true &&  $.isEmptyObject($scope.field.bcCustomer)==true){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.reim.apply.customer.tt
					};
					return false;
				}

				if($scope.field.incurredFrom!=''){
					from = $scope.field.incurredFrom!=''?DateTimeService.parseMilliSecondToUTC($scope.field.incurredFrom):0;
					to = $scope.field.incurredTo!=''?DateTimeService.parseMilliSecondToUTC($scope.field.incurredTo):0;
					if(from > to){
						$rootScope.error = {
										result : true,
										message : $rootScope.lang.myclaim.reim.apply.incurred_to_is_less_than_from
									};
							return false;
					}
				}

				if($scope.IsInvoiceType==1 && $scope.field.gstRegistrationNo.length !=12 && $scope.field.reimbursenmentType.ReimbursementData.GST==1){
					$rootScope.error = {
							result : true,
							message : $rootScope.lang.myclaim.validation.gst_registration_no_vaild
						};
						return false;
				}


				if($scope.IsInvoiceType==1 && $scope.field.invoiceName =='' && $scope.field.reimbursenmentType.ReimbursementData.GST==1){
					$rootScope.error = {
							result : true,
							message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.invoice_name
						};
						return false;
				}


				if($scope.IsInvoiceType==1 && $scope.field.invoiceAddress =='' && $scope.field.reimbursenmentType.ReimbursementData.GST==1){
					$rootScope.error = {
							result : true,
							message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.invoice_address
						};
						return false;
				}

				if($scope.IsClaimDesc ==1 && $scope.field.reimbursenmentType.ReimbursementData.ClaimDesc!=null && $scope.field.reimbursenmentType.ReimbursementData.ClaimDesc.length>0 && $.isEmptyObject($scope.field.description)){
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.description
					};
					return false;
				}



				if($scope.field.remarks =='' && $scope.field.reimbursenmentType.ReimbursementData.Remark==1)
				{
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.remarks.tt
					};
					return false;
				}


				if($rootScope.listFileAttached.length ==0 && $scope.field.reimbursenmentType.ReimbursementData.Self_File==1)
				{
					$rootScope.error = {
						result : true,
						message : $rootScope.lang.general.please_upload_file
					};
					return false;
				}
				return true;
	}



	$scope.checkValidateRequestForPayment = function() {

							if($scope.field.orderNo ==""){
								$rootScope.error = {
									  result : true,
								  message : $rootScope.lang.general.please_enter +" "+ $rootScope.lang.myclaim.pay.apply.order_no.tt
								};
								return false;
							}


							if($.isEmptyObject($scope.field.company) || $scope.field.company==null){
								$rootScope.error = {
									  result : true,
								  	  message : $rootScope.lang.myclaim.pay.apply.company
								};
								return false;
							}

							if( Object.keys($scope.field.payTo).length==0){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.pay_to.tt2
								};
								return false;
							}
							if(Object.keys($scope.field.claimItem1).length==0 && Object.keys($scope.field.claimItem2).length==0 && Object.keys($scope.field.claimItem3).length==0 && Object.keys($scope.field.claimItem4).length==0 && Object.keys($scope.field.claimItem5).length==0){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.claim_item.tt
								};
								return false;
							}




							var checkValidClaimItem = false;
							for(var i=1;i<=5;i++){

								if($scope.field["claimItem"+i].hasOwnProperty("Id")){
									checkValidClaimItem = true;
								}
							}

							if(checkValidClaimItem==false){
								$rootScope.error = {
											result : true,
											message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.claim_item.tt
								};
										return false;
							}



							if($scope.IsGstDetail==1 && $scope.field.gstAmountPay == ""){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.gst_amount.tt
								};
								return false;
							}

							  /* check min value for GST
							*if country MY is min value more than 0*/
							if($scope.IsInvoiceType==1 && $scope.field.gstAmountPay == 0){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.myclaim.validation.invalid_reimburse_gst
								};
								return false;
							 }

							if($scope.IsInvoiceType==1 && $scope.field.gstRegistrationNo.length !=12){
								$rootScope.error = {
										result : true,
										message : $rootScope.lang.myclaim.validation.gst_registration_no_vaild
									};
									return false;
							}





							if($scope.IsInvoiceType==1 && $scope.field.invoiceName ==''){
								$rootScope.error = {
										result : true,
										message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.invoice_name
									};
									return false;
							}


							if($scope.IsInvoiceType==1 && $scope.field.invoiceAddress ==''){
								$rootScope.error = {
										result : true,
										message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.pay.apply.invoice_address
									};
									return false;
							}

							if($scope.field.remarks =='' && $scope.checkSelfRemark()){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_enter+" "+$rootScope.lang.myclaim.remarks.tt
								};
								return false;
							}

							if($rootScope.listFileAttached.length ==0 && $scope.checkSelfFile()){
								$rootScope.error = {
									result : true,
									message : $rootScope.lang.general.please_upload_file
								};
								return false;
							}
							return true;
	}


	$scope.submitClaimApply = function(IsSaveMode){
		var file = "";
				angular.forEach($rootScope.listFileAttached,function(value,index){
					file += "#"+value;
				})
				file = file.slice(1);
				if(!$scope.checkFutureDate($scope.field["date"])){
					return false;
				}
		switch (url) {

				case "MyClaimsBenefitClaimApplyBenefit":

			if(!$scope.checkValidateBenefit())
				return false;
				var param = {

				BcItemId: $scope.field.benefitType.Id, //Id cua Benefit type
				CurrencyId:    $scope.field.currency.Id, //value combobox currency
				Date:  DateTimeService.parseMilliSecondToUTC($scope.field.date),
				ReceiptNo: $scope.field.receiptNo,
				ClaimAmt: $scope.field.receiptAmount,// Receipt amount
				GtsAmt: $scope.field.gstAmount, //gst amount
				PayAmt: $scope.field.amount,// amount
				Remarks:  $scope.field.remarks,
				FileUrl: file,
				EfamilyUqId: $.isEmptyObject($scope.field.dependant) ? 0 : $scope.field.dependant.Uqid, //value combobox dependant
				InCurred: $scope.field.inCurred.Opt, //value combobox incurrend by
				BcBenefitId: $scope.field.benefitType.BenefitInfo.BcBenefitId, //When  select BenefitType to return
				BcDesc_Id: $scope.field.description.Id,
				BcClinic_Id: $scope.field.clinic.Id,
				Incurred_Fr:$scope.field.incurredFrom !="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredFrom) : "",
				Incurred_To:$scope.field.incurredTo !="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredTo) : "",
				ExChangeRate:$scope.field.exChangeRate,
				IsSaveMode:IsSaveMode,

			};

			if(claimItem!=null){
				param.Uqid = claimItem.Uqid;
			}
			break;
				case "MyClaimsExpenseClaimApplyReimbursement":

			if(!$scope.checkValidateReimbursement())
				return false;

				var param = {

				 ClaimDate:  DateTimeService.parseMilliSecondToUTC($scope.field.date),
				 Incurred_Fr:$scope.field.incurredFrom !="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredFrom) : "",
				Incurred_To:$scope.field.incurredTo !="" ? DateTimeService.parseMilliSecondToUTC($scope.field.incurredTo) : "",
				BcItem_Id: $scope.field.reimbursenmentType.Id,
				BcDesc_Id: $.isEmptyObject($scope.field.description)?null:$scope.field.description.Id,
				Claim_Amt: $scope.field.receiptAmount,
				GST_Amt: $scope.field.gstAmount,
				Pay_Amt: $scope.field.amount,
				EcCurrency_Id: $scope.field.currency.Id,
				Pay_EcCurrency_Id: $scope.field.currency.Id,
				Remarks: $scope.field.remarks,
				File_Id: file,
				Receipt: $scope.field.receiptNo,
				Fr: $scope.field.from,
				To: $scope.field.to,
				Rate:  $scope.field.reimbursenmentType.ReimbursementData.Rate_Value,//$scope.field.reimbursenmentType.ReimbursementData.Mileage_Rate,
				Mileage: $scope.field.Unit_Value,
				Billable: $scope.field.billable?1:0,//false
				BcCustomer_Id: $scope.field.billable?$scope.field.bcCustomer.Id:"",
				Customer: $scope.field.customer,
				GST_Reg: $scope.field.gstRegistrationNo,
				GST_Type: $scope.field.invoiceType.Opt,
				GST_Name:$scope.field.invoiceName,
				GST_Address:$scope.field.invoiceAddress,
				IsSaveMode:IsSaveMode,
				ExChangeRate:$scope.field.exChangeRate,
				BcBenefitId: $scope.field.reimbursenmentType.ReimbursementData.BcBenefitId, //When  select reimbursenment Type to return

			};
			if(claimItem!=null){
				param.Uqid = claimItem.Uqid;
			}
			break;
				case "MyClaimsRequestForPaymentApplyPayment":


			if(!$scope.checkValidateRequestForPayment())
				return false;
				var BcItem_Ids = Array();
				var BcDesc_Ids = Array();
				var Claim_Amts = Array();
				for(var i=1;i<=5;i++){

					var bcItem_Id = $.isEmptyObject($scope.field["claimItem"+i])?null:$scope.field["claimItem"+i].Id;
					BcItem_Ids.push(bcItem_Id);

					var bcDesc_Id = $.isEmptyObject($scope.field["claimDesc"+i])?null:$scope.field["claimDesc"+i].Id;
					BcDesc_Ids.push(bcDesc_Id);

					var claim_Amt = $scope.field["receiptAmount"+i]==""?0:$scope.field["receiptAmount"+i];
					Claim_Amts.push(claim_Amt);
				}
				var param = {
						ClaimDate: DateTimeService.parseMilliSecondToUTC($scope.field.date),
						BcItem_Ids: BcItem_Ids,
						Claim_Amts: Claim_Amts,
						GST_Amt:  $scope.field.gstAmountPay,
						Pay_Amt: $scope.field.amount,
						EcCurrency_Id:  $scope.field.currency.Id,
						Remarks: $scope.field.remarks,
						File_Id: file,
						Receipt: $scope.field.orderNo,
						PayMethod:$scope.field.paymentMethod.Opt,
						BcCustomer_Id:$scope.field.payTo.Id,
						C_BcCustomer_Id:$scope.field.claimFrom.Id,
						GST_Type: $scope.field.invoiceType.Opt,
						GST_Reg: $scope.field.gstRegistrationNo,
						GST_Name:$scope.field.invoiceName,
						GST_Address:$scope.field.invoiceAddress,
						BcDesc_Ids:BcDesc_Ids,
						ExChangeRate:$scope.field.exChangeRatePay,
						EcCo_Id:$scope.field.company.Id,

				};
				break;

		}

		ProcessService.ajaxPost(url+"/Submit",JSON.stringify(param)).then(function(result) {
												data = JSON.parse(result.data);

												var message = IsSaveMode==0?$rootScope.lang.general.application_saved:$rootScope.lang.general.application_submit;
												if(claimItem != null){

													backUrl = url=="MyClaimsBenefitClaimApplyBenefit" ?"claimBenefitSubmitSavesClaims" : "claimReimbursementSubmitSavesClaims";
												}
												else if(IsSaveMode==0){
													backUrl = "";

												}
												else{
													switch (url) {

														case "MyClaimsBenefitClaimApplyBenefit":
															backUrl = "claimBenefit";
															break;
														case "MyClaimsExpenseClaimApplyReimbursement":
															backUrl = "claimReimbursement";
															break;

														case "MyClaimsRequestForPaymentApplyPayment":
															backUrl = "claimRequestForPayment";
															break;


													}
												}
												$scope.processResultPost(data,message,backUrl);

											});

	}

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
						FileService.capturePhoto('Claims'); // get list attached: $rootScope.listFileAttached
					}
				})
		}
		else{
				FileService.capturePhoto('Claims'); // get list attached: $rootScope.listFileAttached
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

					window.imagePicker.getPictures(
			    function(results) {
			        for (var i = 0; i < results.length; i++) {
						 FileService.uploadPhoto(results[i],i,'Claims');
			        }
			    }, function (error) {
			        console.log('Error: ' + error);
			    } ,{
			        maximumImagesCount: 3-$rootScope.listFileAttached.length,
					//quality:70
					height:920,
					width:750
			    }
			);
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

	window.imagePicker.getPictures(
	function(results) {
			for (var i = 0; i < results.length; i++) {
		 FileService.uploadPhoto(results[i],i,'Claims');
			}
	}, function (error) {
			console.log('Error: ' + error);
	} ,{
			maximumImagesCount: 3-$rootScope.listFileAttached.length,
	//quality:70
	height:920,
	width:750
	}
);
}
	}

		$scope.removeFile = function(item) {
  			var index = $rootScope.listFileAttached.indexOf(item);
 			 $rootScope.listFileAttached.splice(index, 1);
		}

	}

   switch ($location.path()) {

					case "/claimOvertimeApply":
						processClaimOvertimeApply();
						break;

					case "/claimOvertimeApplyDetail":
						processClaimOvertimeApplyDetail();
						break;

					case "/claimOvertimeCancellation":
						processClaimCancellation("MyClaimsOvertimeClaimCancellation");
						break;

					case "/claimBenefitCancellation":
						processClaimCancellation("MyClaimsBenefitClaimCancellation");
						break;

					case "/claimReimbursementCancellation":
						processClaimCancellation("MyClaimsExpenseClaimCancellation");
						break;

					case "/claimRequestForPaymentCancellation":
						processClaimCancellation("MyClaimsRequestForPaymentCancellation");
						break;

					case "/claimOvertimeDetail":
					case "/claimBenefitDetail":
					case "/claimReimbursementDetail":
					case "/claimRequestForPaymentDetail":
					processClaimDetail("viewDetail");
						break;
					case "/claimBenefitAttach":
					case "/claimReimbursementAttach":
					case "/claimRequestForPaymentAttach":
						processClaimDetail("attach");
						break;



					case "/claimBenefitEnquiryView":
					case "/claimReimbursementEnquiryView":
					case "/claimRequestForPaymentEnquiryView":
						processClaimEnquryView();
						break;




					case "/claimBenefitBatchDetail":
					case "/claimReimbursementBatchDetail":
						processClaimBatchDetail();
						break;






					case "/claimOvertimeEnquiry":
						processClaimEnquiry("MyClaimsOvertimeClaimEnquiry");
						break;

					case "/claimBenefitEnquiry":
						processClaimEnquiry("MyClaimsBenefitClaimEnquiry");
						break;


					case "/claimReimbursementEnquiry":
						processClaimEnquiry("MyClaimsExpenseClaimEnquiry");
						break;

					case "/claimRequestForPaymentEnquiry":
						processClaimEnquiry("MyClaimsRequestForPaymentEnquiry");
						break;



					case "/claimBenefitCoverage/"+$routeParams.id:
						processClaimCoverage();
						break;


					case "/claimReimbursementCoverage/"+$routeParams.id:
						processClaimCoverage();
						break;

					case "/claimOvertimeApproval":
						processClaimApproval("MyClaimsOvertimeClaimApproval");
						break;

					case "/claimBenefitApproval":
						processClaimApproval("MyClaimsBenefitClaimApproval");
						break;

					case "/claimReimbursementApproval":
						processClaimApproval("MyClaimsExpenseClaimApproval");
						break;

					case "/claimRequestForPaymentApproval":
						processClaimApproval("MyClaimsRequestForPaymentApproval");
						break;


					case "/claimOvertimeDelegate":
						processClaimDelegate("MyClaimsOvertimeClaimDelegate");
						break;

					case "/claimBenefitDelegate":
						processClaimDelegate("MyClaimsBenefitClaimDelegate");
						break;



					case "/claimReimbursementDelegate":
						processClaimDelegate("MyClaimsExpenseClaimDelegate");
						break;


					case "/claimRequestForPaymentDelegate":
						processClaimDelegate("MyClaimsRequestForPaymentDelegate");
						break;

					case "/claimBenefitApply":
						processClaimApply("MyClaimsBenefitClaimApplyBenefit");
						break;

					case "/claimReimbursementApply":
						processClaimApply("MyClaimsExpenseClaimApplyReimbursement");
						break;

					case "/claimRequestForPaymentApply":
						processClaimApply("MyClaimsRequestForPaymentApplyPayment");
						break;

         case "/travelRequestApproval":
           processClaimTravelRequestApproval("MyClaimsTravelRequestApproval");
           break;


					case "/claimOvertime":
					case "/claimBenefit":
  					case "/claimReimbursement":
					case "/claimRequestForPayment":
						$rootScope.cache = false;
						sessionStorage.removeItem("listCancelLation");
						sessionStorage.removeItem("listSubmitSavedClaims");
						sessionStorage.removeItem("listApproval");
						$.jStorage.deleteKey("OTData");

						break;

				case "/claimBenefitSubmitSavesClaims":
						processClaimSubmitSavesClaims(1);
						break;

				case "/claimReimbursementSubmitSavesClaims":
						processClaimSubmitSavesClaims(2);
						break;

					}


});

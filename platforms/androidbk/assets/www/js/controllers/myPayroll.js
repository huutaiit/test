App.registerCtrl('myPayroll', function ($scope, $rootScope, ProcessService, $location) {
    // get 3 year nearest


   $scope.listMenuPayroll = [
					{id:690,href:"payrollPayslip",icon:"pro682.png",name:$rootScope.lang.mypayroll.payslip.tt,description:$rootScope.lang.mypayroll.payslip.ct},
     {id:695,href:"payrollCP8A",icon:"pro682.png",name:"CP8A",description:$rootScope.lang.mypayroll.cp8a.ct},
     {id:1246,href:"payrollPCB2",icon:"pro682.png",name:"PCB2",description:$rootScope.lang.mypayroll.pcb2.ct}
					]
    $scope.month = [
      { id: 1, name: $rootScope.lang.calendar.month.m_1, payslip: [] },
      { id: 2, name: $rootScope.lang.calendar.month.m_2, payslip: [] },
      { id: 3, name: $rootScope.lang.calendar.month.m_3, payslip: [] },
      { id: 4, name: $rootScope.lang.calendar.month.m_4, payslip: [] },
      { id: 5, name: $rootScope.lang.calendar.month.m_5, payslip: [] },
      { id: 6, name: $rootScope.lang.calendar.month.m_6, payslip: [] },
      { id: 7, name: $rootScope.lang.calendar.month.m_7, payslip: [] },
      { id: 8, name: $rootScope.lang.calendar.month.m_8, payslip: [] },
      { id: 9, name: $rootScope.lang.calendar.month.m_9, payslip: [] },
      { id: 10, name: $rootScope.lang.calendar.month.m_10, payslip: [] },
      { id: 11, name: $rootScope.lang.calendar.month.m_11, payslip: [] },
      { id: 12, name: $rootScope.lang.calendar.month.m_12, payslip: [] },
    ];

	var processPayrollPayslip = function(){

    $scope.trueData = function (index) {
        return ( $scope.currentYear.month[index].payslip.length>0)
    };


    ProcessService.ajaxGet("MyPayrollPayslip/GetListPayslip")
     .then(function (result) {
         $scope.objData = JSON.parse(result.data);
          console.log( $scope.objData);
		   var currentYear = $scope.objData.CurrentYear;
		    $scope.year = [
        { name: currentYear, id: 2, month: angular.copy($scope.month) },
        { name: currentYear - 1, id: 3, month: angular.copy($scope.month) },
        { name: currentYear - 2, id: 4, month: angular.copy($scope.month) },
    ];
	 $scope.currentYear =  $scope.year[0];
	 if($scope.objData.Data.length>0){
		 angular.forEach($scope.objData.Data, function (value, key) {
			$scope.year[value["Year"] - 2].month[value["Month"] - 1].payslip.push(value);
       $scope.year[value["Year"] - 2].month[value["Month"] - 1].Status = value["Status"];
			// set current month is the last month of current year that month have data
			// month go from 1 to 12 should
			if(value.Year==2){

				$scope.currentMonth =   $scope.year[value["Year"] - 2].month[value["Month"]-1];

			}
		 })
	 }
	 else{
		 $scope.currentMonth = $scope.month[0];

	 }

     });



    $scope.isYearActive = function (id) {
        return (id == $scope.currentYear.id);
    };

    $scope.isMonthActive = function (id) {
      if($scope.currentMonth){
        return (id == $scope.currentMonth.id);
      }

    };

	$scope.selectYear = function (index){

		$scope.currentYear = $scope.year[index];
		// if select year = current year then
		// set current month is the last month of current year that month have data

		if($scope.currentYear.id==2){

			for(var i=11;i>=0;i--){
				if($scope.currentYear.month[i].payslip.length>0){
					$scope.currentMonth = $scope.currentYear.month[i];
					 break;
				}
			}
		}
		// set current month is the first month of year
		else{
			$scope.currentMonth = $scope.currentYear.month[0]
		}

	};

	$scope.selectMonth = function (index){
		$scope.currentMonth = $scope.currentYear.month[index]
    console.log($scope.currentMonth);
	};


  downloadAndOpenPDF = function(payslip){
    // set status = 3 for current month (saw)
    $scope.year[$scope.currentYear["id"]-2].month[$scope.currentMonth["id"]-1].Status = 3;

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){

    	folder =fileSystem.root.nativeURL+"Download/";

    	var fileTransfer = new FileTransfer();
        var filePath = folder + fileName;
        //console.log('################# filepath');
       console.log(filePath);


    fileTransfer.onprogress = function(progressEvent) {
    		//$(".loading").show();
    		//$(".overlay").show();
    	};

        fileTransfer.download(url,filePath,function(entry) {
    			$(".loading").hide();
    		  $(".overlay").hide();
    			//console.log(entry);
          //console.log('********OK!', filePath);

    			if(device.platform=="Android"){

    				cordova.plugins.fileOpener2.open(entry.nativeURL, 'application/pdf',  {
            			error : function(e) {
    						$scope.$apply(function() {
    							$rootScope.error = {
    								result : true,
    								message : "This is no app registered"
    						};
    					})
                //console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
           		 },
           		 success : function () {
                	console.log('file opened successfully');
            	}
        }
    );
    			 	//var ref = cordova.InAppBrowser.open(encodeURI(entry.nativeURL) , '_system', 'location=yes'); //  android
    			 }
    			 else{
    				 var ref = window.open(encodeURI(entry.nativeURL) , '_blank', 'location=no,EnableViewPortScale=yes');//  ios
    			}
            },
            function (error) {
    			 		console.log(error);
               /* console.log('Failed, do something');
                console.log(error);
                console.log(error.source);
                console.log(error.target);
                console.log(error.http_status);*/
    					$(".loading").hide();
    					$(".overlay").hide();

    					$scope.$apply(function() {
    						// $location.path("/Login");
    					$rootScope.error = {
    						result : true,
    						message : "Failed"
    					};
    				 })
            //alert('Oh no, something went wrong');
            }
        );
    }, null);
  }
	$scope.downloadAndOpenPDF = function (payslip) {
		$(".loading").show();
		$(".overlay").show();
    console.log("item payslip",payslip);
		url = $rootScope.GATEWAYURL+"api/MyPayrollPayslip/GetDetails?Year="+payslip.TrueYear+"&&Month="+payslip.TrueMonth+"&&Run="+payslip.Run + "&&type="+payslip.Type;
		console.log(payslip.FileName);
		fileName = payslip.FileName.replace(/ /g, "_")+".pdf"; // replace " "  to "_"
		fileName = fileName.replace(",","");

var folder = "";
if(device.platform=="Android"){
ProcessService.checkPermission("READ_EXTERNAL_STORAGE").then(function(response) {

  if(response.status==false){
    $(".loading").hide();
    $(".overlay").hide();
      $rootScope.error = {
        result : true,
        message :"READ STORAGE permission is not turned on",
     };
  }
  else{
    ProcessService.checkPermission("WRITE_EXTERNAL_STORAGE").then(function(response) {
      if(response.status==false){
        $(".loading").hide();
        $(".overlay").hide();
        $rootScope.error = {
          result : true,
          message :"WRITE STORAGE permission is not turned on",
        };
      }
      else{
        downloadAndOpenPDF(url,fileName);
      }
    })
  }

})
}
else{
  downloadAndOpenPDF(payslip);
}

}
			}


  var processPayrollCP8A = function(){



    ProcessService.ajaxGet("MyPayrollMYCP8A/GetListMYCP8A")
      .then(function (result) {
        $scope.objData = JSON.parse(result.data);
        console.log( $scope.objData);
        var checkHaveData = $scope.objData.CheckHaveData;
        var currentYear = $scope.objData.CurrentYear;
        $scope.year = [
         // { name: currentYear, id: 2, month: angular.copy($scope.month) },
          { name: currentYear, id: 1 },
          { name: currentYear - 1, id: 2 },
        ];

          angular.forEach($scope.year,function (value) {
            value.hasData = false;
            for(var key in checkHaveData) {
              if(checkHaveData[key]==value.id){
                value.hasData = true
              }
            }

          })

        $scope.currentYear =  $scope.year[0];
      });

    $scope.isYearActive = function (id) {
      return ($scope.currentYear!=null && id == $scope.currentYear.id && $scope.currentYear.hasData);
    };



    $scope.selectYear = function (index){
      $scope.currentYear = $scope.year[index];
      console.log($scope.currentYear)
      if(!$scope.currentYear.hasData)
        return false;
      $scope.downloadAndOpenPDF( $scope.currentYear);
    };

    var downloadAndOpenPDF = function(url,fileName){
      // set status = 3 for current month (saw)
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){

        var folder =fileSystem.root.nativeURL+"Download/";

        var fileTransfer = new FileTransfer();
        var filePath = folder + fileName;
        //console.log('################# filepath');
        console.log(filePath);


        fileTransfer.onprogress = function(progressEvent) {
          //$(".loading").show();
          //$(".overlay").show();
        };

        fileTransfer.download(url,filePath,function(entry) {
            $(".loading").hide();
            $(".overlay").hide();
            //console.log(entry);
            //console.log('********OK!', filePath);

            if(device.platform=="Android"){

              cordova.plugins.fileOpener2.open(entry.nativeURL, 'application/pdf',  {
                  error : function(e) {
                    $scope.$apply(function() {
                      $rootScope.error = {
                        result : true,
                        message : "This is no app registered"
                      };
                    })
                    //console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                  },
                  success : function () {
                    console.log('file opened successfully');
                  }
                }
              );
              //var ref = cordova.InAppBrowser.open(encodeURI(entry.nativeURL) , '_system', 'location=yes'); //  android
            }
            else{
              var ref = window.open(encodeURI(entry.nativeURL) , '_blank', 'location=no,EnableViewPortScale=yes');//  ios
            }
          },
          function (error) {
            console.log(error);
            /* console.log('Failed, do something');
             console.log(error);
             console.log(error.source);
             console.log(error.target);
             console.log(error.http_status);*/
            $(".loading").hide();
            $(".overlay").hide();

            $scope.$apply(function() {
              // $location.path("/Login");
              $rootScope.error = {
               result : true,
               message : "Failed"
               };
            })
            //alert('Oh no, something went wrong');
          }
        );
      }, null);
    }
    $scope.downloadAndOpenPDF = function (payslip) {
      $(".loading").show();
      $(".overlay").show();

      var url = $rootScope.GATEWAYURL+"api/MyPayrollMYCP8A/GetDetails?Year="+payslip.id;
      console.log(payslip.FileName);
      var fileName = "mycp8a"+payslip.id+'.pdf';
      //fileName = fileName.replace(",","");

      if(device.platform=="Android"){
        ProcessService.checkPermission("READ_EXTERNAL_STORAGE").then(function(response) {

          if(response.status==false){
            $(".loading").hide();
            $(".overlay").hide();
            $rootScope.error = {
              result : true,
              message :"READ STORAGE permission is not turned on",
            };
          }
          else{
            ProcessService.checkPermission("WRITE_EXTERNAL_STORAGE").then(function(response) {
              if(response.status==false){
                $(".loading").hide();
                $(".overlay").hide();
                $rootScope.error = {
                  result : true,
                  message :"WRITE STORAGE permission is not turned on",
                };
              }
              else{
                downloadAndOpenPDF(url,fileName);
              }
            })
          }

        })
      }
      else{
        downloadAndOpenPDF(url,fileName);
      }

    }
  }

  var processPayrollPCB2 = function(){



    ProcessService.ajaxGet("MyPayrollMYPCB2/GetListMYPCB2")
      .then(function (result) {
        $scope.objData = JSON.parse(result.data);
        console.log( $scope.objData);
        var checkHaveData = $scope.objData.CheckHaveData;
        var currentYear = $scope.objData.CurrentYear;
        $scope.year = [
          // { name: currentYear, id: 2, month: angular.copy($scope.month) },
          { name: currentYear , id: 1 },
          { name: currentYear - 1, id: 2 },
        ];

        angular.forEach($scope.year,function (value) {
          value.hasData = false;
          for(var key in checkHaveData) {
            if(checkHaveData[key]==value.id){
              value.hasData = true
            }
          }

        })

        $scope.currentYear =  $scope.year[0];
      });

    $scope.isYearActive = function (id) {
      return ($scope.currentYear!=null && id == $scope.currentYear.id && $scope.currentYear.hasData);
    };



    $scope.selectYear = function (index){
      $scope.currentYear = $scope.year[index];
      console.log($scope.currentYear)
      if(!$scope.currentYear.hasData)
        return false;
      $scope.downloadAndOpenPDF( $scope.currentYear);
    };

    var downloadAndOpenPDF = function(url,fileName){
      // set status = 3 for current month (saw)
      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){

        var folder =fileSystem.root.nativeURL+"Download/";

        var fileTransfer = new FileTransfer();
        var filePath = folder + fileName;
        //console.log('################# filepath');
        console.log(filePath);


        fileTransfer.onprogress = function(progressEvent) {
          //$(".loading").show();
          //$(".overlay").show();
        };

        fileTransfer.download(url,filePath,function(entry) {
            $(".loading").hide();
            $(".overlay").hide();
            //console.log(entry);
            //console.log('********OK!', filePath);

            if(device.platform=="Android"){

              cordova.plugins.fileOpener2.open(entry.nativeURL, 'application/pdf',  {
                  error : function(e) {
                    $scope.$apply(function() {
                      $rootScope.error = {
                        result : true,
                        message : "This is no app registered"
                      };
                    })
                    //console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                  },
                  success : function () {
                    console.log('file opened successfully');
                  }
                }
              );
              //var ref = cordova.InAppBrowser.open(encodeURI(entry.nativeURL) , '_system', 'location=yes'); //  android
            }
            else{
              var ref = window.open(encodeURI(entry.nativeURL) , '_blank', 'location=no,EnableViewPortScale=yes');//  ios
            }
          },
          function (error) {
            console.log(error);
            /* console.log('Failed, do something');
             console.log(error);
             console.log(error.source);
             console.log(error.target);
             console.log(error.http_status);*/
            $(".loading").hide();
            $(".overlay").hide();

            $scope.$apply(function() {
              $location.path("/Login");
              /*$rootScope.error = {
               result : true,
               message : "Failed"
               };*/
            })
            //alert('Oh no, something went wrong');
          }
        );
      }, null);
    }
    $scope.downloadAndOpenPDF = function (payslip) {
      $(".loading").show();
      $(".overlay").show();

      var url = $rootScope.GATEWAYURL+"api/MyPayrollMYPCB2/GetDetails?Year="+payslip.id;
      console.log(payslip.FileName);
      var fileName = "mycp8a"+payslip.id+'.pdf';
      //fileName = fileName.replace(",","");
      if(device.platform=="Android"){

        ProcessService.checkPermission("READ_EXTERNAL_STORAGE").then(function(response) {

          if(response.status==false){
            $(".loading").hide();
            $(".overlay").hide();
            $rootScope.error = {
              result : true,
              message :"READ STORAGE permission is not turned on",
            };
          }
          else{
            ProcessService.checkPermission("WRITE_EXTERNAL_STORAGE").then(function(response) {
              if(response.status==false){
                $(".loading").hide();
                $(".overlay").hide();
                $rootScope.error = {
                  result : true,
                  message :"WRITE STORAGE permission is not turned on",
                };
              }
              else{
                downloadAndOpenPDF(url,fileName);
              }
            })

          }

        })
      }
      else{
       downloadAndOpenPDF(url,fileName);
      }

    }
  }

	switch ($location.path()) {

					case "/payrollPayslip":
						processPayrollPayslip();
						break;


          case "/payrollCP8A":
            processPayrollCP8A();
            break;

          case "/payrollPCB2":
            processPayrollPCB2();
            break;
	}
});

App.registerCtrl('loginCtrl', function($scope,$rootScope,$location,$http, $sce,ProcessService,DateTimeService)
{
  delFile = function() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
      var folder =fileSystem.root.nativeURL+"Download/";
      window.resolveLocalFileSystemURL(folder, function (dir) {
        var fileDownLoad = $.jStorage.get("FileDownLoad") || [];
        for(var i=0;i<fileDownLoad.length;i++){
          dir.getFile(fileDownLoad[i], {create: false}, function (fileEntry) {
            fileEntry.remove(function (file) {
              // alert("file removed!");
            }, function (error) {
              // alert("error occurred: " + error.code);
            }, function () {
              // alert("file does not exist");
            });
          });
        }
        $.jStorage.deleteKey("FileDownLoad");
      });
    })
  }

  setTimeout(function () {
    delFile();
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


    push.on('notification', function (data) {

      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
      if(data.additionalData && data.additionalData.type==1){
        $scope.$apply(function(){
          $rootScope.confirm = {
            result: true,
            message: data.message,
            title: $rootScope.lang.general.confirm,
            callBack: function () {
              ProcessService.ajaxPost("login/RequestFromMobile?confirm=true&token="+data.additionalData.token, {
                confirm: true,
                token: data.additionalData.token
              }).then(function (result) {
                // console.log("resultresult", result);
              })
            },
            cancel: function () {
              ProcessService.ajaxPost("login/RequestFromMobile?confirm=false&token="+data.additionalData.token, {
                confirm: false,
                token: data.additionalData.token
              }).then(function (result) {
                // console.log("resultresult", result);
              })
            }
          }
        })

      }

    })
  },5000)
  //login 2fa

  var temp = false;
  $scope.field = {};
  $scope.PrivateImgFrog =  $.jStorage.get("PrivateImgFrog")!=null?$.jStorage.get("PrivateImgFrog"):"images/n_animal_logo.png";
  $scope.showPass = function(){
    $scope.showPassword = !$scope.showPassword
  }

  $scope.checkLoginBySSO = function(){
    if($scope.checkedSSO == true){
      return;
    }
    var params = {
      OrgName:$scope.field.org
    }
    $scope.SSO = 0;
    ProcessService.ajaxPost("login/GetSSO",params).then(function(result) {
      $scope.field.SSO_url = null;
      $scope.field.SSO_Token = null;
      var data = JSON.parse(result.data);
      console.log("GetSSO",data.data.SSO_url)
      $scope.field.SSO_url = data.data.SSO_url;
      $scope.field.SSO_Token = data.data.SSO_Token;
      $scope.SSO = data.data.SSO;
    })
    $scope.checkedSSO = true;
    setTimeout(function () {
      $scope.checkedSSO = false;
    },5000)
  }
  var loginField =  $.jStorage.get("loginField");
  if(loginField!=null){
    $scope.field = loginField;
    $scope.field["password"] = "";
    $scope.checkLoginBySSO();
  }
  $scope.field.txtTwoFa = "1. Activate Mobile OTP Generator  <br> 2. Enter 6-digit Code here";
  $scope.field.twoFaError = false
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
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
          var folder = fileSystem.root.nativeURL + "Download/";
          var date = new Date();
          var fileName = "private_img_frog_" + date.getTime();
          ProcessService.moveFile(result.data, fileName, folder).then(function (result3) {
            $.jStorage.set("PrivateImgFrog", result3.data.nativeURL);
            $scope.PrivateImgFrog = $.jStorage.get("PrivateImgFrog");
          })

          // ProcessService.createFolder("payroll2u").then(function(result2){
          //   newFileUri = result2.data.nativeURL;
          //   date = new Date();
          //   fileName = "private_img_frog_"+date.getTime();
          //   ProcessService.moveFile(result.data,fileName,newFileUri).then(function(result3){
          //
          //     $.jStorage.set("PrivateImgFrog",result3.data.nativeURL);
          //     $scope.PrivateImgFrog =  $.jStorage.get("PrivateImgFrog");
          //
          //
          //
          //   });
          // })
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

  $scope.checkShowModalError = function(){
    if($rootScope.error && $rootScope.error.result && $rootScope.error.message)
      return "true";
    return "false";
  }

  $scope.checkValidateLogin = function(){


    if(!$scope.field.org){
      $rootScope.error = {
        result : true,
        message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.org
      };
      return false;
    }

    if(!$scope.field.username){
      $rootScope.error = {
        result : true,
        message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.your_user_id
      };
      return false;
    }

    if(!$scope.field.password){
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
      console.log("objectData",result)
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
            var user = {"Last_Login":date,"FullName":objectData.FullName,First_Ctry:objectData.First_Ctry,Emp_no:objectData.Emp_no};
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

            console.log("objectData",objectData);

            sessionStorage.setItem('TMS_Photo', objectData.TMS_Photo);
            $.jStorage.set("MenuMobile",objectData.MenuMobile);
            $scope.field.email = "";// reset null email in field
            $scope.field.password = "";// reset null password in field
            $.jStorage.set("loginField", $scope.field);
            var milli = objectData.Last_Login.replace(/\/Date\((-?\d+)\)\//, '$1');
            var date = new Date(parseInt(milli));


            var datetype = objectData.Date_Fmt=="1" ? "mediumDate": objectData.Date_Fmt=="2" ? "mediumDate2":"mediumDate3";
            date = DateTimeService.dateFormat(date,datetype);

            user = {"Last_Login":date,"FullName":objectData.FullName,First_Ctry:objectData.First_Ctry,Emp_no:objectData.Emp_no};
            $.jStorage.set("user",user);


            //  2fa cho mobile app với Google authentication
            DateTimeService.resetInternationalizationStrings();
            $rootScope.MenuMobile =  $.jStorage.get("MenuMobile");
            $rootScope.processMenu();
            sessionStorage.setItem('checkRegistrationId',0); // check to update token for notification
            var twofa_ga = objectData.Twofa_ga;
            if(twofa_ga==1){
              $scope.Twofa_token =  objectData.Twofa_token;
              $(".twofa_ga").trigger("click");
            }
            else{
              $scope.goURL('Home');
            }

            // ProcessService.ajaxGetLocalSite($rootScope.GATEWAYURL+"resource/lang/lang"+objectData.Language+".txt")
            //   .then(function(result) {
            //
            //     $.jStorage.set("lang",result.data);
            //     $rootScope.lang =  $.jStorage.get("lang");
            //
            //
            //   })
            break;
          default:
            $rootScope.error = {
              result : true,
              message : objectData.Message
            };
            break;

        }
      }
    });

  }

  $scope.checkGAOTP = function(){
    $scope.checkedSSO = true;
    if(!$scope.field.twoFaOTP){
      $scope.field.twoFaError = true;
      $scope.field.txtTwoFa = 'Please enter OTP';
      return;
    }
    else if($scope.field.twoFaOTP.length!=6){
      $scope.field.twoFaError = true;
      $scope.field.txtTwoFa = 'OTP must be 6 digits';
      return;
    }
    $(".close-modal").trigger("click");
    $scope.field.twoFaError = false;
    $scope.field.txtTwoFa = 'GA OTP';
    var params = {
      Twofa_token:$scope.Twofa_token,
      Otp:$scope.field.twoFaOTP
    }
    console.log("params",params)
    ProcessService.ajaxPost2("login/CheckGoogleAuthentication",params).then(function(result) {
      $scope.field.twoFaOTP = '';
      var data = JSON.parse(result.data);
      console.log("data",data)
      if(data.Result){
        $scope.goURL('Home');
      }
      else{
        $rootScope.error = {
          result : true,
          message : data.Message
        };
      }

    })
  }


  $scope.loginSSO = function(){
    // cordova.plugins.Keyboard.close();
    if($scope.field.org == ''){
      $rootScope.error = {
        result : true,
        message : $rootScope.lang.general.please_enter + " " + $rootScope.lang.login.txt.org
      };
      return false;
    }
    var param = {
      OrgName:$scope.field.org,
      // UserId: $scope.field.username,
      // Password: $scope.field.password,
      SSO_Token:$scope.field.SSO_Token,
    }
    ProcessService.ajaxPost2("login/CheckLoginBySSO",param).then(function(result) {
      cordova.plugins.Keyboard.close();
      if(device.platform=="Android"){
        myWindow.close();
      }
      else{
        SafariViewController.hide();
      }
      var objectData = JSON.parse(result.data);
      console.log(objectData);
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
            var user = {"Last_Login":date,"FullName":objectData.FullName,First_Ctry:objectData.First_Ctry,Emp_no:objectData.Emp_no};
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

            user = {"Last_Login":date,"FullName":objectData.FullName,First_Ctry:objectData.First_Ctry,Emp_no:objectData.Emp_no};
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

          default:
            $rootScope.error = {
              result : true,
              message : objectData.Message
            };
            break;

        }
      }



    });
    if(device.platform=="Android"){
    var myWindow = window.open($scope.field.SSO_url, '_blank');
    }
    else {
      SafariViewController.show({
        url: $scope.field.SSO_url,
        hidden: false, // default false. You can use this to load cookies etc in the background (see issue #1 for details).
        animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
        transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
        // enterReaderModeIfAvailable: readerMode, // default false
        tintColor: "#00ffff", // default is ios blue
        barColor: "#0000ff", // on iOS 10+ you can change the background color as well
        controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
      })
    }
    // var myWindow = cordova.InAppBrowser.open($scope.field.SSO_url, '_blank');// window.open($scope.field.SSO_url, '_self'); //
    // console.log("myWindow",myWindow)
    // setTimeout(function () {
    //   $(".loading").css({"display":"none"});
    //   $(".overlay-load").hide();
    // },3000)
    $scope.showLoginSSO = true;
    // $scope.SSO_url = $sce.trustAsResourceUrl($scope.field.SSO_url);
  }

});


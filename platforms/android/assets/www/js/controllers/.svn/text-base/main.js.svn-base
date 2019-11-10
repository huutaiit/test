App.controller('mainCtrl', function($scope, $rootScope, $location,$timeout,$route,ProcessService)
{

	$timeout(function(){
		$scope.device = device.platform;
		var permissions = cordova.plugins.permissions;
	},5000);
	var temp = false;
	$rootScope.heightWindow = $(window).height();
	 document.addEventListener("backbutton", function(){

		 if($location.path()=="/Home" || $location.path()=="/Login" ){

			if($rootScope.camerapreview==1){
			 	cordova.plugins.camerapreview.stopCamera();
				$rootScope.camerapreview = 0;
				return false;
			}
			 exit = temp == true ? true: false;
			 if(exit==false){
			 	window.plugins.toast.showShortBottom($rootScope.lang.main.txt.touch_again_to_exit);
				temp = true;
				setTimeout(function(){
					temp = false;
				},3000);
			 }
			 else{
				 navigator.app.exitApp();
			 }

		 }
		 else{
			 $rootScope.cache = true;
			 var checkBack = true;
			 $(".modal").each(function(){
				 if ($(this).css('display') == 'block') {
					$(".overlay").hide();
					$(".modal").hide();
					$("input").blur();
					checkBack = false;
					return false;
				 }
			 })
			 if($(".poup-search").length) {

				  cordova.plugins.Keyboard.close();
				  $(".poup-search").remove();
				   $("#main").css({"display": "block"});
				   checkBack = false;
				   return false;
			 }


			if(checkBack==true){
			 	history.back();
			}

		 }

		 }, true);

		  window.addEventListener('native.keyboardshow', function(e){
				$rootScope.keyboardHeight = e.keyboardHeight;
				$("#main .form .button").hide();

				$(".overlay-form-pass").show();
				// set height poup

				keyboardHeight =$rootScope.heightWindow-e.keyboardHeight;
				$(".poup-search").height(keyboardHeight);
				heightPoupSearchContent = keyboardHeight-55;

			   $(".poup-search .content").height(heightPoupSearchContent);
		 });


			window.addEventListener('native.keyboardhide', function(e){
					$("input").blur();
					$rootScope.keyboardHeight = e.keyboardHeight;

					heightWindow = $rootScope.heightWindow;

					heightHeader = $("header").innerHeight();
					heightNav = $("#quick-link").innerHeight();
					$("#main").height(heightWindow - heightHeader - heightNav-10);
					parentHeight = $(".form").innerHeight();
					heightbtn =  $(".button").innerHeight();

					titleForm = $(".title-form").innerHeight();

					$(".poup-search").height($(window).height());
			 		$(".poup-search .content").height($(window).height()-55);

					$("#form-change-pass").height(parentHeight -heightbtn-titleForm);
					$("#main .form .button").show();
					$(".overlay-form-pass").hide();

				 });



	$scope.backUrl = function(){
		checkLocation = $location.path();
		if(checkLocation!="Home"){
			 $rootScope.cache = true;
		 	 window.history.back();
		}
		else{
			navigator.app.exitApp();
		}
	}
	$scope.goURL = function(url){

		if(url!=""){
			$location.path("/"+url);
		}

	}
	$scope.closeModal = function(){
				$(".overlay").hide();
				$(".modal").hide();
				$("input").blur();
				return false;
	}
		$scope.menuSwipeLeft = function(){
			  $('#nav-top .control a.prev').trigger("touchstart");
		}
		$scope.menuSwipeRight = function(){
			 $('#nav-top .control a.next').trigger("touchstart");
		}
	$scope.processResultPost = function(data,message,urlReturn){
		if(data.Message==true){

			$rootScope.success = {
				result : true,
				message : message,
				title:$rootScope.lang.general.successful,
				callBack : function() {
					$rootScope.success = {
						result : false,
						message : "",
					}
					if(urlReturn){
						$location.path("/"+urlReturn);
					}
					else{

						$route.reload();
					}
				}
			}
		}
		else {

			$rootScope.error = {
				result : true,
				message : data.MessageInfo,
			}
		}
	}

	$scope.resetError = function() {
						$rootScope.error = {
							result : false,
							message : ""
						};
						$rootScope.errorNetwork = {
							result : false,
							message : ""
						};
						return false;
					}
	$scope.checkNotEntitled = function(item){

		if(item.dis==true){
			title = item.title;
			title = title.replace("<br>","");
			window.plugins.toast.showShortBottom($rootScope.lang.general.not_entitled_to + " " + title);
		}
		else{
				link = item.link.replace("#","/");
				$location.path(link);
		}
	}

	viewFile = function(fileName){
		if(fileName!=null && fileName!=""){
			 $(".overlay").show();
			 $(".loading").show();
			url = $rootScope.GATEWAYURL+"api/uploadfile/getfile?FileName=";
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
				folder =fileSystem.root.nativeURL+"Download/";
				var fileTransfer = new FileTransfer();

				fileTransfer.download(url+fileName,folder + fileName,
					function(entry) {
						 $(".overlay").hide();
						 $(".loading").hide();
						if(device.platform=="Android")
							ref = cordova.InAppBrowser.open(encodeURI(folder + fileName) , '_system', 'location=yes'); //  android
						else
							ref = window.open(encodeURI(folder + fileName) ,'_blank','location=no,EnableViewPortScale=yes');
					},function(error){
						console.log(error);
						$(".overlay").hide();
						$(".loading").hide();
					})
				})




					}
	}
	$scope.viewFile = function(fileName){
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
				viewFile(fileName);
			}
		})
	}
	else{
		viewFile(fileName);
	}
	}



	$scope.InputFocusing = function(input) {
		$scope.selectInput = input;
	}
	$scope.setModel = function(arg){
		$scope[arg.key] = arg.value;
	}

	$scope.insertAtCaret = function(text) {
    var txtarea = document.getElementById($scope.selectInput);


    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
        "ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") {
       // txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);
	var temp =  txtarea.value;
    var back = (txtarea.value).substring(strPos,txtarea.value.length);
    value=front+text+back;
		absValue = Math.abs(value);
		firstChar = value.charAt(0);
		if( $.isNumeric(absValue) || ((firstChar=="." || firstChar=="-") && value.length==1)){
			txtarea.value = value;
		}
		else{
			txtarea.value = temp;
		}
    $scope[$scope.selectInput] = txtarea.value;

    strPos = strPos + text.length;
    if (br == "ie") {
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }
    else if (br == "ff") {
       txtarea.selectionStart = strPos;
       txtarea.selectionEnd = strPos;
	   txtarea.focus();
    }



}



})

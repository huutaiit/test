App.service('DateTimeService',["$rootScope", function($rootScope) {
    this.selectDate = {
		fullDate:"",
        day: "",
        month: "",
        year: "",
        hour: "",
        minute: "",
        second: "",
		millisecond:"",
        weekday: "",

    };

	this.parseDate = function(str) {
	  if(!str)
	    return null;
			var mdy = str.split('/')
			return new Date(mdy[2], mdy[1] - 1, mdy[0]);
	}


	this.parseDateAndTime = function(str) {
		var date = str.split(' ');
		var dmy = date[0].split('/');
		var hm = date[1].split(':');
		return new Date(dmy[2], dmy[1] - 1, dmy[0],hm[0],hm[1]);
	}


	this.daydiff = function(first, second) {

		return (second - first) / (1000 * 60 * 60 * 24) + 1;
	}

	this.timeDiff = function(first, second) {

		firstTime = new Date(2015,09,17,first[0],first[1],0,0);
		secondTime = new Date(2015,09,17,second[0],second[1],0,0);
		result =  (secondTime - firstTime) / (1000 * 60 * 60 );

		return result;
	}


	this.checkSunAndSat = function(date) {
		var weekday = this.dateFormat(date, "weekday");
		if (weekday == "Sun" || weekday == "Sunday"
				|| weekday == "Sat"
				|| weekday == "Saturday")
			return true;
			return false;


	}

	this.exceptSunAndSat = function(fromDate, toDate) {

		if(fromDate==null || fromDate=='' || toDate==null || toDate=='')
			return 0;
		var diff = this.daydiff(fromDate, toDate);
		var temp = 0;
		for (var i = 0; i < diff; i++) {
			var weekday = dateFormat(fromDate, "weekday");
			if (weekday == "Sun" || weekday == "Sunday"
					|| weekday == "Sat"
					|| weekday == "Saturday") {
				temp++;
			}

			fromDate = fromDate.setDate(fromDate.getDate() + 1);
			fromDate = new Date(fromDate);

		}

		result = diff - temp;
		return result;

	}

	this.parseMilliSecondToUTC = function(date){
		var currentDate = date;
		var currentTime = currentDate.getTime();
		var localOffset = (-1) * date.getTimezoneOffset() * 60000;
		var stamp = Math.round(new Date(currentTime + localOffset).getTime() / 1000);
		return stamp;
	}

	this.resetInternationalizationStrings = function(){
		// Internationalization strings
this.dateFormat.i18n = {
    dayNames: [
		$rootScope.lang.calendar.week.w_1, $rootScope.lang.calendar.week.w_2, $rootScope.lang.calendar.week.w_3, $rootScope.lang.calendar.week.w_4, $rootScope.lang.calendar.week.w_5, $rootScope.lang.calendar.week.w_6, $rootScope.lang.calendar.week.w_7,
		$rootScope.lang.calendar.week_full.w_0, $rootScope.lang.calendar.week_full.w_1, $rootScope.lang.calendar.week_full.w_2, $rootScope.lang.calendar.week_full.w_3, $rootScope.lang.calendar.week_full.w_4, $rootScope.lang.calendar.week_full.w_5, $rootScope.lang.calendar.week_full.w_6
	],
    monthNames: [
		$rootScope.lang.calendar.month.m_1, $rootScope.lang.calendar.month.m_2, $rootScope.lang.calendar.month.m_3, $rootScope.lang.calendar.month.m_4, $rootScope.lang.calendar.month.m_5, $rootScope.lang.calendar.month.m_6, $rootScope.lang.calendar.month.m_7, $rootScope.lang.calendar.month.m_8, $rootScope.lang.calendar.month.m_9, $rootScope.lang.calendar.month.m_10, $rootScope.lang.calendar.month.m_11, $rootScope.lang.calendar.month.m_12,
		$rootScope.lang.calendar.month.m_1, $rootScope.lang.calendar.month.m_2,$rootScope.lang.calendar.month.m_3, $rootScope.lang.calendar.month.m_4, $rootScope.lang.calendar.month.m_5, $rootScope.lang.calendar.month.m_6, $rootScope.lang.calendar.month.m_7, $rootScope.lang.calendar.month.m_8, $rootScope.lang.calendar.month.m_9, $rootScope.lang.calendar.month.m_10, $rootScope.lang.calendar.month.m_11, $rootScope.lang.calendar.month.m_12
	]
};
	}
this.dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = this.dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
this.dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
	shortDate2: "mmm,dd,yyyy",
	shortMonth: "mmm",
    mediumDate1: "mm/dd/yyyy h:MM:ss TT",//"mmm d, yyyy",
    mediumDate2: "yyyy/mm/dd h:MM:ss TT",//"mmm d, yyyy",
    mediumDate3: "dd/mm/yyyy",
	mediumDate4: "dd/mm/yyyy HH:MM",
    mediumDate: "dd/mm/yyyy h:MM:ss TT",//"mmm d, yyyy",
    longDate: "d mmmm yyyy (ddd)",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    shortTime2: "HH:MM",
	shortTime3: "HHMM",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
    day: "dd",
    month: "mm",
    year: "yyyy",
    hour: "HH",
    minute: "MM",
    second: "ss",
    weekday: "ddd",
	tt: "tt"
};

this.resetInternationalizationStrings();


// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

}]);
App.service('ProcessService', function( $http,$timeout,$q,$location,$rootScope) {

  this.getHTML = function (url) {
    return $http({
      url:url,
      method: "GET",
      timeout:60000,
      headers: {'Content-Type': 'application/html; charset=utf-8'}
    })
      .success(function(result) {
        return result;
      })
  }
	this.ajaxPost = function(url,param){

			$(".loading").css({"display":"table"});
			 $(".overlay-load").show();

			return $http({
				url: $rootScope.GATEWAYURL+"api/"+url,
				method: "POST",
				data :  param ,
				timeout:60000,
        withCredentials:true,
				headers: {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Credentials':true,withCredentials:true}
			})
			.success(function(result) {
				 $(".loading").css({"display":"none"});
				 $(".overlay-load").hide();
				data = JSON.parse(result);
				if(data!=null){
					if(typeof(data.MessageCode) !== 'undefined'){
						$location.path("/Login");
						return false;
					}
				}
				return result;
			})
			.error(function(result, status,headers) {
        $(".loading").css({"display":"none"});
        $(".overlay-load").hide();
        if(!navigator.onLine){
          $rootScope.errorNetwork = {
              result : true,
              message :$rootScope.lang.general.please_check_your_network
          };
          return false;
        }

				$rootScope.errorNetwork = {
						result : true,
						message :"Connection Error"
				};
				$timeout(function(){
					$location.path("/Home");
				},3000);

			  return result;
			});



    }



  this.ajaxPost2 = function(url,param){


    return $http({
      url: $rootScope.GATEWAYURL+"api/"+url,
      method: "POST",
      data :  param ,
      timeout:300000,
      headers: {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Credentials':true},
      credentials: "same-origin",
    })
      .success(function(result) {
        data = JSON.parse(result);
        return result;
      })
      .error(function(result, status,headers) {
        return result;
      });
  }



		this.ajaxGet = function(url){

				$(".loading").css({"display":"table"});
				 $(".overlay-load").show();
				return $http({
					url: $rootScope.GATEWAYURL+"api/"+url,
					method: "GET",
					timeout: 60000,
          withCredentials:true,
          headers: {'Content-Type': 'application/json; charset=utf-8','Access-Control-Allow-Credentials':true,withCredentials:true},
          credentials: "same-origin",
				})
				.success(function(result) {
					 $(".loading").css({"display":"none"});
					 $(".overlay-load").hide();
					data = JSON.parse(result);

					if(data!=null){
						if(typeof(data.MessageCode) !== 'undefined'){
							$location.path("/Login");
							return false;
						}
					}
					return result;
				})
				.error(function(result, status) {
					 $(".loading").css({"display":"none"});
					 $(".overlay-load").hide();
           if(!navigator.onLine){
   					$rootScope.errorNetwork = {
   						result : true,
   						message :$rootScope.lang.general.please_check_your_network
   					};
   					return false;
   				}
					$rootScope.errorNetwork = {
						result : true,
						message :"Connection Error"
					};
					$timeout(function(){
						$location.path("/Home");
					},3000);
				  return result;
				});



    }

	this.ajaxGetLocalSite = function(url){

		return $http({
			url: url,
			headers: { 'Cache-Control' : 'no-cache' } ,
			method: "GET",
		})
		.success(function(result) {
			return result;
		})
		.error(function(result, status) {
          return result;
        });


    }

	this.ajaxPostLocalSite = function(url,param){

		return $http({
			url: url,
			data :  param ,
			method: "POST",
		})
		.success(function(result) {
			data = JSON.parse(result);
			if(data!=null){
				if(data.Result == false){
					$location.path("/Login");
					return false;
				}
			}
			return result;
		})
		.error(function(result, status) {
          return result;
        });
    }



	this.notify = function(type,text,position){
		//type:error,success,warning,info
		position = position? position :"toast-bottom-right";
		toastr.options = {
					"closeButton": false,
					"debug": false,
					"newestOnTop": false,
					"progressBar": false,
					"positionClass": position,
					"preventDuplicates": false,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "5000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut"
            };

			toastr[type](text);

	}
	function detectVerticalSquash(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
}

/**
 * A replacement for context.drawImage
 * (args are for source and destination).
 */
function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
 // Works only if whole image is displayed:
 // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
 // The following works correct also when only a part of the image is displayed:
    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                       sw * vertSquashRatio, sh * vertSquashRatio,
                       dx, dy, dw, dh );
}
	this.resizeImage = function (longSideMax, url, callback) {


		  var tempImg = new Image();
		  tempImg.src = url;
		  tempImg.onload = function() {
			// Get image size and aspect ratio.
			var targetWidth = tempImg.width;
			var targetHeight = tempImg.height;
			if(device.platform=="iOS"){
				withWindow = $( window ).width();
				if(targetWidth > withWindow){
					percent = withWindow/targetWidth;
					targetWidth = withWindow;
					targetHeight = percent * tempImg.height;
				}
			}
			var aspect = tempImg.width / tempImg.height;

			// Calculate shorter side length, keeping aspect ratio on image.
			// If source image size is less than given longSideMax, then it need to be
			// considered instead.
			if (tempImg.width > tempImg.height) {
			  longSideMax = Math.min(tempImg.width, longSideMax);
			  targetWidth = longSideMax;
			  targetHeight = longSideMax / aspect;
			}
			else {
			  longSideMax = Math.min(tempImg.height, longSideMax);
			  targetHeight = longSideMax;
			  targetWidth = longSideMax * aspect;
			}

			if(targetHeight * targetWidth > 16777216){
				targetHeight = targetHeight/2;
				targetWidth = targetWidth/2;
			}

			// Create canvas of required size.
			var canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;

			var ctx = canvas.getContext("2d");
			// Take image from top left corner to bottom right corner and draw the image
			// on canvas to completely fill into.

			ctx.drawImage(this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetHeight);

			if(device.version=="8.1"){
				drawImageIOSFix(ctx, this, 0, 0, tempImg.width, tempImg.height, 0, 0, targetWidth, targetWidth);
			}

			//var mpImg = new MegaPixImage(tempImg);
			//mpImg.render(tempImg, { maxWidth: 300, maxHeight: 300, quality: 0.5 });
			//mpImg.render(canvas, { width: tempImg.width, height:  tempImg.height });


			callback(canvas.toDataURL("image/jpeg"));
			//return false;
		  };
}



this.dowloadFile = function(fileData,fileName){
	 var deferred = $q.defer();
	var result = Array();
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
	folder =fileSystem.root.nativeURL+"Download/";

	var fileTransfer = new FileTransfer();
	fileTransfer.download(fileData,folder + fileName,function(entry) {
		result.status = true;
		result.data = entry;
		deferred.resolve(result);


	},function(error){

		result.status = false;
		result.data = error;
		deferred.reject(result)

	})
	})
	return deferred.promise;
}
this.createFolder = function(folderName){
	var deferred = $q.defer();
	var result = Array();
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
	function(fileSystem){
		var entry=fileSystem.root;
		var options =  {create: false, exclusive: false};
		entry.getDirectory(folderName,options,
		function(dir){
			result.status = true;
			result.data = dir;
			deferred.resolve(result)

		}, function(error){
			options.create = true;
			entry.getDirectory(folderName,options,function(dir){
			result.status = true;
			result.data = dir;
			deferred.resolve(result)
		});
		});
	}, null);
	return deferred.promise;
}

this.checkPermission = function(type){

  	var deferred = $q.defer();
    var permissions = cordova.plugins.permissions;
    var result = Array();
  //  permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null);
        permissions.requestPermission(permissions[type],function(status) {

            if(!status.hasPermission) {
              result.status = false;
              deferred.resolve(result);
              console.warn('Camera permission is not turned on');
            }
            else{
              result.status = true;
              deferred.resolve(result);
              //result.message = '';
            }
    });

    return deferred.promise;
}

this.cameraPhoto = function(options) {
	var deferred = $q.defer();
	var result = Array();
	navigator.camera.getPicture(function(imageData){
			if (imageData.substring(0, 21) == "content://com.android") {
				photo_split = imageData.split("%3A");
				imageURI = "content://media/external/images/media/"+ photo_split[1];
			}
			else{
				imageURI  = imageData;
			}

				window.resolveLocalFileSystemURL(imageURI,function(fileEntry) {
					result.data = fileEntry.nativeURL;
					result.status = true;
					console.log(fileEntry);
					deferred.resolve(result);
				})
		}
		,function (message) {
			result.status = false;
			result.data = message;
			console.log(message);
			deferred.resolve(result)
		},
		options);

	return deferred.promise;
}
this.moveFile = function(fileUri,newFileName,newFileUri) {

	// ways 1


	var deferred = $q.defer();
	var result = Array();
	oldFileUri  = fileUri;
    fileExt     = "." + oldFileUri.split('.').pop();
    newFileName +=   fileExt;
	var fileTransfer = new FileTransfer();
	fileTransfer.download(fileUri,newFileUri+newFileName,function(entry) {
		result.status = true;
		result.data = entry;
		deferred.resolve(result);
		console.log(result);

	},function(error){
		result.status = false;
		result.data = error;
		deferred.reject(result);
		console.log(result);
	})

	// ways 2 wrong because can not override
  /*window.resolveLocalFileSystemURL(fileUri, function(fileEntry){

                oldFileUri  = fileUri;
                fileExt     = "." + oldFileUri.split('.').pop();
                newFileName +=   fileExt;
				//move the file to a new directory and rename it

                window.resolveLocalFileSystemURL(newFileUri,function(dirEntry) {

                            fileEntry.moveTo(dirEntry, newFileName, function(fileInfo){
								result.status = true;
								result.data = fileInfo;
								 console.log("File moveTo!");
								deferred.resolve(result)
							},function(error){
								result.status = false;
								result.data = error;
								deferred.resolve(result);
							});
                        },function(error){
							result.status = false;
							result.data = error;
							 console.log(error);
							deferred.resolve(result)
						});
          },
          function(error){
			 result.status = false;
			 result.data = error;
			 deferred.resolve(result)
		  });*/
		  return deferred.promise;
}
this.postImageToServer = function(fileName,number,imageData,type){

	 	var deferred = $q.defer();
		var ft = new FileTransfer();
		var result = Array();
		result.number = number;
		var options = new FileUploadOptions();
		options.fileKey = "fileUpload";
		options.fileName = fileName;
  if(type!=null){
    options.params = {
      type:type
    }
  }

		options.headers= {
		Connection: "close" // very important
		};
		options.chunkedMode = false;

			ft.upload(imageData,$rootScope.GATEWAYURL+"api/uploadfile/uploadfile",function(r) {

				var data = JSON.parse(r.response);
				data = JSON.parse(data);
				result.status = true;
				result.data  = data;
				deferred.resolve(result)

				}
				,
				function (error) {

				result.status = false;
				result.data = error
				deferred.reject(result);
				},
			options);
			return deferred.promise;
	 }


	 this.getGeoLocation = function(){
			var deferred = $q.defer();
			var result = Array();
			var options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: false };
			var getCurrentPosition = {};
			navigator.geolocation.getCurrentPosition(function(position){
				result.status = true;
				result.position = position.coords;
				deferred.resolve(result);
			},
			function(error){
				result.status = false;
				result.data = error;
				deferred.reject(result);
			},options);
			return deferred.promise;
	}

})

App.service('PoupService',['$compile','$templateRequest', function($compile,$templateRequest) {
	this.showPoup = function(templateName,scope){
		 $templateRequest("templates/partials/"+templateName+".html").then(function(html){
			  var template = angular.element(html);
			  $("#wrapper").append(template);
			   $(".poup-search").addClass(device.platform);
			  $compile(template)(scope);
			  $(".poup-search").height($(window).height());
			  $(".poup-search .content").height($(window).height()-60);

			  setTimeout(function(){
				$("#main").css({"display": "none"});
				//$( ".poup-search input").focus();
				//cordova.plugins.Keyboard.show();
			  },1000);

  		});
	}

	this.closePoup = function(){
		cordova.plugins.Keyboard.close();
		 $( ".poup-search" ).remove();
		 $("#main").css({"display": "block"});

	}

}])



App.service('UploadService',["$rootScope","ProcessService", function($rootScope,ProcessService) {



 this.uploadPhoto = function(imageURI,number,type) {
							// fix android 4.4 or higher

							if (imageURI.substring(0, 21) == "content://com.android") {
								var photo_split = imageURI.split("%3A");
								imageURI = "content://media/external/images/media/"+ photo_split[1];

							}


							 $("body").append('<div id='+number+'><div style="width: 100%;height: 100%;position: fixed;opacity: 0.3;z-index: 1;top: 0;display:block;background: #000;"></div></div>');
							 $(".loading").show();

							window.resolveLocalFileSystemURL(
											imageURI,
											function(fileEntry) {


												fileEntry.file(function(file) {
														var generalResource = JSON.parse(sessionStorage.getItem('GeneralResource'));
														size = file.size/1024;
														var fileName = fileEntry.nativeURL.substr(fileEntry.nativeURL.lastIndexOf('/') + 1);
														if(device.platform=="Android"){
														if(size>generalResource.FileLenght){
																$rootScope.$apply(function() {
																$rootScope.error = {
																	result : true,
																	message :fileName+" "+$rootScope.lang.general.maximum
																};

															})
															$("#"+number).remove();
												 			$(".loading").hide();
															return false;
															}

															ProcessService.postImageToServer(fileName,number,imageURI,type).then(function(response){
																$("#"+response.number).remove();
												 				$(".loading").hide();
																if(response.status==true){

																			if(response.data.FileName!=""){

																					$rootScope.listFileAttached.push(response.data.FileName);
																			}
																			else{

																				$rootScope.error = {
																					result : true,
																					message :response.data.MessageInfo
																				}

																			}
																}
															});


														}
														// ios resize images
														else{
														//ProcessService.resizeImage(size,imageURI,function(result){
																//	ProcessService.dowloadFile(result,fileName).then(function(response) {
																	//response.data.name
																	//response.data.nativeURL
																		ProcessService.postImageToServer(fileName,number,imageURI,type).then(function(response2){
																			$("#"+response2.number).remove();
												 							$(".loading").hide();
																			if(response2.status==true){

																				if(response2.data.FileName!=""){

																						$rootScope.listFileAttached.push(response2.data.FileName);

																				}
																				else{

																						$rootScope.error = {
																							result : true,
																							message :response2.data.MessageInfo
																						}

																				}
																			}
																			});
																//	})
																//})
																return false;
																}




											  })
											}, function() {

												$("#"+number).remove();
												 $(".overlay").hide();
												// error
											});
						}



	}])

App.service('FileService',["ProcessService","UploadService","$rootScope", function(ProcessService,UploadService,$rootScope) {
	$rootScope.listFileAttached = [];
	document.addEventListener("deviceready", onDeviceReady,
								false);

						// device APIs are available
						//
						function onDeviceReady() {
							pictureSource = navigator.camera.PictureSourceType;
							destinationType = navigator.camera.DestinationType;

						}

						function onPhotoDataSuccess(imageData) {
							console.log(imageData);
							UploadService.uploadPhoto(imageData,0,$rootScope.moduleName)

						}

						function onFail(message) {
							//alert('Failed because: ' + message);
							$rootScope.$apply(function() {
							$rootScope.error = {
							result : true,
							message :'Failed.' + message
						};
							})
						}
						this.capturePhoto = function(type) {
						  $rootScope.moduleName = type;
							if($rootScope.listFileAttached.length==3){
								$rootScope.error = {
								result : true,
								message :"Attached list exceeds limit"
								}
								return false;
							}
							navigator.camera.getPicture(onPhotoDataSuccess,onFail,{
								quality : 100,
								 targetWidth: 750,
  								targetHeight: 920,
								correctOrientation: true,
								destinationType : destinationType.FILE_URI
							});

						}

						this.getPhoto = function() {
							if($rootScope.listFileAttached.length==3){
								$rootScope.error = {
								result : true,
								message :"Attached list exceeds limit"
							}
								return false;
							}

							navigator.camera.getPicture(onPhotoDataSuccess,onFail,{
								quality : 100,
								correctOrientation: true,
								targetWidth: 750,
  								targetHeight: 920,
								destinationType : destinationType.FILE_URI,// DATA_URL
								sourceType : pictureSource.SAVEDPHOTOALBUM,
								mediaType : navigator.camera.MediaType.ALLMEDIA
							});
						}

						this.uploadPhoto = function(imageURI,number,type) {
							UploadService.uploadPhoto(imageURI,number,type);
						}



}])








App.filter('formatCurrency',
  ['$filter', '$locale',
  function (filter, locale) {

      return function (amount,decimal) {
        if(amount==0)
          return "0.00";
		     if(amount != '' && amount !=null){
		  		amount = parseFloat(amount);
          		return accounting.formatNumber(amount, decimal, ',', '.');
		  	}
			return null;

      };
  }]);



  App.filter('formatDate',['$filter', '$locale','DateTimeService',function (filter, locale,DateTimeService) {

      return function (date,type) {
          if(date != '' && date !=null)
          	return DateTimeService.dateFormat(date,type);
		  	return null;


      };
  }]);

    App.filter('formatTime', ['$filter', '$locale','DateTimeService',function (filter, locale,DateTimeService) {

      return function (time,type) {

          if(time != '')
          	return DateTimeService.dateFormat(time,type);
		  	return "00:00";


      };
  }]);

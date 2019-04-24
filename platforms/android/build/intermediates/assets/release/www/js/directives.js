
App.directive('ngElementReady', [function() {
        return {
            priority: -1000, // a low number so this directive loads after all other directives have loaded.
            restrict: "A", // attribute only
            link: function($scope, $element, $attributes) {

                $element.css({"visibility":"visible"});
                // do what you want here.
            }
        };
    }]);
App.directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.css({"display":"table"});
						$(".overlay-load").show();
                    }else{
                        elm.css({"display":"none"});
						$(".overlay-load").hide();

                    }
                });
            }
        };

    }]);

App.directive('loadPartialView',   ['$templateRequest','$compile' ,function ($templateRequest,$compile)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
				var view = attrs.loadPartialView;
                 $templateRequest("templates/partials/"+view+".html").then(function(html){
					  var template = angular.element(html);
					  elm.append(template);
					  $compile(template)(scope);
  				 });
            }
        };

    }]);

 App.directive('onLongPress', function($timeout) {
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('touchstart', function(evt) {
				// Locally scoped variable that will keep track of the long press
				$scope.longPress = true;

				// We'll set a timeout for 600 ms for a long press
				$timeout(function() {
					if ($scope.longPress) {
						// If the touchend event hasn't fired,
						// apply the function given in on the element's on-long-press attribute
						$scope.$apply(function() {
							$scope.$eval($attrs.onLongPress)
						});
					}
				}, 600);
			});

			$elm.bind('touchend', function(evt) {
				// Prevent the onLongPress event from firing
				$scope.longPress = false;
				// If there is an on-touch-end function attached to this element, apply it
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	};
})

  App.directive('ripper', function () {
     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, elm, attrs){
			elm.rippler();
			scope.$watch(function(){
				elm.rippler();
			})
        }
    };
  })

 App.directive('myMaxlength', function() {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      var maxlength = Number(attrs.myMaxlength);
      function fromUser(text) {
          if (text.length > maxlength) {
            var transformedInput = text.substring(0, maxlength);
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
            return transformedInput;
          }
          return text;
      }
      ngModelCtrl.$parsers.push(fromUser);
    }
  };
});


  App.directive('ngIsNumeric', ['$rootScope' ,function($rootScope) {

     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
		scope: { someCtrlFn: '&callbackFn' },
        link: function (scope, elm, attrs,ngModel){
          function compareVersion (source, target) {
            if (source === target) return 0;
            if (source == null) return -1;
            if (target == null) return 1;
            var sArr = source.split('.');
            var tArr = target.split('.');
            if (sArr.length > tArr.length) tArr.push(0);
            if (sArr.length < tArr.length) sArr.push(0);
            var sStr = sArr.join();


            var tStr = tArr.join();
            if (sStr == tStr) return 0;
            if (sStr < tStr) return -1;
            if (sStr > tStr) return 1;
            return -1;
          };

			elm.on("focus",function(e){
				var _this = $(this);

				if(device.platform=="iOS"){
				  var version = device.version;
				setTimeout(function(){
						if($rootScope.keyboardHeight>0) {
              var keyboardHeight = compareVersion(version,'11')>=0?$rootScope.keyboardHeight-20:$rootScope.keyboardHeight;
						window.removeEventListener('native.keyboardshow',function(){});
						$("#point").show().animate({"bottom":+keyboardHeight+"px"},220);
					}
					},30)


				}

			})

				 window.addEventListener('native.keyboardshow', function(e){
						$rootScope.keyboardHeight = e.keyboardHeight;
				});



			elm.on('blur', function(e){
						$("#point").hide().animate({"bottom":+$rootScope.keyboardHeight+"px"},220);
						return false;
				});

			 temp = "";
			elm.on("input keyup change",function(e){

				value = $(this).val();
				maxValue = (attrs.maxValue !='') ? attrs.maxValue : 999999999.99;

				minValue = (attrs.minValue !='') ? attrs.minValue :0;
				if(value.indexOf(" ")>0){
					value = value.replace(/ /g, '');
					$(this).val(value);
				}
				if(value != ""){
          absValue = Math.abs(value);
          firstChar = value.charAt(0);
					if( $.isNumeric(absValue) || ((firstChar=="." || firstChar=="-") && value.length==1)){
						if(parseFloat(value) > parseFloat(maxValue)){
							value = maxValue;
							$(this).val(value);
						}
						if(parseFloat(value)<parseFloat(minValue)){
							value = minValue;
							$(this).val(value);
						}
						temp = value;
					}
					else{
						$(this).val(temp);
					}
				}
				else{
					temp = "";
				}
				arg = {key:attrs.id,value:value};
				scope.someCtrlFn({arg:arg});

			})



        }
    };
  }])

    App.directive('modal', function () {
     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope,element, attr) {
			element.on("click",function(){
        $(".modal").hide();
				 if(attr.modal=="") return false;
				  var _this = $("#" + attr.modal);
				//$(".scroll").css({"overflow":"visible"});
				$(window).off("resize");
					$(".overlay").show();
			    _this.removeClass("zoomOut");
				 _this.addClass("zoomIn");
				 _this.show();
			    _this.css({ left: ($(window).width() - _this.width()) / 2, top: ($(window).height() - _this.height()) / 2 });
				input = _this.find("input")
				$(document).on('focus',input, function () {
					$("body").css({"position":"fixed"});
				});

				$(window).resize(function () {

					var top =  ($(window).height() - _this.height()) / 2;
					var left = ($(window).width() - _this.width()) / 2;
			    	_this.css({ left:left , top:  top});


				});

				return false;

			})



        }
    };
  })

    App.directive('modal2', function ($timeout) {
     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope,element, attr) {

					 element.click(function(){
					 var _this = $("#" + attr.modal2);
					_this.removeClass("zoomOut");
				 	_this.addClass("zoomIn");
				 	_this.show();
					$(".overlay2").show();
			    	_this.css({ left: ($(window).width() - _this.width()) / 2, top: ($(window).height() - _this.height()) / 2 					});



				})

        }
    };
  })

    App.directive('ngShowModalError', function () {
        return {
            restrict: 'A',   // 'A' is the default, so you could remove this line
            link: function (scope, elm, attrs) {
                scope.$watch(function () { // khi gia tri thay doi thi ham nay se duoc goi
                    if (attrs.ngShowModalError == "true") {

                        $(".overlay-error").show();
                        elm.show();
                        elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 })
						$(window).resize(function () {

							elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 });
							return false;
						})
                    }
                    else {

                        $(".overlay-error").hide();
                        elm.hide()
                    }
                })



            }
        };
    })


App.directive('ngShowModalConfirm', function () {
  return {
    restrict: 'A',   // 'A' is the default, so you could remove this line
    link: function (scope, elm, attrs) {
      scope.$watch(function () { // khi gia tri thay doi thi ham nay se duoc goi
        if (attrs.ngShowModalConfirm == "true") {
          $(".overlay-error-confirm").show();
          elm.show();
          elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 })
          $(window).resize(function () {

            elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 });
            return false;
          })
        }
        else {

          $(".overlay-error-confirm").hide();
          elm.hide()
        }
      })



    }
  };
})

	App.directive('ngShowModalErrorNetwork', function () {
        return {
            restrict: 'A',   // 'A' is the default, so you could remove this line
            link: function (scope, elm, attrs) {
                  scope.$watch(function () {
                    if (attrs.ngShowModalErrorNetwork == "true") {

                        $(".overlay-error-network").show();
                        elm.show();
                        elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 })
						$(window).resize(function () {

							elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 });
							return false;
						})
                    }
                    else {

                        $(".overlay-error-network").hide();
                        elm.hide()
                    }

				  })


            }
        };
    })


    App.directive('ngShowModalSuccess', function () {
        return {
            restrict: 'A',   // 'A' is the default, so you could remove this line
            link: function (scope, elm, attrs) {
                scope.$watch(function () { // khi gia tri thay doi thi ham nay se duoc goi
                    if (attrs.ngShowModalSuccess == "true") {
                        $(".overlay-success").show();
                        elm.show();
                        elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 })
						$(window).resize(function () {

							elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 });
							return false;
						})
                    }
                    else {

                        $(".overlay-success").hide();
                        elm.hide()
                    }
                })



            }
        };
    })

   App.directive('closeModal', function () {
     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, elm, attrs){
            elm.on("click", function (event) {
				event.stopPropagation();
				event.preventDefault();
				//$(".scroll").css({"overflow":"auto"});
				$(".overlay").hide();
				$(".modal").removeClass("zoomIn");
				$(".modal").addClass("zoomOut");
				setTimeout(function(){
					$(".modal").hide();
				},500);
				//
				$("input").blur();
				return false;

			})


        }
    };
  })


     App.directive('closeModal2', function () {
     return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        link: function (scope, elm, attrs){
            elm.on("click", function (event) {
				event.stopPropagation();
				event.preventDefault();
				//$(".scroll").css({"overflow":"auto"});
				$(".overlay2").hide();
				$(".modal2").removeClass("zoomIn");
				$(".modal2").addClass("zoomOut");
				setTimeout(function(){
					$(".modal2").hide();
				},500);
				$("input").blur();
				return false;

			})


        }
    };
  })


  App.directive('onTap', function($timeout) {
return {
restrict: 'A',
link: function($scope, $elm, $attrs) {
$elm.bind('touchend', function(evt) {
// Prevent the onLongPress event from firing
$scope.longPress = false;
// If there is an on-touch-end function attached to this element, apply it
if ($attrs.onTap) {
$scope.$apply(function() {
$scope.$eval($attrs.onTap)
});
}
});
}
};
});




    App.directive('ulAnimation', function () {
		 return {
        restrict: 'A',   // 'A' is the default, so you could remove this line
        compile: function (element,attr) {
			element.find("li").hide();
			var id = "."+attr.class+" li";
			var i = 1;
		   $(id).each(function(){
			   i++;
			   var t = $(this);
			   setTimeout(function(){ t.show().addClass('slideInRight'); }, (i+1) * 150);

		  })

        }
    };

});

    App.directive('ngSetHeightMain', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
               // if (scope.$last === true) {
                    $timeout(function () {
                        heightHeader = $("header").innerHeight();
                        heightNav = $("#quick-link").innerHeight();
                       heightWindow = attr.ngSetHeightMain;
                        $("#main").height(heightWindow- heightHeader - heightNav-10);


                    });
                //}
            }
        }
    });


	  App.directive('ngSetHeightDiv', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
               // if (scope.$last === true) {
                    $timeout(function () {
						heightHeader = $("header").innerHeight();
                    	parentHeight = element.parent().actual( 'innerHeight');
                     	element.height(parentHeight-heightHeader);
                    });
                //}
            }
        }
    });



    App.directive('ngElementHeight',['$http',function ($http){
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
              $(window).off('resize');

				 scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

				bodyHeight = $("body").height();
				heightHeader = $("header").actual("innerHeight");
				heightbtn =  $(".button").actual("innerHeight");
				element.height(bodyHeight-heightHeader-85-50-47);

                scope.$watchGroup([scope.isLoading,"lang"],function (v) {

						parentHeight = element.parent().actual( 'innerHeight');
						heightbtn =  $( element.parent().find(".button")).actual("innerHeight");
						titleFrom = $(".title-form").actual('innerHeight');
						dateControl = $("#date-control").actual('innerHeight');// only have screen apply claim overTime
						element.height(parentHeight - titleFrom-heightbtn-dateControl);





                })

            }
        }
    }]);





	 App.directive('ngHeightScreenMain', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {



						var headerHeight = $("#header-index").innerHeight();
              var windowHeight = $(window).innerHeight();
						element.height(	windowHeight - headerHeight);
						$(window).off("resize");
						$(window).resize(function(){
							headerHeight = $("#header-index").innerHeight();
							windowHeight = $(window).innerHeight();
							element.height(	windowHeight - headerHeight);
						})



            }
        }
    });

	 App.directive('ngSetHeightModalContent', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                scope.$watch(attr.id,function () {
                  var  heightWindow = $( window ).height();
					heightWindow = heightWindow*90/100;
					heightWindow = heightWindow-$(".modal-title").actual('innerHeight');
					var heightLi = element.find("ul li").actual( 'innerHeight' )+1;

					var heightElement = (attr.ngSetHeightModalContent*heightLi);
					if(heightElement>heightWindow){
						var height = heightWindow;
					}
					else{
						var height = heightElement;
					}
					 element.height(height);

                })

            }
        }
    });

	 App.directive('ngSetHeightClaimItem', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attr) {
            	var divParent =  element.parent();
				heightdivParent = divParent.height();

				windowHeight = $(window).height();
                scope.$watchCollection(["field","claimNumber"],function () {


					heightWindow = windowHeight*90/100;
					setTimeout(function(){
						heightElement = element.find("ul").height();
					heightElement = heightElement==0?null:heightElement;


					if(heightElement>heightWindow){
						height = heightWindow-$(".modal-title").innerHeight()-30;

					}
					else{
						height = heightElement;
					}

                    element.height(height);
					var heightParent = height+$(".modal-title").innerHeight()+30;

					divParent.css({ left: ($(window).width() - divParent.width()) / 2, top: (windowHeight - heightParent) / 2 });
					},1)


                })



            }
        }
    });

	 App.directive('ngHeightEqualWidth', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var getWidthHeight = function () {
                  element.height(element.innerWidth());

                  var parent = element.parent();
                  if(parent.attr("class")=="quick-link-2"){
                    var heightUiBlockA = $(".ui-block-a").innerHeight();
                    var heightQuickLink2Li = $(".quick-link-2").height();
                    var heightMyclaim = $("#main_navigation .ui-block-b .mytms").height();
                    var height = heightUiBlockA-heightQuickLink2Li-heightMyclaim-4;
                    $(".mypayroll").height(height);
                  }
                }
                scope.$watch(["quickLinks1","quickLinks2"],function () {
                  getWidthHeight();
                })
              $(window).resize(function () {
                getWidthHeight();
              })

            }
        }
    });


	 App.directive('ngInputFocus', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                element.on("focus",function(){
					$("#main").css({"position":"fixed"});



							setTimeout(function(){
								heightWindow = $rootScope.heightWindow-$rootScope.keyboardHeight;

								heightHeader = $("header").innerHeight();
								heightNav = $("#quick-link").innerHeight();
								$("#main").height(heightWindow - heightHeader - heightNav-10);
								$("#main").css({"position":"static"});
								parentHeight = $(".form").innerHeight();
								titleForm = $(".title-form").innerHeight();
								$("#form-change-pass").height(parentHeight-titleForm);

						 },500)


				})



            }
        }
    });


	 App.directive('setFullWidthMenu', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
				windowWidth = $(window).width();
             var width = windowWidth>=400?$("#nav-top").innerWidth(): 392;
                scope.$watch(function () {
                    element.width(width);
					   widthChild  = width-20;
					    if(windowWidth>=400){
							element.find("li div").width(widthChild/5);
						}

                })

            }
        }
    });

	 App.directive('setFullWidthMenu2', ['$rootScope' ,function ($rootScope){
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
				windowWidth = $(window).width();
             var width = windowWidth>=400 ? $("#nav-top").innerWidth(): 551;
			 element.parent().width(($("body").innerWidth()*0.98)-45);
                scope.$watch(function () {

					 if(windowWidth>=600){
						   widthChild  = width-20;
						   widthElement = width+(width/5*2)
						   element.width(widthElement);
						   element.find("li div").width(widthChild/5);
					 }




				 var $item = $('#nav-top li'), //Cache your DOM selector
				 widthItem = $item.innerWidth()+4;
					visible = 2, //Set the number of items that will be visible

					endIndex = ( $item.length / visible );
    $('#nav-top .control a').off("touchstart");
    $('#nav-top .control a.prev').on("touchstart",function(){

		$("#nav-top .wrap").scrollLeft($("#nav-top .wrap").find("ul").width());
        /*if( $rootScope.positionMenu < endIndex ){

			if($rootScope.noPrev >0)
				return false;
			position = $item.parent().position();
			left = Math.abs(position.left)

			pos1 = left+widthItem;
			pos2 = $item.parent().innerWidth()-$item.parent().parent().innerWidth();
			if(pos1 > pos2){
				$rootScope.noPrev =  pos1-pos2;
				temp = widthItem;
				widthItem -= $rootScope.noPrev;
				$rootScope.positionMenu++;
          		$item.parent().animate({'left':'-='+widthItem+'px'},200);
				widthItem = temp;

			}
			else{
         		$rootScope.positionMenu++;
          		$item.parent().animate({'left':'-='+widthItem+'px'},200);
		  }
        }*/
    });

    $('#nav-top .control a.next').on("touchstart",function(){
		$("#nav-top .wrap").scrollLeft(0);
		/*
        if( $rootScope.positionMenu > 0){
			if($rootScope.positionMenu==1){
				temp = widthItem;
				widthItem-=$rootScope.noPrev;
				$rootScope.positionMenu--;
          	 	$item.parent().animate({'left':'+='+widthItem+'px'},200);
				widthItem = temp;
				$rootScope.noPrev = 0;

			}
			else{
         	 	$rootScope.positionMenu--;
          	 	$item.parent().animate({'left':'+='+widthItem+'px'},100);
			}

        }*/
    });




                })



            }
        }
    }]);

	 /*App.directive('setHeightMyPayrollHomeScreen', function () {
        return {
            restrict: 'A',
            link: function (scope,rootScope, element, attr) {

                scope.$watch(rootScope.quickLinks2,function () {

					var heightUiBlockA = $(".ui-block-a").innerHeight();
					var heightQuickLink2Li = $(".quick-link-2").height();

					var heightMyclaim = $("#main_navigation .ui-block-b .mytms").height();

					height = heightUiBlockA-heightQuickLink2Li-heightMyclaim-4;
					element.height(height);


                })

            }
        }
    });
  */


	App.directive('jMonthCalendar', [ '$location','$rootScope','$http', function ($location,$rootScope,$http) {
        return {
            restrict: "A",
			 replace: true,
			 scope: { ngEvents: '=ngEvents', someCtrlFn: '&callbackFn'}, //isolate the scope

            link: function(scope, elem, attrs, controller) {

			var ids = {
			container: "#"+attrs.id,
			head: "#CalendarHead",
			body: "#CalendarBody"
	};

	var _selectedDate;
	var _beginDate;
	var _endDate;
	var calendarEvents;
	var defaults = {
			height: 650,
			width: 980,
			navHeight: 25,
			labelHeight: 25,
			firstDayOfWeek: 0,
			calendarStartDate:sessionStorage.getItem('currentMonth')!=null ? new Date(sessionStorage.getItem('currentMonth')) : new Date(),
			dragableEvents: false,
			activeDroppableClass: false,
			hoverDroppableClass: false,
			navLinks: {
				enableToday: false,
				enableNextYear: false,
				enablePrevYear: false,
				p:'&lsaquo; Prev',
				n:'Next &rsaquo;',
				t:'Today'
			},
			onMonthChanging: function(dateIn) { return true; },
			onMonthChanged: function(dateIn) { return true; },
			onEventLinkClick: function(event) { return true; },
			onEventBlockClick: function(event) { return true; },
			onEventBlockOver: function(event) { return true; },
			onEventBlockOut: function(event) { return true; },
			onDayLinkClick: function(date) { return true; },
			onDayCellClick: function(date) { return true; },
			onDayCellDblClick: function(dateIn) { return true; },
			onEventDropped: function(event, newDate) { return true; },
			locale: {
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				daysShort: [$rootScope.lang.calendar.week.w_1, $rootScope.lang.calendar.week.w_2, $rootScope.lang.calendar.week.w_3, $rootScope.lang.calendar.week.w_4, $rootScope.lang.calendar.week.w_5, $rootScope.lang.calendar.week.w_6, $rootScope.lang.calendar.week.w_7, $rootScope.lang.calendar.week.w_1],
				daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
				months: [$rootScope.lang.calendar.month_full.m_1, $rootScope.lang.calendar.month_full.m_2, $rootScope.lang.calendar.month_full.m_3, $rootScope.lang.calendar.month_full.m_4, $rootScope.lang.calendar.month_full.m_5, $rootScope.lang.calendar.month_full.m_6, $rootScope.lang.calendar.month_full.m_7, $rootScope.lang.calendar.month_full.m_8,  $rootScope.lang.calendar.month_full.m_9,  $rootScope.lang.calendar.month_full.m_10,  $rootScope.lang.calendar.month_full.m_11,  $rootScope.lang.calendar.month_full.m_12],
				monthsShort: [$rootScope.lang.calendar.month.m_1, $rootScope.lang.calendar.month.m_2, $rootScope.lang.calendar.month.m_3, $rootScope.lang.calendar.month.m_4, $rootScope.lang.calendar.month.m_5, $rootScope.lang.calendar.month.m_6, $rootScope.lang.calendar.month.m_7, $rootScope.lang.calendar.month.m_8,  $rootScope.lang.calendar.month.m_9,  $rootScope.lang.calendar.month.m_10,  $rootScope.lang.calendar.month.m_11,  $rootScope.lang.calendar.month.m_12],
				weekMin: 'wk'
			}
		};

	var getDateFromId = function(dateIdString) {
		//c_01012009
		return new Date(dateIdString.substring(6, 10), dateIdString.substring(2, 4)-1, dateIdString.substring(4, 6));
	};
	var getDateId = function(date) {
		var month = ((date.getMonth()+1)<10) ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
		var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();
		return "c_" + month + day + date.getFullYear();
	};
	var GetJSONDate = function(jsonDateString) {
		//check conditions for different types of accepted dates
		var tDt, k;
		if (typeof jsonDateString == "string") {

			//  "2008-12-28T00:00:00.0000000"
			var isoRegPlus = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2}).([0-9]{7})$/;

			//  "2008-12-28T00:00:00"
			var isoReg = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})$/;

			//"2008-12-28"
			var yyyyMMdd = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/;

			//  "new Date(2009, 1, 1)"
			//  "new Date(1230444000000)
			var newReg = /^new/;

			//  "\/Date(1234418400000-0600)\/"
			var stdReg = /^\\\/Date\(([0-9]{13})-([0-9]{4})\)\\\/$/;

			if (k = jsonDateString.match(isoRegPlus)) {
				return new Date(k[1],k[2]-1,k[3]);
			} else if (k = jsonDateString.match(isoReg)) {
				return new Date(k[1],k[2]-1,k[3]);
			} else if (k = jsonDateString.match(yyyyMMdd)) {
				return new Date(k[1],k[2]-1,k[3]);
			}

			if (k = jsonDateString.match(stdReg)) {
				return new Date(k[1]);
			}

			if (k = jsonDateString.match(newReg)) {
				return eval('(' + jsonDateString + ')');
			}

			return tdt;
		}
	};
	jQuery.jMonthCalendar = jQuery.J = function() {};



	jQuery.J.DrawCalendar = function(dateIn){
		var today = defaults.calendarStartDate;

		var d;

		if(dateIn == undefined) {
			//start from this month
			d = new Date(today.getFullYear(), today.getMonth(), 1);
		} else {
			//start from the passed in date
			d = dateIn;
			d.setDate(1);
		}


		// Create Previous Month link for later




		var prevMonth = d.getMonth() == 0 ? new Date(d.getFullYear()-1, 11, 1) : new Date(d.getFullYear(), d.getMonth()-1, 1);
		var numPre = prevMonth.getMonth()+1;
		defaults.navLinks.p = $rootScope.lang.calendar.month["m_"+numPre];
		var prevMLink = jQuery('<div class="MonthNavPrev"><a href="" class="link-prev">'+ defaults.navLinks.p +'</a></div>').click(function() {
			sessionStorage.setItem('currentMonth', prevMonth);
			jQuery.J.ChangeMonth(prevMonth);
			scope.$apply(function(){
				scope.someCtrlFn({arg: prevMonth});
			})
			calendarEvents =  angular.copy(scope.ngEvents);
			//Load for the current month
			DrawEventsOnCalendar();
			return false;
		});


		//Create Next Month link for later
		var nextMonth = d.getMonth() == 11 ? new Date(d.getFullYear()+1, 0, 1) : new Date(d.getFullYear(), d.getMonth()+1, 1);
		var numNext = nextMonth.getMonth()+1;
		defaults.navLinks.n = $rootScope.lang.calendar.month["m_"+numNext];
		var nextMLink = jQuery('<div class="MonthNavNext"><a href="" class="link-next">'+ defaults.navLinks.n +'</a></div>').click(function() {
			sessionStorage.setItem('currentMonth', nextMonth);
			scope.$apply(function(){
				scope.someCtrlFn({arg: nextMonth});
			})
			jQuery.J.ChangeMonth(nextMonth);
			calendarEvents =  angular.copy(scope.ngEvents);
			//Load for the current month
			DrawEventsOnCalendar();
			return false;
		});

		//Create Previous Year link for later
		var prevYear = new Date(d.getFullYear()-1, d.getMonth(), d.getDate());
		var prevYLink;
		if(defaults.navLinks.enablePrevYear) {
			prevYLink = jQuery('<div class="YearNavPrev"><a href="">'+ prevYear.getFullYear() +'</a></div>').click(function() {
				jQuery.J.ChangeMonth(prevYear);
				return false;
			});
		}

		//Create Next Year link for later
		var nextYear = new Date(d.getFullYear()+1, d.getMonth(), d.getDate());
		var nextYLink;
		if(defaults.navLinks.enableNextYear) {
			nextYLink = jQuery('<div class="YearNavNext"><a href="">'+ nextYear.getFullYear() +'</a></div>').click(function() {
				jQuery.J.ChangeMonth(nextYear);
				return false;
			});
		}

		var todayLink;
		if(defaults.navLinks.enableToday) {
			//Create Today link for later
			todayLink = jQuery('<div class="TodayLink"><a href="" class="link-today">'+ defaults.navLinks.t +'</a></div>').click(function() {
				jQuery.J.ChangeMonth(new Date());
				return false;
			});
		}

		//Build up the Header first,  Navigation
		var navRow = jQuery('<tr><td colspan="7"><div class="FormHeader MonthNavigation"></div></td></tr>').css({ "height" : defaults.navHeight });
		var monthNavHead = jQuery('.MonthNavigation', navRow);

		monthNavHead.append(prevMLink, nextMLink);
		if(defaults.navLinks.enableToday) { monthNavHead.append(todayLink); }

		monthNavHead.append(jQuery('<div class="MonthName"></div>').append(defaults.locale.months[d.getMonth()] + " " + d.getFullYear()));

		if(defaults.navLinks.enableNextYear) { monthNavHead.append(nextYLink); }
		if(defaults.navLinks.enablePrevYear) { monthNavHead.append(prevYLink); }


		//  Days
		var headRow = jQuery("<tr></tr>").css({
			"height" : defaults.labelHeight
		});

		for (var i=defaults.firstDayOfWeek; i<defaults.firstDayOfWeek+7; i++) {
			var weekday = i%7;
			var wordday = defaults.locale.daysShort[weekday];
			headRow.append('<th title="' + wordday + '" class="DateHeader' + (weekday == 0 || weekday == 6 ? ' Weekend' : '') + '"><span>' + wordday + '</span></th>');
		}

		headRow = jQuery("<thead id=\"CalendarHead\"></thead>").append(headRow);
		headRow = headRow.prepend(navRow);


		//Build up the Body
		var tBody = jQuery('<tbody id="CalendarBody"></tbody>');
		var isCurrentMonth = (d.getMonth() == today.getMonth() && d.getFullYear() == today.getFullYear());
		var maxDays = Date.getDaysInMonth(d.getFullYear(), d.getMonth());


		//what is the currect day #
		var curDay = defaults.firstDayOfWeek - d.getDay();
		if (curDay > 0) curDay -= 7
		//alert(curDay);

		var t = (maxDays + Math.abs(curDay));

		_beginDate = new Date(d.getFullYear(), d.getMonth(), curDay+1);
		_endDate = new Date(d.getFullYear(), d.getMonth()+1, (7-(t %= 7)) == 7 ? 0 : (7-(t %= 7)));
		var _currentDate = new Date(_beginDate.getFullYear(), _beginDate.getMonth(), _beginDate.getDate());


		// Render calendar
		//<td class=\"DateBox\"><div class=\"DateLabel\"><a href=\"#\">" + val + "</a></div></td>";
		var rowCount = 0;
		var rowHeight = (defaults.height - defaults.labelHeight - defaults.navHeight) / Math.ceil((maxDays + Math.abs(curDay)) / 7);
		//alert("rowHeight=" + rowHeight);

		do {
	  		var thisRow = jQuery("<tr></tr>");
			thisRow.css({
				"height" : rowHeight + "px"
			});

			for (var i=0; i<7; i++) {
				var weekday = (defaults.firstDayOfWeek + i) % 7;
				var atts = {'class':"DateBox"+(weekday == 0 || weekday == 6 ? ' Weekend ' : ''),
							'date':_currentDate.toString("M/d/yyyy"),
							'id': getDateId(_currentDate)
				};

				if (curDay < 0 || curDay >= maxDays) {
					atts['class'] += ' Inactive';
				} else {
					d.setDate(curDay+1);
				}

				if (isCurrentMonth && curDay+1 == today.getDate()) {
					dayStr = curDay+1;
					atts['class'] += ' Today';
				}

				//DateBox Events
				var dateLink = jQuery('<div class="DateLabel" ><a>' + _currentDate.getDate() + '</a></div>').click(function(e) {

					if(attrs.dayLinkClick=="true" && !$(this).parent().hasClass("Inactive")){

                    	defaults.onDayLinkClick(new Date($(this).parent().attr("date")));
					}
					else{

						$(this).parent().find(".Event a").trigger("click");
					}

                    e.stopPropagation();
                });

				var dateBox = jQuery('<td></td>').attr(atts).append(dateLink).dblclick(function(e) {
                    defaults.onDayCellDblClick(new Date($(this).attr("date")));
                    e.stopPropagation();
                }).click(function(e) {
					defaults.onDayCellClick(new Date($(this).attr("date")));
                    e.stopPropagation();
				});

				if (defaults.dragableEvents) {
                    dateBox.droppable({
                        hoverClass: defaults.hoverDroppableClass,
                        activeClass: defaults.activeDroppableClass,
                        drop: function(e, ui) {
                            ui.draggable.attr("style", "position: relative; display: block;");
                            $(this).append(ui.draggable);
                            var event;
                            $.each(calendarEvents, function() {
                                if (this.EventID == ui.draggable.attr("id")) {
                                    event = this;
                                }
                            });

                            defaults.onEventDropped(event, $(this).attr("date"));
							return false;
                        }
                    });

                }

				thisRow.append(dateBox);

				curDay++;
				_currentDate.addDays(1);
			}

			rowCount++;
			tBody.append(thisRow);
		} while (curDay < maxDays);


		var a = jQuery(ids.container).css({ "width" : defaults.width + "px", "height" : defaults.height + "px" });
		var cal = jQuery('<table class="MonthlyCalendar" cellpadding="0" tablespacing="0"></table>').append(headRow, tBody);

		a.hide();
		a.html(cal);
		a.fadeIn("normal");

		DrawEventsOnCalendar();
	}
              jQuery('.refresh-calendar').click(function () {

                scope.$apply(function(){
                  scope.someCtrlFn({arg: 	sessionStorage.getItem("currentMonth")});
                  scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                  };

                  scope.$watch(scope.isLoading, function (v)
                  {
                    if(!v){
                      date = sessionStorage.getItem("currentMonth")!=null?new Date(sessionStorage.getItem("currentMonth")):new Date();
                      jQuery.J.ChangeMonth(date);
                      calendarEvents =  angular.copy(scope.ngEvents);
                      DrawEventsOnCalendar();
                      return false;
                    }
                  });
                })

                return false;
              })
	var DrawEventsOnCalendar = function() {


		if (calendarEvents && calendarEvents.length > 0) {
			var headHeight = defaults.labelHeight + defaults.navHeight;
			var dtLabelHeight = jQuery(".DateLabel:first", ids.container).outerHeight();


			jQuery.each(calendarEvents, function(){
				var ev = this;

				//Date Parse the JSON to create a new Date to work with here
				var sDt, eDt;

				if(ev.StartDateTime) {
					console.log(ev);
					if (typeof ev.StartDateTime == 'object' && ev.StartDateTime.getDate) { sDt = ev.StartDateTime; }
					if (typeof ev.StartDateTime == 'string' && ev.StartDateTime.split) { sDt = GetJSONDate(ev.StartDateTime); }
				} else if(ev.Date) { // DEPRECATED
					if (typeof ev.Date == 'object' && ev.Date.getDate) { sDt = ev.Date; }
					if (typeof ev.Date == 'string' && ev.Date.split) { sDt = GetJSONDate(ev.Date); }
				} else {
					return;  //no start date, or legacy date. no event.
				}

				if(ev.EndDateTime) {
					if (typeof ev.EndDateTime == 'object' && ev.EndDateTime.getDate) { eDt = ev.EndDateTime; }
					if (typeof ev.EndDateTime == 'string' && ev.EndDateTime.split) { eDt = GetJSONDate(ev.EndDateTime); }
				}


				//is the start date in range, put it on the calendar?
				//handle multi day range first


				if(sDt) {
					if ((sDt >= _beginDate) && (sDt <= _endDate)) {
						var cell = jQuery("#" + getDateId(sDt), jQuery(ids.container));
						var label = jQuery(".DateLabel", cell);

						var link = jQuery('<a>' + ev.Title + '</a>');
						link.click(function(e) {
						//	console.log(ev);

							defaults.onEventLinkClick(ev);
							return false;
							e.stopPropagation();
						});
						var event = jQuery('<div class="Event" id="Event_' + ev.EventID + '"></div>').append(link);


						if(ev.CssClass) { event.addClass(ev.CssClass) }
						event.click(function(e) {
							defaults.onEventBlockClick(ev);
							e.stopPropagation();
						});
						event.hover(function() { defaults.onEventBlockOver(ev); }, function() { defaults.onEventBlockOut(ev); })

						if (defaults.dragableEvents) {
							event.draggable({ containment: '#CalendarBody' });
						}

						event.hide();
						cell.append(event);
						event.fadeIn("normal");
					}
				}
			});
		}
	}

	var ClearEventsOnCalendar = function() {
		jQuery(".Event", jQuery(ids.container)).remove();
	}



	jQuery.J.AddEvents = function(eventCollection) {
		if(eventCollection) {
			if(eventCollection.length > 1) {
				jQuery.each(eventCollection, function() {
					calendarEvents.push(this);
				});
			} else {
				//add new single event to ed of array
				calendarEvents.push(eventCollection);
			}
			ClearEventsOnCalendar();
			DrawEventsOnCalendar();
		}
	}

	jQuery.J.ReplaceEventCollection = function(eventCollection) {
		if(eventCollection) {
			calendarEvents = eventCollection;
		}
	}

	jQuery.J.ChangeMonth = function(dateIn) {
		defaults.onMonthChanging(dateIn);
		jQuery.J.DrawCalendar(dateIn);
		defaults.onMonthChanged(dateIn);
	}

	jQuery.J.Initialize = function(options) {
		var today = new Date();

		options = jQuery.extend(defaults, options);

		jQuery.J.DrawCalendar();

		/*if(events)
		{
			calendarEvents = events;
			//Load for the current month
			DrawEventsOnCalendar();
		}*/
	};
	var options = {
				height: "auto",
				width: '100%',
				navHeight: 25,
				labelHeight: 25,
				onMonthChanging: function(dateIn) {

					return true;
				},

				onEventLinkClick: function(event) {
					//alert(event.Title + " - " + event.Description);

					if(typeof(attrs.ngHref) !='undefined'){

        					sessionStorage.setItem('calendarDetail', JSON.stringify(event));
							scope.$apply(function() { $location.path(attrs.ngHref);})
						}
					//return false;
				},
				onEventBlockClick: function(event) {
					//alert("block clicked");
					return true;
				},
				onEventBlockOver: function(event) {
					//alert(event.Title + " - " + event.Description);
					return true;
				},
				onEventBlockOut: function(event) {
					return true;
				},
				onDayLinkClick: function(date) {

						if(typeof(attrs.ngHref) !='undefined'){

        					sessionStorage.setItem('calendarDetail', JSON.stringify({"Date":date}));
							scope.$apply(function() { $location.path(attrs.ngHref);})
						}


					return true;
				},
				onDayCellClick: function(date) {

					//alert(date.toLocaleDateString());
					return true;
				}
			};

			 scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
              };

			scope.$watchGroup([scope.isLoading],function (v) {
				calendarEvents =  angular.copy(scope.ngEvents);
				DrawEventsOnCalendar();
			})
			/* scope.$watch('ngEvents', function(ngEvents) {

				if(ngEvents != null)
				{
					console.log(ngEvents);
					calendarEvents =  angular.copy(ngEvents);
					//Load for the current month
					DrawEventsOnCalendar();
				}
      		},true);*/
			 $.jMonthCalendar.Initialize(options);
			/*var events = [ 	{ "EventID": 1, "Date": new Date(2015, 9, 1), "Title": "10:00 pm - EventTitle1", "URL": "#", "Description": "xdgfvds", "CssClass": "Birthday" },
							{ "EventID": 1, "StartDateTime": new Date(2009, 3, 12), "Title": "10:00 pm - EventTitle1", "URL": "#", "Description": "This is a sample event description", "CssClass": "Birthday" },
							{ "EventID": 2, "Date": "2009-04-28T00:00:00.0000000", "Title": "9:30 pm - this is a much longer title", "URL": "#", "Description": "This is a sample event description", "CssClass": "Meeting" },
							{ "EventID": 3, "StartDateTime": new Date(2009, 3, 20), "Title": "9:30 pm - this is a much longer title", "URL": "#", "Description": "This is a sample event description", "CssClass": "Meeting" },
							{ "EventID": 4, "StartDateTime": "2009-04-14", "Title": "9:30 pm - this is a much longer title", "URL": "#", "Description": "This is a sample event description", "CssClass": "Meeting" }
			];*/

            }
        };
    }]);




	App.directive('ngDateTimePicker', ["DateTimeService",function(DateTimeService) {
        return {

            restrict: "E",
			 templateUrl:"templates/date-time-picker.html",
			 link: function (scope, elm, attrs){
			     var id = "#" + attrs.id;
		    var cd = new Date();
		    $(id+" .setDate").click(function(){
					$(this).addClass("disable");
					$(id+" .setTime").removeClass("disable");
					$(id+" .tbl-date-picker").show();
					$(id+" .tbl-time-picker").hide();
				})

				$(id+" .setTime").click(function(){
					$(this).addClass("disable");
					$(id+" .setDate").removeClass("disable");
					$(id+" .tbl-time-picker").show();
					$(id+" .tbl-date-picker").hide();
				})

				function resetDate(cd) {

                $('.dStr').html(DateTimeService.dateFormat(cd, "fullDate"));
                $('.mon').val(DateTimeService.dateFormat(cd, "mmm"));
                $('.day').val(DateTimeService.dateFormat(cd, "dd"));
                $('.year').val(DateTimeService.dateFormat(cd, "yyyy"));
                $('.hours').val(DateTimeService.dateFormat(cd, "HH") % 12 || 12);
                $('.minute').val(DateTimeService.dateFormat(cd, "MM"));

                DateTimeService.selectDate = {
					fullDate:cd,
                    day: DateTimeService.dateFormat(cd, "day"),
                    month: DateTimeService.dateFormat(cd, "month"),
                    year: DateTimeService.dateFormat(cd, "year"),
                    hour: DateTimeService.dateFormat(cd, "hour"),
                    minute: DateTimeService.dateFormat(cd, "minute"),
                    second: DateTimeService.dateFormat(cd, "second"),
                    weekday: DateTimeService.dateFormat(cd, "weekday"),
					  millisecond: DateTimeService.parseMilliSecondToUTC(cd),

                };
              }

              resetDate(cd);

              $(".reset-date").on("click", function () {

				cd = new Date();
                  resetDate(cd);
              })
			   var ampm = (DateTimeService.dateFormat(cd, "HH") >= 12) ? "PM" : "AM";
			   $('.midtime').html(ampm);

              $('.pyear').on('touchstart', function(event){
                  cd.setYear(cd.getFullYear() + 1);
                  updateF();
              });
              $('.pmon').on('touchstart', function(event){
                  cd.setMonth(cd.getMonth() + 1);
                  updateF();
              });
              $('.pday').on('touchstart', function(event){
                  cd.setDate(cd.getDate() + 1);
                  updateF();
              });
			   $('.phours').on('touchstart', function(event){
                  cd.setHours(cd.getHours() + 1);
                  updateF();
              });
			    $('.pminute').on('touchstart', function(event){
                  cd.setMinutes(cd.getMinutes() + 1);
                  updateF();
              });
              $('.myear').on('touchstart', function(event){
                  cd.setYear(cd.getFullYear() - 1);
                  updateF();
              });
              $('.mmon').on('touchstart', function(event){
                  cd.setMonth(cd.getMonth() - 1);
                  updateF();
              });
              $('.mday').on('touchstart', function(event){
                  cd.setDate(cd.getDate() - 1);
                  updateF();
              });

			   $('.mhours').on('touchstart', function(event){
                  cd.setHours(cd.getHours() - 1);
                  updateF();
              });
			  $(".midtime").on('touchstart', function(event){
				   if((DateTimeService.dateFormat(cd, "HH") >= 12)) {
					   cd.setHours(cd.getHours() - 12);
					   $(this).html("AM");
					}
					else{
							cd.setHours(cd.getHours() + 12);
							$(this).html("PM");
					}

			  });
              $('.mminute').on('touchstart', function(event){
                  cd.setMinutes(cd.getMinutes() - 1);
                  updateF();
              });

              function updateF() {


				 $(id+' .year').val(DateTimeService.dateFormat(cd, "yyyy"));
                 $(id+' .mon').val(DateTimeService.dateFormat(cd, "mmm"));
                 $(id+' .day').val(DateTimeService.dateFormat(cd, "dd"));
                 $(id+' .dStr').html(DateTimeService.dateFormat(cd, "fullDate"));
				 $(id+' .hours').val(DateTimeService.dateFormat(cd, "HH")% 12 || 12);
                 $(id+' .minute').val(DateTimeService.dateFormat(cd, "MM"));
				  var ampm = (DateTimeService.dateFormat(cd, "HH") >= 12) ? "PM" : "AM";
				 $(id+' .midtime').html(ampm);
                  DateTimeService.selectDate = {
					  fullDate:cd,
                      day: DateTimeService.dateFormat(cd, "day"),
                      month: DateTimeService.dateFormat(cd, "month"),
                      year: DateTimeService.dateFormat(cd, "year"),
                      hour: DateTimeService.dateFormat(cd, "hour"),
                      minute: DateTimeService.dateFormat(cd, "minute"),
                      second: DateTimeService.dateFormat(cd, "second"),
                      weekday: DateTimeService.dateFormat(cd, "weekday"),
					  millisecond: DateTimeService.parseMilliSecondToUTC(cd),


                  };


              }


            }
        };
    }]);



	App.directive('ngDatePicker', ["DateTimeService",function(DateTimeService) {
        return {

            restrict: "E",
			 templateUrl:"templates/date-picker.html",
			 link: function (scope, elm, attrs){
			     var id = "#" + attrs.id;
		    var cd = new Date()
			;
		    $(id+" .setDate").click(function(){
					$(this).addClass("disable");
					$(id+" .setTime").removeClass("disable");
					$(id+" .tbl-date-picker").show();
					$(id+" .tbl-time-picker").hide();
				})

				$(id+" .setTime").click(function(){
					$(this).addClass("disable");
					$(id+" .setDate").removeClass("disable");
					$(id+" .tbl-time-picker").show();
					$(id+" .tbl-date-picker").hide();
				})

				function resetDate(cd) {

                $('.dStr').html(DateTimeService.dateFormat(cd, "fullDate"));
                $('.mon').val(DateTimeService.dateFormat(cd, "mmm"));
                $('.day').val(DateTimeService.dateFormat(cd, "dd"));
                $('.year').val(DateTimeService.dateFormat(cd, "yyyy"));
                $('.hours').val(DateTimeService.dateFormat(cd, "HH") % 12 || 12);
                $('.minute').val(DateTimeService.dateFormat(cd, "MM"));

                DateTimeService.selectDate = {
					fullDate:cd,
                    day: DateTimeService.dateFormat(cd, "day"),
                    month: DateTimeService.dateFormat(cd, "month"),
                    year: DateTimeService.dateFormat(cd, "year"),
                    hour: DateTimeService.dateFormat(cd, "hour"),
                    minute: DateTimeService.dateFormat(cd, "minute"),
                    second: DateTimeService.dateFormat(cd, "second"),
                    weekday: DateTimeService.dateFormat(cd, "weekday"),
					millisecond: DateTimeService.parseMilliSecondToUTC(cd),

                };
              }

              resetDate(cd);

              $(".reset-date").on("click", function () {
                cd = new Date();
                  resetDate(cd);
              })


              $('.pyear').on('touchstart', function(event){
                  cd.setYear(cd.getFullYear() + 1);
                  updateF();
              });
              $('.pmon').on('touchstart', function(event){
                  cd.setMonth(cd.getMonth() + 1);
                  updateF();
              });
              $('.pday').on('touchstart', function(event){
                  cd.setDate(cd.getDate() + 1);
                  updateF();
              });

              $('.myear').on('touchstart', function(event){
                  cd.setYear(cd.getFullYear() - 1);
                  updateF();
              });
              $('.mmon').on('touchstart', function(event){
                  cd.setMonth(cd.getMonth() - 1);
                  updateF();
              });
              $('.mday').on('touchstart', function(event){
                  cd.setDate(cd.getDate() - 1);
                  updateF();
              });

			   $(".midtime").on('touchstart', function(event){
				   if((DateTimeService.dateFormat(cd, "HH") >= 12)) {
					   cd.setHours(cd.getHours() - 12);
					   $(this).html("AM");
					}
					else{
							cd.setHours(cd.getHours() + 12);
							$(this).html("PM");
					}

			  });



              function updateF() {


				  $('.year').val(DateTimeService.dateFormat(cd, "yyyy"));
                  $('.mon').val(DateTimeService.dateFormat(cd, "mmm"));
                  $('.day').val(DateTimeService.dateFormat(cd, "dd"));
                  $('.dStr').html(DateTimeService.dateFormat(cd, "fullDate"));
                  DateTimeService.selectDate = {
					  fullDate:cd,
                      day: DateTimeService.dateFormat(cd, "day"),
                      month: DateTimeService.dateFormat(cd, "month"),
                      year: DateTimeService.dateFormat(cd, "year"),
                      hour: DateTimeService.dateFormat(cd, "hour"),
                      minute: DateTimeService.dateFormat(cd, "minute"),
                      second: DateTimeService.dateFormat(cd, "second"),
                      weekday: DateTimeService.dateFormat(cd, "weekday"),
					  millisecond: DateTimeService.parseMilliSecondToUTC(cd),


                  };


              }


            }
        };
    }]);




	App.directive('ngTimePicker', ["DateTimeService",function(DateTimeService) {
        return {

            restrict: "E",
			 templateUrl:"templates/time-picker.html",
			 link: function (scope, elm, attrs){
			     var id = "#" + attrs.id;
		    var cd = new Date();


				function resetDate(cd) {


                $('.hours').val(DateTimeService.dateFormat(cd, "HH") % 12 || 12);
                $('.minute').val(DateTimeService.dateFormat(cd, "MM"));
				if((DateTimeService.dateFormat(cd, "HH") >= 12)) {
					    $(".midtime").html("AM");
					}
					else{
						 $(".midtime").html("PM")
					}


                DateTimeService.selectDate = {
					 fullDate:cd,
                    day: DateTimeService.dateFormat(cd, "day"),
                    month: DateTimeService.dateFormat(cd, "month"),
                    year: DateTimeService.dateFormat(cd, "year"),
                    hour: DateTimeService.dateFormat(cd, "hour"),
                    minute: DateTimeService.dateFormat(cd, "minute"),
                    second: DateTimeService.dateFormat(cd, "second"),
                    weekday: DateTimeService.dateFormat(cd, "weekday"),
					millisecond: cd.getTime()

                };
              }

              resetDate(cd);

              $(".reset-date").on("click", function () {
                   cd = new Date();
                  resetDate(cd);
              })
			   var ampm = (DateTimeService.dateFormat(cd, "HH") >= 12) ? "PM" : "AM";
			   $('.midtime').html(ampm);

              $('.phours').on('touchstart', function(event){

                  cd.setHours(cd.getHours() + 1);
                  updateTime();
              });
			     $('.pminute').on('touchstart', function(event){
                  cd.setMinutes(cd.getMinutes() + 1);
                  updateTime();
              });




			$('.mhours').on('touchstart', function(event){
                  cd.setHours(cd.getHours() - 1);
                  updateTime();
              });
			  $('.mminute').on('touchstart', function(event){
                  cd.setMinutes(cd.getMinutes() - 1);
                  updateTime();
              });

			   $(".midtime").on('touchstart', function(event){
				   if((DateTimeService.dateFormat(cd, "HH") >= 12)) {
					   cd.setHours(cd.getHours() - 12);
					   $(this).html("AM");
					}
					else{
							cd.setHours(cd.getHours() + 12);
							$(this).html("PM");
					}
					updateTime();

			  });



			   function updateTime() {

                  $('.hours').val(DateTimeService.dateFormat(cd, "HH")% 12 || 12);
                  $('.minute').val(DateTimeService.dateFormat(cd, "MM"));
				  var ampm = (DateTimeService.dateFormat(cd, "HH") >= 12) ? "PM" : "AM";
				  $('.midtime').html(ampm);
				  DateTimeService.selectDate = {
					  fullDate:cd,
				      day: DateTimeService.dateFormat(cd, "day"),
				      month: DateTimeService.dateFormat(cd, "month"),
				      year: DateTimeService.dateFormat(cd, "year"),
				      hour: DateTimeService.dateFormat(cd, "hour"),
				      minute: DateTimeService.dateFormat(cd, "minute"),
				      second: DateTimeService.dateFormat(cd, "second"),
				      weekday: DateTimeService.dateFormat(cd, "weekday"),
					  millisecond: cd.getTime()

				  };

              }
            }
        };
    }]);



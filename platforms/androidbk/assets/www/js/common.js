	//		define(function () {
//    return {
//        click: function (el) {
//            var ev = document.createEvent("MouseEvent");
//            ev.initMouseEvent(
//                "click",
//                true /* bubble */, true /* cancelable */,
//                window, null,
//                0, 0, 0, 0, /* coordinates */
//                false, false, false, false, /* modifier keys */
//                0 /*left*/, null
//            );
//            el.dispatchEvent(ev);
//        }
//    };
//});	
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

$(document).ready(function(){


	$(document).on("keydown",'input',function(event){
		
       if (event.keyCode == 9) {
        $(this).blur();
       }
       if (event.keyCode == 13) {
		  
		if(device.platform=="iOS"){
			elm = $(this).parents(".modal");
			elm.css({ left: ($(window).width() - elm.width()) / 2, top: ($(window).height() - elm.height()) / 2 })
		}
          $(this).blur();
       }
});
	$(document).on('focus','input', function (e) {
		
		$('input').parent().removeClass('focus');
		$(this).parents(".ui-shadow-inset").addClass('focus');
		
	
		if(device.platform=="iOS"){
			cordova.plugins.Keyboard.disableScroll(true);
			elm = $(this).parents(".modal");
			elm.css({ left: ($(window).width() - elm.width()) / 2, top:"50px" })
		}
	});
	
	
	$(document).on('touchstart','ul.list li', function () {
		$(this).addClass("touch");
	});
	
	$(document).on('touchend touchcancel touchmove','ul.list li', function () {
			$(this).removeClass("touch");
	});
	
	$(document).on('touchstart','.modal .modal-content ul.select li', function () {
			$(this).addClass("touch");
		});
		
	$(document).on('touchend touchcancel touchmove','.modal .modal-content ul.select li', function () {
		$(this).removeClass("touch");
	});
	
	 $(".overlay").on("click", function (event) {
				event.stopPropagation();
				event.preventDefault();
				//$(".scroll").css({"overflow":"auto"});
				$(this).hide();
				$(".modal").removeClass("zoomIn");
				$(".modal").addClass("zoomOut");
				setTimeout(function(){
					$(".modal").hide();
				},500);
				//
				$("input").blur();
				return false;			
				
			})
	
})

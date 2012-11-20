/**
 * maxLength
 * 
 * @author Predrag Krstic
 * 
 * @param optionsint maxLength maxLength, this is default value, in case we don't 
 * have set maxlength as attribute, or as dataset attribute (data-maxlength).
 * 
 * Top priority have regular maxlength, after that comes dataset attribute, 
 * and at the end value set trough plugin call
 * 
 * Usage:
 * 
 * JavaScript:
 * $('.charCounter').maxLength();
 * $('.charCounter').maxLength(100);
 * 
 * HTML:
 * <input type="text" class="charCounter" maxlength="200">
 * <input type="text" class="charCounter" data-maxlength="200">
 * <textarea class="charCounter" maxlength="200"></textarea>
 * <textarea class="charCounter" data-maxlength="200" maxlength="200" data-showcounter="false"></textarea>
 * 
 * NOTE:
 * Textarea tag in HTML5 supports maxlength attribute, 
 * this attribute is supported by Chrome 10+, FireFox 4+, IE10+ and Opera 11+
 *  
 */
(function ($) {
	$.fn.maxLength = function (options) {
		
		var defaultOptions = $.extend({
			maxLength: 0,
			showCounter: true,
			counterClass: 'charCount'
		}, options);
		
		defaultOptions.hasMaxLength = !!('maxlength' in (document.createElement('textarea')));
		
		return this.each( function () {
			
			var o = $.extend({}, options),
				cc,
				self = $(this),
				updateCounter = function(){
					if(o.showCounter){
						$(cc).text( $(self).val().length );
					}
				},
				cutOver = function(){
					if( $(self).val().length >= o.maxLength ){
						$(self).val( $(self).val().substr(0, o.maxLength) );
					}	
				};
			
			o.maxLength = $(self).attr('maxlength') || $(self).data('maxlength') || o.maxLength;
			o.showCounter = $(self).data('showcounter') || o.showCounter;
			o.counterClass = $(self).data('counterclass') || o.counterClass;
			o.hasMaxLength = o.hasMaxLength || this.tagname == 'INPUT';
			
			if(o.showCounter) {
				cc = $('<span>').addClass(o.counterClass).attr('title', 'Char count, maximum alowed ' + o.maxLength).insertAfter(this);
			}
			
			
			$(self).on('keyup', function (e) {
				updateCounter();
			})
			.keyup();

			if(o.maxLength < 1) { 
				return ; 
			}

			
			// if browser supports maxlength property on input and textarea
			// just set maxlength and exit
			if(o.hasMaxLength) {
				$(self).attr('maxlength', o.maxlength);
				return ;
			}
			
			
			// this is section mainly for IE/textarea combination
			// since only IE not support maxlength on textarea
			$(self).on('keypress', function(e) {
				if( ( $(self).val().length >= o.maxLength ) && ( String.fromCharCode(event.charCode) !== '' ) ) {
					e.preventDefault();
				}
				cutOver();
				updateCounter();
			})
			
			.on("paste", function(e){				
				
				if( $(self).val().length >= o.maxLength ) {
					e.preventDefault();
				}
				else{
					cutOver();
				}
				updateCounter();
			})
			
			.on('blur', function(e) {
				cutOver();
				updateCounter();
			});
						
		});	
	}
})(jQuery);

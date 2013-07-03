(function($){

$(document).ready(function (){

	$('textarea[data-autoresize]').on('input propertychange', function() {
		
		autoResize($(this));
		
	});

});


})(window.jQuery);



/*
	Functions for auto-resizing textareas.
	Based in great part (ok, almost entirely) on John Long's autogrow plugin:
	https://gist.github.com/jlong/2127634
	
	For a more consistent user experience you should apply resize: none to auto-resizing textareas in your CSS.
	The plugin needs to apply it on its own, so it's better that it not be there at all. (That said, you probably
	want to apply that style only when JS is avaialble.)
*/

var properties = ['-webkit-appearance','-moz-appearance','-o-appearance','appearance','font-family','font-size','font-weight','font-style','border','border-top','border-right','border-bottom','border-left','box-sizing','padding','padding-top','padding-right','padding-bottom','padding-left','min-height','max-height','line-height'],	escaper = $('<span />');

function escape(string) {
	return escaper.text(string).text().replace(/\n/g, '<br>');
};

function autoResize(which) {
	
	if (!which.data('autogrow-applied')) {
	
		var textarea = which,	 initialHeight = textarea.innerHeight(), expander = $('<div />'), timer = null;

		// Setup expander
		expander.css({'position': 'absolute', 'visibility': 'hidden', 'bottom': '110%'})
		$.each(properties, function(i, p) { expander.css(p, textarea.css(p)); });
		textarea.after(expander);

		// Setup textarea
		textarea.css({'overflow-y': 'hidden', 'resize': 'none', 'box-sizing': 'border-box'});

		// Sizer function
		function sizeTextarea() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				var value = escape(textarea.val()) + '<br>z';
				expander.html(value);
				expander.css('width', textarea.innerWidth() + 2 + 'px');
				textarea.css('height', Math.max(expander.innerHeight(), initialHeight) + 2 + 'px');
			}, 0); // throttle by 100ms 
		}

		// Bind sizer to IE 9+'s input event and Safari's propertychange event
		textarea.on('input.autogrow propertychange.autogrow', sizeTextarea);

		// Set the initial size
		sizeTextarea();

		// Record autogrow applied
		textarea.data('autogrow-applied', true);
		
	};
	
};

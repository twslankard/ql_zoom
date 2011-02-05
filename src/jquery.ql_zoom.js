/*
	Copyright (c) 2011 Samuel Breed, http://quickleft.com

  v0.0.1a
	
	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:
	
	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function($){
	$.fn.ql_zoom = function(options) {
		var settings = $.extend({}, $.fn.ql_zoom.defaultOptions, options);

		return this.each(function() {
      var c, pos, o,
          _time = new Date().getTime(),

          $this = $(this),

          $canvas = $('<canvas>', { 'id': 'viewer'+_time, 'style': 'display:none; position:absolute; border:2px solid #000;' }),

          target_image, orig_image, t_h, t_w, o_h, o_w,

          w = parseInt( settings.width, 10 ),
          h = parseInt( settings.height, 10 );

      function init(){
        // Create a container if the selector is the target image
        if( /IMG/.test( $(this)[0].nodeName ) === true ) {
          $this.wrapAll( $("<div>", { id: 'ql_zoom_'+_time, 'class': 'ql_zoom_container' }) );
          $this = $('#ql_zoom_'+_time);
        }

        // Save a copy of the original image
        orig_image = $this.find('img').first();

        // Attach the target image to the safe container
        target_image = $('<img>', { 'src': orig_image.data('url'), 'style': 'display:none;'}).appendTo($this);

        // Use the lovely & talented Paul Irish's imagesLoaded helper
        target_image.imagesLoaded(function(){
          t_h = target_image.height();
          t_w = target_image.width();

          o_h = orig_image.height();
          o_w = orig_image.width();
        });

        // Cache the container's offset from the window
        o = $this.offset();

        // Attach canvas to our container
        $canvas.appendTo($this);
        $canvas.css({ 'width': settings.width, 'height': settings.height });

        if( /static/.test(pos) ){
          $this.css('position', 'relative');
        }

        // Set some additional styling on canvas
        $this.css({ 'overflow': 'hidden', 'cursor': settings.pointer });

        // Expose a copy of the raw element
        c = $canvas.get()[0].getContext('2d');

      }

      // Returns top and left positions calculated for centering box
      function offset(x, y){
        var l =  ( x - o.left ) - ~~( w / 2),
            t = ( y - o.top ) - ~~( h / 2);

        return {
          left: l + "px",
          top:  t + "px"
        };
      }

      // Returns sx, sy, sw and sh arguements for drawImage
      function magnify( ix, iy ){
        var sy = iy < 0 ? 0 : iy / ( o_h / t_h ),
            sx = ix < 0 ? 0 : ix / ( o_w / t_w ),

            width = w * (o_w / t_w),
            height = h * (o_h / t_h);

        return [sx, sy, w, h ];
      }

      function track(e) {
        var position, rect,
            coords = offset( e.pageX, e.pageY );

        // Set the canvas to follow the cursor
        $canvas.css(coords);

        // Grab the css position 
        // TODO prolly don't need to do this, since we've already got the coords
        position = $canvas.position();

        // Grab the scaled box height and offset distances
        rect = magnify( position.left, position.top );

        // Draw the image onto canvas
        c.drawImage(target_image[0], rect[0], rect[1], rect[2], rect[3], 0, 0, 300, 150 );
      }

      // Set everything up
      init();

      // Bind the events
      $this
        .mouseenter( function(e){
          $canvas.fadeIn(settings.speed);
        })
        .mouseleave( function(e){
          $canvas.fadeOut(settings.speed);
        })
        .mousemove( $.throttle( settings.throttle, track) );

      // Reset the cached offset in case of a resize
      $(window).resize(function(e){
        o = $this.offset();
      });

		});
	};

	$.fn.ql_zoom.defaultOptions = {
    width: '200px',
    height:'200px',
    speed: '800',
    throttle: 50,
    pointer: 'ne-resize'
	};
})(jQuery);

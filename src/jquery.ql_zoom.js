// Dependencies:
//  imagesLoaded
//  throttle

/*
  $.fn.imagesLoaded mit license. paul irish. 2010.
  webkit fix from Oren Solomianik. thx!
*/

$.fn.imagesLoaded = function(callback){
  var elems = this.filter('img'),
      len   = elems.length;
      
  elems.bind('load',function(){
      if (--len <= 0){ callback.call(elems,this); }
  }).each(function(){
     // cached images don't fire load sometimes, so we reset src.
     if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        this.src = src;
     }  
  }); 

  return this;
};

/*
  jQuery throttle / debounce - v1.1 - 3/7/2010
  http://benalman.com/projects/jquery-throttle-debounce-plugin/

  Copyright (c) 2010 "Cowboy" Ben Alman
  Dual licensed under the MIT and GPL licenses.
  http://benalman.com/about/license/
*/

(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);

/*
  QL Zoom

  Copyright (c) 2011 Samuel Breed, http://quickleft.com

  v0.0.1
  
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

          $canvas = $('<canvas>', { 'id': 'viewer'+_time, 'style': settings.canvas_style }),

          target_image, orig_image,
          source_width, source_height,
          orig_width, orig_height,

          w = parseInt( settings.width, 10 ),
          h = parseInt( settings.height, 10 );

      // Debugging ONLY
      var output = $('#output');

      // Returns top and left positions calculated for centering box
      function offset(x, y, width, height){

        width = width || w;
        height = height || h;

        // Calculate the relative coordinates, subtracting from the center to get (sx, sy)
        var l =  ( x - o.left ) - ~~( width / 2),
            t = ( y - o.top ) - ~~( height / 2);

        return [l,t];
      }

      // Scales current image selection to target image and
      // returns all arguments for canvas.drawImage()
      //
      //    [drawImage docs](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#images)
      function magnify( ix, iy ){
        var sx, sy, sW, sH, dx, dy, dW, dH;

        // Mark the top left corner of target box, scaled from same point on original image
        sx = ( (ix * source_width) / orig_width ) + (w / 2);
        sy = ( (iy * source_height) / orig_height ) + (h /2);

        // Viewing box is set from user settings
        sW = w;
        sH = h;

        // Starting coords for canvas
        dx = 0;
        dy = 0;

        // These don't seem to be wanting to scale with smaller bounding boxes
        //dW = (w * source_width) / orig_width;
        //dH = (h * source_height) / orig_height;

        // I don't know why this works
        dW = w * 2;
        dH = h;

        // Handling for portion of viewer outside boundary of original image
        // by scaling down the draw area
        if(sx > source_width - w){
          sW = source_width - sx;
          dW = sW * 2;
        }

        if(sy > source_height - h){
          sH = source_height - sy;
          dH = sH;
        }

        // Prevent drawImage from chocking on values < 0
        if(sx < 0){
          dx = Math.abs(sx);
          sx = 0;
        }

        if(sy < 0){
          sy = 0;
        }

        // Math.floor all values on the way out to prevent subpixel rendering
        return [~~sx, ~~sy, ~~sW, ~~sH, ~~dx, ~~dy, ~~dW, ~~dH];
      }

      // Re-position canvas on mousemove to follow cursor
      // Get updated arguments and redraw zoom window based on position
      function track(e) {
        var position, rect,
            coords = offset( e.pageX, e.pageY );

        // Set the canvas to follow the cursor
        $canvas.css({ left: coords[0] +'px', top: coords[1] +'px' });

        // Grab position relative to viewer
        position = $canvas.position();

        // Grab the scaled box height and offset distances
        rect = magnify( position.left, position.top );

        // Debug ONLY
        output.html("sx = "+rect[0] +", sy =" + rect[1] +
                    ", sW = "+rect[2] +", sH =" + rect[3] +
                    ", dx = "+rect[4] +", dy =" + rect[5] +
                    ", dW = "+rect[6] +", dH =" + rect[7] +
                    ", pageX ="+coords[0]+", pageY ="+ coords[1] );


        // Draw the image onto canvas
        try{
          c.clearRect(0,0,400,400);
          c.drawImage( target_image[0], rect[0], rect[1], rect[2], rect[3], rect[4], rect[5], rect[6], rect[7] );
        } catch(error){
          // Debug ONLY
          console.dir(error);
        }
      }

      function Events() {
        // Bind show / hide canvas on hover
        // Bind mousemove with Ben Alman's $.throttle plugin to keep canvas re-draws down
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
      }

      // Set everything up
      (function init(){
        // Create a container if the selector is the target image
        // TODO: fix this cause it doesn't work right =/
        if( /IMG/.test( $(this)[0].nodeName ) === true ) {
          $this.wrapAll( $("<div>", { id: 'ql_zoom_'+_time, 'class': 'ql_zoom_container' }) );
          $this = $('#ql_zoom_'+_time);
        }

        // Save a copy of the original image
        orig_image = $this.find('img').first();

        // Cache original image dimensions
        orig_height = orig_image.height();
        orig_width = orig_image.width();

        // Attach the target image to the safe container
        target_image = $('<img>', { 'src': ( !! orig_image.data('url') ) ? orig_image.data('url') : orig_image.attr('src'), 'style': 'display:none;'}).appendTo($this);

        // Using the lovely & talented Paul Irish's imagesLoaded helper
        target_image.imagesLoaded(function(){
          // Cache source image dimensions
          source_height = target_image.height();
          source_width = target_image.width();

          if( source_height <= orig_height ) {
            return;
          }

          if( source_width <= orig_width ) {
            return;
          }
        });

        // Attach canvas to our container
        $canvas.appendTo($this);
        $canvas.css({ 'width': settings.width, 'height': settings.height });

        // Update position, if it's static. If it's fixed, good luck?
        if( /static/.test(pos) ){
          $this.css('position', 'relative');
        }

        // Set some additional styling on canvas
        $this.css({ 'overflow': 'hidden', 'cursor': settings.pointer });

        // Cache the container's offset from the window
        o = $this.offset();

        // Expose a copy of the raw element
        c = $canvas.get()[0].getContext('2d');

        Events();
      })();


    });
  };

  $.fn.ql_zoom.defaultOptions = {
    width: '200px',
    height:'200px',
    speed: '800',
    throttle: 50,
    pointer: 'crosshair',
    canvas_style: 'display:none; position:absolute; border:1px solid #444;'
  };
})(jQuery);

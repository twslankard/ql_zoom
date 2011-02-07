/* Author: 

*/


(function($){
  
  $(function(){
    if(Modernizr.canvas){
      $('.image').ql_zoom();
      $('.custom_image').ql_zoom({ 
        width: '200px',
        height: '200px',
        throttle: 10,
        pointer: 'crosshair',
        canvas_style: '-webkit-border-radius:100px;-moz-border-radis:100px;border-radius:100px;' });
    } else {
      alert('Your browser doens\'t support Canvas. \nThese aren\'t the droids you\'re looking for');
    }
  });

})(jQuery);






















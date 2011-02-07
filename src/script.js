/* Author: 

*/


(function($){
  
  $(function(){
    if(Modernizr.canvas){
      $('.image').ql_zoom();
      $('.custom_image').ql_zoom({ width: '150px', height: '150px', throttle: 10, pointer: 'crosshair' });
    } else {
      alert('Your browser doens\'t support Canvas. \nThese aren\'t the droids you\'re looking for');
    }
  });

})(jQuery);






















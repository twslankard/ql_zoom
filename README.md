# jquery.ql_zoom.js

A jQuery zoom plugin that uses canvas.

v0.0.3

## About

Uses an asychronously loaded full size image to create a "magnifying glass" effect on a scaled image with the HTML5 canvas element. See an example [here][pages].

## Usage

Just invoke the plugin on a parent element which wraps your image.


    <div id="elem">
      <img src="/path/to/scaled.jpg" data-url="/path/to/full_sized/jpg" />
    </div>

    ...

    $('#elem').ql_zoom(options);

Where `options` is a hash of settings. Here are the configurable options
and their default values:

* width: '200px'
  * _Distance in pixels_
  * Controls the width of the zoom viewer
* height:'200px'
  * _Distance in pixels_
  * Controls the height of the zoom viewer
* speed: 800
  * _Time in milliseconds_
  * Sets the speed of the fade in / out of the zoom viewer
* throttle: 50
  * _Time in milliseconds_
  * Sets the `$.throttle()` timeout. See [Ben Alman's throttle-debounce plugin][1]
* pointer: 'crosshair'
  * _CSS value_
  * Changes the style applied to the mouse pointer
* canvas\_style: 'border:1px solid #444;'
  * _CSS string_
  * Any additional CSS you'd like to apply to the canvas element when it's initialized

In addtion to [throttle][1], jquery.ql\_zoom uses Paul Irish's
[imagesLoaded][2] event to help with reliable cross browser image
loading.


[1]: https://github.com/cowboy/jquery-throttle-debounce
[2]: https://gist.github.com/268257
[pages]: http://quickleft.github.com/ql_zoom

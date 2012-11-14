# rrhandler.js

Common, rotate for mobile and resize for desktop handler

## Intro

`rrhandler.js` handles three important resizing aspects:

* it registers mobile orientation events and fires callback only after browser DOM has been updated to the new body widths and heigths. This is mayor pain on Android as the event fires too early ( or DOM updates too late, whichever you like )
* it scrolls mobile addresbars out of sight and takes care that BODY tag has enough height to do
* it throttles resize events on desktop browsers

Rrhandler uses different techique than other similar solutions to handle orientation events - it saves inital orientation AND width and then pulls as long as it can confirm that body measurements are updated in DOM. Typical alternative approach is just to wait some amount of time, on iOS 100ms is usually enough, on Android 500ms is enough. But this delay depend of the compexity of DOM. Pull is better.

`rrhandler.js` is written in vanilla Javascript and has one possible dependancy. 

## Usage

Rrhandler sets ourselves up into `window.atirip` namespace.

**Detect your browser features first**

Include `features-detector.js`

    <script src="path/to/features-detector.js" type="text/javascript"></script>

Or alternatively use your own detector of wish and provide the following classes and variables as below ( I use typical iOS webkit browser values here as an example )

	atirip.is = {
		mobile: true,
		android: false,
		ios: true
	}
	atirip.events = {
		resize: 'onorientationchange'
	}


**Include rrhandler.js:**

    <script src="path/to/rrhandler.js" type="text/javascript"></script>

**Initalize rrhandler**

	new atirip.rrhandler({
		callback: function(first, orientation) {}
		context: window,
		throttleDuringResize: true,
		throttleInterval: 200
	})

Where:
__callback__ called after orientation change or throttled resize, takes 2 parameters: first is true at first callback, which is fired stright at init; orientatin is string of current orienation - "landscape" or "portrait"
__context__ at which context callback is called
__throttleDuringResize__  whether to call handler during resize, only effective on desktop computers, default true.  
__throttleInterval__ throttle interval, if throttleDuringResize set to true, in milliseconds, default 200ms


## Compatible

Tested on Firefox 16, Chrome 23, Opera 12 on Mountain Lion and Windows, IE 8, IE 7 on Windows
(Windows XP under Parallels 7). On iOS 4..6, Android 2.3.

## TODO

* Windows Phone support, I have no idea if it works or not 

## Contact me

For support, remarks and requests, please mail me at [atirip@yahoo.com](mailto:atirip@yahoo.com).

## License

Copyright (c) 2012 Priit Pirita, released under the MIT license.


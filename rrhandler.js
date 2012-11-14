/*jshint laxcomma:true, laxbreak: true, asi:true */
/*
* MIT Licensed
* Copyright (c) 2012, Priit Pirita, atirip@yahoo.com
* https://github.com/atirip/rrhandler.js
*/

;(function(window, APP) {

var rrhandler = (function() {

	var	doc = window.document
	,	body = doc.body
	,	slice = Array.prototype.slice
	,	throttleDuringResize = true
	,	throttleInterval = 200
	
	,	throttle = function (interval, fn) {
			var lastTime = null
			,	timer = null

			return function () {
				var self = this
				,	args = slice.call(arguments, 0)
				,	func = function () {
						fn.apply(self, args)
						lastTime = null
					}
				,	run = function () {
						if ( throttleDuringResize ) {
							var now = new Date
							if (now - lastTime > interval) {
								// if interval passed, call
								lastTime = now
								fn.apply(self, args)
							}
						}
						// call once after last ettempt
						timer && clearTimeout(timer)
						timer = setTimeout(func, interval)
					}
				setTimeout(run, 10)
			}
		}
	,	setAttr
	,	getAttr
	,	div = doc.createElement('div')

	// cross-browser set/get attribute
	div.setAttribute("data-test", "t")
	if ( div.getAttribute("data-test") !== "t" ) {
		// lifted from jQuery for IE<8
		setAttr = function( elem, name, value ) {
			var ret = elem.getAttributeNode( name )
			if ( !ret ) {
				ret = doc.createAttribute( name )
				elem.setAttributeNode( ret )
			}
			ret.nodeValue = value + ""
		};
		getAttr = function( elem, name ) {
			var ret = elem.getAttributeNode( name )
			return ret.nodeValue
		};
	} else {
		setAttr = function( node, name, val ) {
			node.setAttribute(name, val)
		};
		getAttr = function( node, name ) {
			return node.getAttribute(name)
		};
	}


	function constructor(options) {

		var self = this
		,	name
		,	resizeHandler = function() {
				self.resize.call(self)
			}
		,	resizeThrottle = (function() {
				if ( APP.is.mobile ) {
					// on touch devices no need to throttle
					return resizeHandler
				} else {
					return throttle(throttleInterval, resizeHandler)
				}
			})()

		this.setBody = true
		this.first = true

		options = options || {}
		for ( name in options ) if( options.hasOwnProperty(name) ) this[name] = options[name]

		;(undefined !== options.throttleDuringResize) && (throttleDuringResize = options.throttleDuringResize)
		;(undefined !== options.throttleInterval) && (throttleInterval = options.throttleInterval)

		// there's no reason to set body minHeight on desktop
		!APP.is.mobile && (this.setBody = false)

		// save initial orientation
		this.initial = {
			orientation : this.getOrientation(),
			width : window.innerWidth
		}

		if ( window.addEventListener ) {
			window.addEventListener(APP.events.resize, resizeThrottle, false)
		} else if( window.attachEvent ) {
			window.attachEvent('onresize', resizeThrottle)
		}

		this.resize()
	}

	constructor.prototype = {
	
		getOrientation: function() { 
			return (undefined !== window.orientation ? ((window.orientation % 180 === 0) ? 'portrait' : 'landscape') : (window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'))
		},

		resize: function() {
			var self = this
			,	orientation = this.getOrientation()
			,	i = 0
			,	pull = function pull(){
					// have a safety net, don't pull forever
					i++
					// pull until you can confirm that width is changed
					if ( i > 100 || (self.initial.orientation === orientation && self.initial.width === window.innerWidth ) || (self.initial.orientation !== orientation && self.initial.width !== window.innerWidth) ) {
						// orientation changed, DOM updated
						if ( self.setBody ) {
							body.style.minHeight = (APP.is.android ? window.outerHeight / window.devicePixelRatio : window.innerHeight )  + 'px'
						}
						self.callback && self.callback.call(self.context || window, self.first, orientation )
						self.first = false
					} else {
						setTimeout(pull, 10)
					}
				}

			// secure yourself from IE quirks
			if ( !body ) return;

			// set safe body height before you try to scroll addressbar out of sight, be sure you CAN scroll at all
			if ( this.setBody ) {
				if ( APP.is.android ) {
					body.offsetHeight < window.outerHeight / window.devicePixelRatio && ( body.style.minHeight = (window.outerHeight/window.devicePixelRatio) + 'px' )
				} else if ( APP.is.ios ) {
					body.offsetHeight < screen.availHeight && ( body.style.minHeight = screen.availHeight + 'px' )
				}
			}
			setTimeout(function(){
				0 === body.scrollTop && ( body.scrollTop = (APP.is.android ? 1 : 0) )
				pull()
			// it is good to give browser a little moment to breath and get the act together, especially on Android
			}, 100)
		}
	}

	return constructor
	
})() // end of class definition

APP.rrhandler = rrhandler
	
})(window, (window.atirip || (window.atirip = {}) ));



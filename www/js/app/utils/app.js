/*
 * Set global properties
 */

define([
    'lodash',

    'app/utils/gamemaster',
    'app/utils/engine'
],

    function( _, GAME, ENGINE) {

        'use strict';

        var o = {

			// Allow app to extend globals
			extend: function ( dest, scope ) {

				if ( !_.isObject(dest) ) {
					return;
				}
				
				var src;
				if ( scope ) {
					o[scope] = o[scope] || {};
					src = o[scope];
				} else {
					src = o;
				}
				

				_.extend(src, dest);

                return this;

			},
            GAME: GAME,
            ENGINE: ENGINE
		};

		// expose to 'window' if in dev mode
		if ( window.DEV_MODE ) {
			window.APP = window.APP || o;
		}

		return o;

    }
);
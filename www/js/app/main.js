/*
 * Initialize App for `main`.
 */

define([

    'APP',

    'views/world',
    'views/hero',
    'views/enemy'

], function (APP, World, Hero ) {

    'use strict';

    (function() {
        if ( !document.body ) {
            return setTimeout( this, 1 );
        } else {

            // Init game
            APP.GAME.init({
                // Game settings
            });

            var world = new World({
                // World settings
            });

            world.draw().promise.then( function ( err, scene ) {
                var hero = new Hero();
            });

        }
    })();

});
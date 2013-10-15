/*
 * Our hero
 */

define([
    'APP',

    'lodash',
    'promise'
], function (APP, _, promise ) {

    'use strict';


    function Hero ( options ) {

        options = options || {};
        this.options = options;
        this.promise = new promise.Promise();

        return this.init( options );
    };

    Hero.prototype.init = function ( options ) {

        var physics = APP.GAME.physics;

        return this;
    };



    Hero.prototype.resolve = function () {
        this.promise.done(null, this);
    };

    return Hero;


});
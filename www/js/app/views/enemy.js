/*
 * A enemy prototype
 */

define([
    'APP',

    'lodash',
    'promise'
], function (APP, _, promise) {

    'use strict';


    function Enemy () {
        this.init();
    }

    Enemy.prototype.init = function ( options ) {

        options = options || {};

        // default
        this.options = options;
        this.options.world = APP.world;
        this.promise = new promise.Promise();

        // option overrides
        _.extend( this.options, options );

        return this;

    };

    Enemy.prototype.draw = function () {

        var canvas = this.options.world.canvas,
            ctx = this.options.world.context,
            radius = 20;

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();

        return this;

    }




    return Enemy;


});
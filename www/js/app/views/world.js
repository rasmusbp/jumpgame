/*
 * Main CANVAS scene of the game
 */

define([
    'APP',

    'lodash',
    'promise'


], function ( APP, _, promise ) {

    'use strict';

    function World ( options ) {
        this.options = options || {};

        // defaults
        var id = this.options.canvasId || 'mainScene';

        this.promise = new promise.Promise();
        this.options.canvas  = document.getElementById(id);
        this.options.context = this.options.canvas.getContext('2d');
        this.options.background = '#cccccc';

        // option overrides
        _.extend( this.options, options );

        return this.init( options );
    }

    World.prototype.init = function ( options ) {

        // Enable 2D psycics
        var physics =  new APP.ENGINE.Physics( this.options.canvas );
            //physics.debug();

        // Add world elements
        // Create some walls
        var Body = APP.ENGINE.Body;

        new Body(physics, { color: "black", type: "static", x: 0, y: 0, height: 50,  width: 0.5 });
        new Body(physics, { color: "black", type: "static", x:51, y: 0, height: 50,  width: 0.5});
        new Body(physics, { color: "black", type: "static", x: 0, y: 0, height: 0.5, width: 120 });
        new Body(physics, { color: "black", type: "static", x: 0, y:15, height: 0.5, width: 120 });

        new Body(physics, { color: "white", shape: "circle", x: 5, y: 8 });
        new Body(physics, { color: "white", shape: "circle", x: 13, y: 8 });
        new Body(physics, { color: "white", shape: "circle", x: 8, y: 3 });
        new Body(physics, { color: "white", shape: "circle", radius: 1, x: 4, y: 2 });

        new Body(physics, { color: "white", shape: "polygon",
            points: [ { x: 0, y: 0 }, { x: 0, y: 4 },{ x: -10, y: 0 }   ],
            x: 20, y: 5 });


        // Loop the game
        requestAnimationFrame(function () {
            APP.ENGINE.gameLoop( physics );
        });

        // expose world to APP object
        APP.GAME.extend({
           canvas: this.options.canvas,
           context: this.options.context,
           physics: physics
        });


        return this;

    };

    World.prototype.addBodies = function ( bodies, physics ) {

        if ( !_.isArray( bodies ) ) {
            return false;
        }
        physics = physics || APP.GAME.psysics;

        _.each(bodies, function ( body ) {
           new APP.ENGINE.Body( physics, body );
        });

    };

    World.prototype.draw = function () {
    return this;
        var canvas = this.options.canvas,
            ctx = this.options.context;

        // draw background
        ctx.fillStyle= this.options.background;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        this.resolve();

        return this;

    };

    World.prototype.resolve = function () {
        this.promise.done(null, this);
    };


    return World;


});
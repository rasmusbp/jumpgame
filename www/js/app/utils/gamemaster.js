/*
 * Gamemaster object.
 * Keeps track on game progress, points etc.
 */


define(['lodash'],

    function( _ ) {

        'use strict';

        var o = {

            GAME_ID: 'JUMPGAME_BY_BANGSTED',

            init: function () {

                this.statusObj = this.fetchStatus() || this.statusObj;
                return this;
            },

            // Fixed status indicators of the game
            statusObj: {
                level: 0,
                points: 0
            },

            /*
             * Set or get status locally
             */
            status: function ( key, status ) {

                if ( !key || !_.has(this.statusObj, key ) ) {
                    return false; // only set/get fixed status indicators
                }

                if ( status ) {
                    this.statusObj[key] = status;
                } else {
                    return this.statusObj[key];
                }

            },

            /*
             * Fetch the game's status
             */
            fetchStatus: function () {
                if ( Modernizr.localstorage && localStorage[this.GAME_ID]  ) {
                    var string = localStorage.getItem(this.GAME_ID);
                    return JSON.parse(string);
                } else {
                    return false;
                }
            },

            /*
             * Save the game's status
             */
            saveStatus: function () {

                if ( Modernizr.localstorage ) {
                    localStorage.setItem(this.GAME_ID, JSON.stringify( this.statusObj ));
                }

                return this;
            },

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

            }
        };

        return o;

    }
);
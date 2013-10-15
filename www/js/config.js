/**
 *
 * RequireJS file paths and shim config.
 *
 *
 * The build will inline common dependencies into this file.
 * File paths will be used for other module packages too, as defined in build.js.
 *
 *
 * More info            https://github.com/jrburke/r.js/blob/master/build/example.build.js
 *                      https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project
 *                      https://github.com/tbranyen/backbone-boilerplate
 *                      https://github.com/requirejs/example-multipage-shim
 *
 * @author Aki Karkkainen - adapted from https://github.com/requirejs/example-multipage-shim
 * @url https://github.com/akikoo/grunt-frontend-workflow
 * Twitter: http://twitter.com/akikoo
 *
 */

require.config({

    paths: {


        // Global APP object
        APP: 'app/utils/app',

        // Core libraries.
        jquery: 'lib/jquery/jquery',
        lodash: 'lib/lodash/dist/lodash',
        Box2D: 'lib/box2dweb/Box2dWeb-2.1.a.3',
        promise: 'external/promise',

        // Plugins.
        text : 'lib/requirejs-text/text',


        // View folder.
        views: 'app/views'

    },
    shim: {
        Box2D: {
            exports: 'Box2D'
        }
    }

});

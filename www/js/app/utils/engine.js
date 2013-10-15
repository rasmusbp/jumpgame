/*
 * Engine object
 * Exposes an API of the Box2D library
 */

define(['APP', 'Box2D'], function ( APP, Box2D ) {


    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var o = {

        lastFrame: new Date().getTime(),

        gameLoop: function ( physics ) {
            var tm = new Date().getTime();
            requestAnimationFrame(function (){
                o.gameLoop( physics );
            });
            var dt = (tm - o.lastFrame) / 1000;
            if(dt > 1/15) { dt = 1/15; }
            physics.step(dt);
            o.lastFrame = tm;
        },

        Physics: function ( element, scale ) {
            var gravity = new b2Vec2(0,9.8);
            this.world = new b2World(gravity, true);
            this.element = element;
            this.context = element.getContext("2d");
            this.scale = scale || 30;
            this.dtRemaining = 0;
            this.stepAmount = 1/60;
        },

        Body: function ( physics, details ) {

            this.details = details = details || {};

            // Create the definition
            this.definition = new b2BodyDef();

            // Set up the definition
            for (var k in this.definitionDefaults) {
                this.definition[k] = details[k] || this.definitionDefaults[k];
            }
            this.definition.position = new b2Vec2(details.x || 0, details.y || 0);
            this.definition.linearVelocity = new b2Vec2(details.vx || 0, details.vy || 0);
            this.definition.userData = this;
            this.definition.type = details.type == "static" ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;

            // Create the Body
            this.body = physics.world.CreateBody(this.definition);

            // Create the fixture
            this.fixtureDef = new b2FixtureDef();
            for (var l in this.fixtureDefaults) {
                this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
            }


            details.shape = details.shape || this.defaults.shape;

            switch (details.shape) {
                case "circle":
                    details.radius = details.radius || this.defaults.radius;
                    this.fixtureDef.shape = new b2CircleShape(details.radius);
                    break;
                case "polygon":
                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsArray(details.points, details.points.length);
                    break;
                case "block":
                default:
                    details.width = details.width || this.defaults.width;
                    details.height = details.height || this.defaults.height;

                    this.fixtureDef.shape = new b2PolygonShape();
                    this.fixtureDef.shape.SetAsBox(details.width / 2,
                        details.height / 2);
                    break;
            }

            this.body.CreateFixture(this.fixtureDef);

        }
    };

    // ===========================================
    // Physics prototypes
    // ===========================================
    o.Physics.prototype.step = function ( dt ) {
        this.dtRemaining += dt;

        while (this.dtRemaining > this.stepAmount) {
            this.dtRemaining -= this.stepAmount;
            this.world.Step(this.stepAmount,
                8, // velocity iterations
                3); // position iterations
        }
        if (this.debugDraw) {
            this.world.DrawDebugData();
        } else {
            this.context.clearRect(0, 0, this.element.width, this.element.height);

            var obj = this.world.GetBodyList();

            this.context.save();
            this.context.scale(this.scale, this.scale);
            while (obj) {
                var body = obj.GetUserData();
                if (body) {
                    body.draw(this.context);
                }

                obj = obj.GetNext();
            }
            this.context.restore();
        }
    };
    o.Physics.prototype.debug = function() {
        this.debugDraw = new b2DebugDraw();
        this.debugDraw.SetSprite(this.context);
        this.debugDraw.SetDrawScale(this.scale);
        this.debugDraw.SetFillAlpha(0.3);
        this.debugDraw.SetLineThickness(1.0);
        this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(this.debugDraw);
    };

    // ===========================================
    // Body prototypes
    // ===========================================
    o.Body.prototype.defaults = {
        shape: "block",
        width: 2,
        height: 2,
        radius: 1
    };

    o.Body.prototype.fixtureDefaults = {
        density: 2,
        friction: 0.5,
        restitution: 0.5
    };

    o.Body.prototype.definitionDefaults = {
        active: true,
        allowSleep: true,
        angle: 0,
        angularVelocity: 0,
        awake: true,
        bullet: false,
        fixedRotation: false
    };
    o.Body.prototype.draw = function (context) {
        var pos = this.body.GetPosition(),
            angle = this.body.GetAngle();

        // Save the context
        context.save();

        // Translate and rotate
        context.translate(pos.x, pos.y);
        context.rotate(angle);


        // Draw the shape outline if the shape has a color
        if (this.details.color) {
            context.fillStyle = this.details.color;

            switch (this.details.shape) {
                case "circle":
                    context.beginPath();
                    context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
                    context.fill();
                    break;
                case "polygon":
                    var points = this.details.points;
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for (var i = 1; i < points.length; i++) {
                        context.lineTo(points[i].x, points[i].y);
                    }
                    context.fill();
                    break;
                case "block":
                    context.fillRect(-this.details.width / 2, -this.details.height / 2,
                        this.details.width,
                        this.details.height);
                default:
                    break;
            }
        }

        // If an image property is set, draw the image.
        if (this.details.image) {
            context.drawImage(this.details.image, -this.details.width / 2, -this.details.height / 2,
                this.details.width,
                this.details.height);

        }

        context.restore();

    };

    return o;
});
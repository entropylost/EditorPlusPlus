# Map Format

```js
{
    v: Boolean, // ???
    s: { // Settings
        re: Boolean, // ???
        nc: Boolean, // ???
        pq: Number, // ???
        gd: Number, // ???
    },
    physics: {
        shapes: [
            {
                type: 'bx', // Box
                w: Number,
                h: Number,
                c: [Number, Number], // Center
                a: Number, // Angle (In Radians)
                sk: Boolean, // Shrink
            } |
            {
                type: 'po', // Polygon
                v: [[Number, Number]], // Vertixes
                s: Number, // Scale
                a: Number, // Angle (In Radians)
                c: [Number, Number], // Center
            } |
            {
                type: "ci", // Circle
                r: Number, // Radius
                c: [Number, Number], // Center
                sk: Boolean, // Shrink
            },
        ],
        fixtures: [
            {
                sh: 0,
                n: String, // Name
                fr: null | Number, // Friction
                fp: null | Boolean, // Player Friction
                re: null | Number, // Bouncyness
                de: null | Number, // Density
                f: Number, // Color
                d: Boolean, // Death
                np: Boolean, // No Physics
            },
        ],
        bodies: [
            {
                type: 's' | 'd' | 'k', // Type of object,
                // 's' = stationary, 'd' = moving, 'k' = kinematic
                n: String, // Name
                p: [Number, Number], // Position
                a: Number, // Angle
                fric: Number, // Friction
                fricp: Boolean, // Friction Player
                re: Number, // Bouncyness
                de: Number, // Density
                lv: [Number, Number], // Linear Velocity
                av: Number, // Angle Velocity
                ld: Number, // Linear Drag
                ad: Number, // Angle Drag
                fr: Boolean,
                bu: Boolean,
                cf: { // Forces
                    x: Number, // X-Force
                    y: Number, // Y-Force
                    w: Boolean, // Force is Absolute
                    ct: Number, // Torque
                },
                fx: [Number], // Fixtures
                f_c: Number, // Layer
                f_p: Boolean, // Collide with Player
                f_1: Boolean, // Collide with Layer 1
                f_2: Boolean, // Collide with Layer 2
                f_3: Boolean, // Collide with Layer 3
                f_4: Boolean, // Collide with Layer 4
            },
        ],
        bro: [Number], // I think this is the relation between the actual
        // location of the body and the place of the body in the array.
        joints: [
            {
                type: 'lpj',
                d: {
                    cc: Boolean, // ???
                    bf: Number, // Break Force
                    dl: Boolean, // Draw Line
                },
                ba: Number, // Body Applied To (First)
                bb: Number, // Body Applied To (Second)
                pax: Number, // Path Accelleration X?
                pay: Number, // Path Accelleration Y?
                pa: Number, // Path Angle (Rad)
                pf: Number, // Path Force
                pl: Number, // ???
                pu: Number, // ???
                plen: Number, // Path Length
                pms: Number, // Max Movement Speed
            },
        ],
        ppm: Number, // Size of the player
    },
    spawns: [
        {
            x: Number,
            y: Number,
            xv: Number,
            yv: Number,
            priority: Number,
            r: Boolean, // Red
            f: Boolean, // FFA
            b: Boolean, // Blue
            gr: Boolean, // Green
            ye: Boolean, // Yellow
            n: String, // Name of spawn
        }
    ],
    capZones: [
        {
            n: String, // Name of Capture Zone
            ty: Number, // Type of Capture Zone
            l: Number, // Time it takes to capture
            i: Number, // Number of the fixture its assigned to.
        }
    ],
    m: {
        a: String, // Author (Latest)
        n: String, // Name
        dbv: Number, // ???
        dbid: Number, // ???
        authid: Number, // Some sort of authorization thingy
        date: String, // Date of map creation time
        rxn: String, // Name of original map
        rxa: String, // Name of original Author
        rxdb: Number, // ???
        cr: [String], // Contributors
        pub: Boolean, // Public
        mo: String, // Which mode to play on
        vu: Number, // I think this is amount of upvotes on original
    }
}
```


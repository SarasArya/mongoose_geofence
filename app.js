var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assert = require('assert');

console.log('\n===========');
console.log('    mongoose version: %s', mongoose.version);
console.log('========\n\n');

var dbname = 'testing_geojsonPoint';
mongoose.connect('localhost', dbname);
mongoose.connection.on('error', function() {
    console.error('connection error', arguments);
});

// schema

var schema = new Schema({
    loc: {
        type: {
            type: String
        },
        coordinates: []
    },
     radius : {
      type : 'Number'
     }
});
schema.index({
    loc: '2dsphere'
});
var A = mongoose.model('A', schema);

// mongoose.connection.on('open', function() {
//     A.on('index', function(err) {
//         if (err) return done(err);
//         A.create({
//             loc: {
//                 type: 'Polygon',
//                 coordinates: [
//                     [
//                         [77.69866, 13.025621],
//                         [77.69822, 13.024999, ],
//                         [77.699314, 13.025025, ],
//                         [77.69866, 13.025621]
//                     ]
//                 ]
//             }
//         }, function(err) {
//             if (err) return done(err);
//             A.find({
//                 loc: {
//                     $geoIntersects: {
//                         $geometry: {
//                             type: 'Point',
//                             coordinates: [77.69979,13.02593]
//                         }
//                     }
//                 }
//             }, function(err, docs) {
//                 if (err) return done(err);
//                 console.log(docs);
//                 done();
//             });
//         });
//     });
// });

mongoose.connection.on('open', function() {
    A.on('index', function(err) {
        if (err) return done(err);
        A.create({
            loc: {
                type: 'Point',
                coordinates: [77.698027,13.025292],
            },
            radius : 115.1735664276843
        }, function(err, docs) {
            if (err) return done(err);
            A.find({
                loc: {
                    $geoNear: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [77.69735,13.02489]
                        },
                        $maxDistance :docs.radius
                    }
                }
            }, function(err, docs) {
                if (err) return done(err);
                console.log(docs);
                done();
            });
        });
    });
});

function done(err) {
    if (err) console.error(err.stack);
    mongoose.connection.db.dropDatabase(function() {
        mongoose.connection.close();
    });
}

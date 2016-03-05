/*

Design note:
  It felt wrong to compute the transformation with each pointer move
  by having the previous, only slightly different set of pointers as domain.
  These microtransformations might cause inaccurate transformations.
  However, I did not try them.

Algorithm:
  Gesture is divided to subgestures. Arriving or leaving pointer ends
  a subgesture and starts another one.
  Element has a set of touches, so each interactive element has own
  gesture handler.
  The touches move.
  For each move, we estimate transformation for the pointers from
  the beginning of the subgesture.
  Subgesture train builds a total transformation.
  We store the initial transformation of the interactive object and
  multiply the gesture's current total transformation with it.
  As the gesture ends, we commit the total transformation to the object,
  forget the initial transformation and  we permanently transform the object.

Future notes:
  How to allow a coder to program how input changes the space?
  Taa is under manipulation: that could be an explicit state.

  MDN:
  Touch.target points to the element where the touch point started from.

*/

var TouchHandler = require('./TouchHandler');

var container = document.getElementById('space');
var space = new taaspace.Space();
var view = new taaspace.HTMLSpaceView(space, container);

var star = new taaspace.Taa('img/chellah_star.jpg');
var knot = new taaspace.Taa('img/marrakech_knot.jpg');
var msun = new taaspace.Taa('img/marrakech_sun.jpg');
var saic = new taaspace.Taa('img/marrakech_mosaic.jpg');
var sand = new taaspace.Taa('img/rabat_sand.jpg');

var spacestar = space.add(star);
var spaceknot = space.add(knot);
var spacemsun = space.add(msun);
var spacesaic = space.add(saic);
var spacesand = space.add(sand);

var c = space.at([0,0]);
var putOnCircle = function (spacetaa, i) {
  var rads = i * 2 * Math.PI / 5 - (Math.PI / 5);
  var midn = spacetaa.atMidN();
  var mids = spacetaa.atMidS();
  var offn = c.polarOffset(1.382, rads);
  var offs = c.polarOffset(0.382, rads);
  spacetaa.translateScaleRotate([midn, mids], [offn, offs]);
};

putOnCircle(spacestar, 0);
putOnCircle(spaceknot, 1);
putOnCircle(spacemsun, 2);
putOnCircle(spacesaic, 3);
putOnCircle(spacesand, 4);

view.translateScale(
  [view.atNW(), view.atSE()],
  [space.at([-3,-3]), space.at([3,3])]
);

(function makeSpaceTransformable() {
  var hand = new TouchHandler(container);
  var elTr;
  hand.on('start', function () {
    // Store the initial transformation from view to space.
    elTr = view.getTransform();
  });
  hand.on('move', function (transformOnView) {
    // A safety feature to protect from invalid TouchAPI implementations.
    if (elTr === null) { return; }
    // We get a new transformation on view: transformOnView
    // See note 2016-03-05-12
    //   Given transformation H_view on view and we want
    //   to apply it so that it looks that whole space is moving:
    //      V_hat = V * inv(H_view)
    //   Where V is the original view coordinate transformation.
    var tOV = transformOnView;
    var finalTr = elTr.multiplyBy(tOV.inverse());
    // Apply it.
    view.setTransform(finalTr);
  });
  hand.on('end', function () {
    // We do not need the initial transformation anymore.
    elTr = null;
  });
}());

var makeSpaceTaaTransformable = function (spacetaa) {
  var el = view.getElementBySpaceTaa(spacetaa);
  var hand = new TouchHandler(el);
  var elTr;
  hand.on('start', function () {
    // Store the initial transformation from taa to space.
    elTr = spacetaa.getTransform();
  });
  hand.on('move', function (transformOnView) {
    // A safety feature to protect from invalid TouchAPI implementations.
    if (elTr === null) { return; }
    // We get a new transformation on view.
    var tOV = transformOnView;
    // See note 2016-03-05-11:
    //   To apply transformation H_view to space object:
    //     T_hat = V * H_view * inv(V) * T
    //
    var vT = view.getTransform();
    var tOS = vT.multiplyBy(tOV).multiplyBy(vT.inverse());
    // We combine it with the initial coord. transf. of spaceTaa.
    var finalTr = tOS.multiplyBy(elTr);
    // Apply it.
    spacetaa.setTransform(finalTr);
  });
  hand.on('end', function () {
    // We do not need the initial transformation anymore.
    elTr = null;
  });
};

makeSpaceTaaTransformable(spacestar);
makeSpaceTaaTransformable(spaceknot);
makeSpaceTaaTransformable(spacemsun);
makeSpaceTaaTransformable(spacesaic);
makeSpaceTaaTransformable(spacesand);

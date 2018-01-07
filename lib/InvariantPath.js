//
// Plane-invariant path.
//
var InvariantVector = require('./InvariantVector')
var Path = require('./Path')

var InvariantPath = function (p, plane) {
  // Example
  //   var ip = new taaspace.InvariantPath(p, plane)
  //
  // Parameter
  //   p (optional, default to empty Path())
  //     a Path, a two-dimensional collection of Vectors
  //   plane (optional, defaults to Space)
  //     a SpacePlane
  //       an item in space, enabling coord projections.
  //
  if (typeof p === 'undefined') {
    this._p = new Path()
  } else if (typeof plane === 'undefined') {
    this._p = p
  } else {
    this._p = p.transform(plane.getGlobalTransform().toSpace())
  }
}

var proto = InvariantPath.prototype

proto.add = function (ip) {
  // Create a new InvariantPath by concatenating this and ipa.
  //
  // Parameters
  //   ipa
  //     an InvariantPath
  //
  // Return
  //   an InvariantPath
  //
  return new InvariantPath(this._p.add(ip._p))
}

proto.bottom = function () {
  return new InvariantVector(this._p.bottom())
}

proto.getBounds = function () {
  return new InvariantPath(this._p.bounds())
}

proto.equals = function (ipa) {
  // Return true if paths match.
  return this._p.equals(ipa._p)
}

proto.getHull = function () {
  // Return convex hull of the invariant path
  return new InvariantPath(this._p.hull())
}

proto.left = function () {
  return new InvariantVector(this._p.left())
}

proto.right = function () {
  return new InvariantVector(this._p.right())
}

proto.to = function (plane) {
  // Represent the path on the target coordinate plane.
  //
  // Parameters
  //   plane: a SpacePlane
  //
  // Return
  //   a Path
  //
  if (plane === null || plane.isRoot()) {
    return this._p
  }

  // Transformation from space to the target plane
  var tr = plane.getGlobalTransform().toSpace().inverse()
  return this._p.transform(tr)
}

proto.toArray = function () {
  // Return array of InvariantVectors
  return this._p.toArray().map(function (vec) {
    return new InvariantVector(vec)
  })
}

proto.top = function () {
  return new InvariantVector(this._p.top())
}

proto.toSpace = function () {
  // Represent the vector on the space coordinate plane.
  //
  // Return
  //   a Vector.
  //
  return this._p
}

proto.transform = function (itr) {
  // Create a new InvariantPath by transforming this
  // by invariant transformation.
  //
  // Parameters
  //   itr
  //     an InvariantTransform
  //
  // Return
  //   an InvariantPath
  return new InvariantPath(this._p.transform(itr.toSpace()))
}

module.exports = InvariantPath
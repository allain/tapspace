/*jshint expr: true*/ // prevent error in ...be.a.Function

describe('taaspace', function () {

  it('should have submodules', function () {
    taaspace.should.have.keys('Taa', 'Space', 'HTMLSpaceView',
      'version');
  });

  describe('Taa', function () {
    it('should fire "loaded" event', function (done) {
      var taa = new taaspace.Taa('assets/taa.png');
      taa.on('loaded', function (err, taa2) {
        should.equal(err, null);
        taa2.image.should.equal(taa.image);
        done();
      });
    });
  });

  describe('HTMLSpaceView', function () {
    var space;
    var view;

    beforeEach(function () {
      var cont = document.getElementById('taaspace-sandbox');
      cont.innerHTML = '';
      space = new taaspace.Space();
      view = new taaspace.HTMLSpaceView(space, cont);
    });

    it('should be able to create an img element immediately', function () {
      var taa = new taaspace.Taa('assets/taa.png');
      var spacetaa = space.add(taa);
      var el = $('img.taaspace-taa');
      el.should.exist;
      var st2 = view.getSpaceTaaByElementId(el.attr('id'));
      st2.should.equal(spacetaa);
    });
  });


  /*
  describe('SpaceTaa', function () {
    var space, view, taa;

    beforeEach(function (done) {
      var cont = document.getElementById('taaspace-sandbox');
      cont.innerHTML = '';
      space = new taaspace.Space();
      view = new taaspace.HTMLSpaceView(space, cont);
      taa = new taaspace.Taa('assets/taa.png', done);
    });

    it('should have an id', function () {
      var a = space.add(taa);
      var b = space.add(taa);
      a.should.have.property('id');
      a.id.should.be.a.String;
      b.id.should.be.a.String;
      a.id.should.not.equal(b.id);
    });

    it('should be removable', function () {
      var a = space.add(taa);
      a.remove();
      space.content.hasOwnProperty(a.id).should.equal(false);
    });

    it('should be able to return a SpacePoint', function () {
      var a = space.add(taa);
      var p = a.at(new taaspace.Vector2D(1, 1));
      var vp = p.projectTo(view);
      var epsilon = 0.01;
      var val = 256;
      vp.xy.x.should.be.within(val - epsilon, val + epsilon);
      vp.xy.y.should.be.within(val - epsilon, val + epsilon);
    });

    it('should be transformable', function () {
      var a = space.add(taa);
      var r180o = (new taaspace.Matrix2D()).rotate(Math.PI);
      a.transformBy(r180o);
      var p = a.at(new taaspace.Vector2D(1, 1));
      var vp = p.projectTo(view);
      var epsilon = 0.01;
      var val = -256;
      vp.xy.x.should.be.within(val - epsilon, val + epsilon);
      vp.xy.y.should.be.within(val - epsilon, val + epsilon);
    });
  });*/

});

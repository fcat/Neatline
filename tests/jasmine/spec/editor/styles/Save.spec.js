
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Styles save tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

describe('Styles Save', function() {


  var els;


  beforeEach(function() {

    _t.loadEditor();

    els = {
      setFocus: _t.vw.styles.$('a[name="set-focus"]'),
      save:     _t.vw.styles.$('a[name="save"]')
    };

  });


  it('should populate default focus and zoom', function() {

    // --------------------------------------------------------------------
    // When the "Use Current Viewport as Default" button is clicked, the
    // default focus and zoom inputs should be populated.
    // --------------------------------------------------------------------

    _t.setMapCenter(1, 2, 3);
    els.setFocus.trigger('click');

    // Inputs should be updated.
    expect(_t.vw.styles.__ui.mapFocus).toHaveValue('1,2');
    expect(_t.vw.styles.__ui.mapZoom).toHaveValue(3);

    // Model should be updated.
    expect(_t.vw.styles.exhibit.get('map_focus')).toEqual('1,2');
    expect(_t.vw.styles.exhibit.get('map_zoom')).toEqual('3');

  });


  it('should issue PUT request when "Save" is clicked', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked, a well-formed PUT request should
    // be issued to the exhibit API with the new data.
    // --------------------------------------------------------------------

    _t.vw.styles.editor.setValue('1');
    _t.vw.styles.__ui.mapFocus.val('2').trigger('change');
    _t.vw.styles.__ui.mapZoom. val('3').trigger('change');

    // Click "Save" button.
    els.save.trigger('click');

    // Route should be /neatline/put/:id, method PUT.
    _t.assertLastRequestRoute(Neatline.global.exhibit_put);
    _t.assertLastRequestMethod('PUT');

    // Check query string values.
    var params = _t.getLastRequestParams();
    expect(params.styles).toEqual('1');
    expect(params.map_focus).toEqual('2');
    expect(params.map_zoom).toEqual('3');

  });


  it('should flash a notification when the save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request is successful, a
    // success notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'info');

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    // `toastr` should be called.
    expect(toastr.info).toHaveBeenCalledWith(
      STRINGS.exhibit.save.success, null, _t.vw.editor.options.toastr
    );

  });


  it('should flash a notification when the save fails', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request fails, a failure
    // notification should be displayed.
    // --------------------------------------------------------------------

    // Spy on toaster.
    spyOn(toastr, 'error');

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast500();

    // `toastr` should be called.
    expect(toastr.error).toHaveBeenCalledWith(
      STRINGS.exhibit.save.error, null, _t.vw.editor.options.toastr
    );

  });


  it('should update the map when save succeeds', function() {

    // --------------------------------------------------------------------
    // When the "Save" button is clicked and the request succeeds, the map
    // should be automatically refreshed to manifest the new styles.
    // --------------------------------------------------------------------

    // Click on "Save".
    els.save.trigger('click');
    _t.respondLast200('');

    _t.assertMapRefreshed();

  });


});
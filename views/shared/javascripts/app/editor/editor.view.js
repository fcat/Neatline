
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Editor layout manager.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor', { startWithParent: false,
  define: function(Editor, Neatline, Backbone, Marionette, $, _) {


  Editor.View = Backbone.Neatline.View.extend({


    ui: {
      exhibit:  '#neatline',
      map:      '#neatline-map',
      editor:   '#editor'
    },


    /**
     * Get ui, store default editor width, listen for window resize.
     */
    initialize: function() {

      this.getUi();

      // Cache starting width.
      this.width = this.ui.editor.width();

      // Listen for resize.
      this.window = $(window);
      this.window.resize(_.bind(this.position, this));
      this.window.trigger('resize');

    },


    /**
     * Fit the exhibit and editor to fill the screen.
     */
    position: function() {

      // Measure window.
      var h = this.window.height();
      var w = this.window.width();

      this.ui.editor.    css({ height: h, width: this.width });
      this.ui.map.       css({ height: h, width: w - this.width });
      this.ui.exhibit.   css({ left: this.width });

    }


  });


}});
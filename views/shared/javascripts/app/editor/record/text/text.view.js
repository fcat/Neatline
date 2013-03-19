
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Text tab form.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Record.Text', { startWithParent: false,
  define: function(Text, Neatline, Backbone, Marionette, $, _) {


  Text.View = Backbone.Neatline.View.extend({


    events: {
      'shown ul.nav a': 'onTabChange',
    },

    ui: {
      itemTitle:  'input[name="item-title"]',
      itemId:     'input[name="item-id"]'
    },


    /**
     * Instantiate Chosen.
     */
    onTabChange: function() {

    }


  });


}});
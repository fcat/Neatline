
/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Menu public API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

Neatline.module('Editor.Exhibit.Menu', function(
  Menu, Neatline, Backbone, Marionette, $, _) {


  Menu.NS = 'editor:exhibit:menu';


  /**
   * Append the menu to a container.
   *
   * @param {Object} container: The container element.
   */
  var display = function(container) {
    Menu.__view.showIn(container);
  };
  Neatline.commands.addHandler(Menu.NS+':display', display);


  /**
   * Set the active tab.
   *
   * @param {String} tab: The tab to activate.
   */
  var activateTab = function(tab) {
    Menu.__view.activateTab(tab);
  };
  Neatline.commands.addHandler(Menu.NS+':activateTab', activateTab);


});

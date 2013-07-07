<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapImageLayer extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function testExhibit()
    {

        $exhibit = $this->_exhibit();
        $exhibit->image_layer = NL_TEST_DIR.'/mocks/image.jpg';
        $exhibit->save();

        $this->_writeExhibitMarkupFixture(
            $exhibit, 'NeatlineMapImageLayer.exhibit.html'
        );

    }


}
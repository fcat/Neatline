<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapInitDefaultFocus extends Neatline_Case_Fixture
{


    public function testExhibit()
    {

        $this->exhibit->spatial_layer = 'OpenStreetMap';
        $this->exhibit->map_focus = '1,2';
        $this->exhibit->map_zoom = 10;
        $this->exhibit->save();

        $this->_writeExhibitMarkupFixture($this->exhibit,
            'NeatlineMapInitDefaultFocus.html'
        );

    }


}

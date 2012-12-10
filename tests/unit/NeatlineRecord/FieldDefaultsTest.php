<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `__construct()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_FieldDefaults
    extends Neatline_Test_AppTestCase
{


    /**
     * __construct() should set foreign keys.
     */
    public function testFieldDefaults()
    {

        // Create a record.
        $item = $this->__item();
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord($item, $neatline);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * If null is passed for the $item parameter to __construct(), the
     * record should not be associated with any item.
     */
    public function testFieldDefaultsWithNoParentItem()
    {

        // Create a record.
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord(null, $neatline);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->item_id, null);

    }


}
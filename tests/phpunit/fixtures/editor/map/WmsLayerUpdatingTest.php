<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorMapWmsLayerUpdating extends Neatline_Case_Fixture
{


    public function testAdd()
    {

        $record = $this->_record($this->exhibit);
        $record->title = 'title';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.add.recordsNoWms.json'
        );

        $record->wms_address = 'address';
        $record->wms_layers  = 'layers';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.add.recordsWms.json'
        );

        $this->_writeRecordApiFixture($record,
            'EditorMapWmsLayerUpdating.add.recordWms.json'
        );

    }


    public function testReload()
    {

        $record = $this->_record($this->exhibit);
        $record->title        = 'title';
        $record->wms_address  = 'address';
        $record->wms_layers   = 'layers';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.reload.records.json'
        );

        $this->_writeRecordApiFixture($record,
            'EditorMapWmsLayerUpdating.reload.record.json'
        );

    }


    public function testUpdate()
    {

        $record = $this->_record($this->exhibit);
        $record->title        = 'title';
        $record->wms_address  = 'address1';
        $record->wms_layers   = 'layers1';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.update.records1.json'
        );

        $record->wms_address  = 'address2';
        $record->wms_layers   = 'layers2';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.update.records2.json'
        );

        $this->_writeRecordApiFixture($record,
            'EditorMapWmsLayerUpdating.update.record2.json'
        );

    }


    public function testRemove()
    {

        $record = $this->_record($this->exhibit);
        $record->title        = 'title';
        $record->wms_address  = 'address';
        $record->wms_layers   = 'layers';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.remove.records1.json'
        );

        $record->wms_address  = null;
        $record->wms_layers   = null;
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapWmsLayerUpdating.remove.records2.json'
        );

        $this->_writeRecordApiFixture($record,
            'EditorMapWmsLayerUpdating.remove.record2.json'
        );

    }


}
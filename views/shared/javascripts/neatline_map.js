/**
 * Component widget that controls the map. Instantiated by the parent Neatline
 * widget.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

(function($, undefined) {

  'use strict';

    $.widget('neatline.neatlinemap', {

        options: {

            mode: 'edit',
            wkt_delimiter: '|',

            // Markup hooks.
            markup: {
                toolbar_class: 'olControlEditingToolbar'
            },

            // Animation constants.
            animation: {
                fade_duration: 500
            },

            // Hexes.
            colors: {
                neatline_purple: '#724E85',
                highlight_red: '#d04545'
            },

            styles: {
                vector_color: '#ffb80e',
                stroke_color: '#ea3a3a',
                highlight_color: '#ff0000',
                vector_opacity: 0.4,
                stroke_opacity: 0.6,
                stroke_width: 1,
                point_radius: 6
            }

        },

        /*
         * Grab the Neatline global, shell out trackers, startup.
         */
        _create: function() {

            var self = this;

            // Getters.
            this._window = $(window);

            // Trackers and buckets.
            this._db =                      TAFFY();
            this._currentVectorLayers =     [];
            this._currentEditItem =         null;
            this._currentEditLayer =        null;
            this._hoveredFeature =          null;
            this._clickedFeature =          null;
            this.record =                   null;
            this.requestData =              null;

            // Construct image-based map.
            if (Neatline.record.image_id) {
                this._instantiateImageMap();
            }

            // Construct geography-based map.
            else {
                this._instantiateRealGeographyMap();
            }

            // Start-up.
            this.loadData();

        },

        /*
         * Initialize a map with real-geography base-layer.
         */
        _instantiateRealGeographyMap: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = 'transparent';
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';

            var tiled;
            var pureCoverage = true;

            // Pink tile avoidance.
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;

            // Make OL compute scale according to WMS spec.
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Set tile image format.
            var format = 'image/png';
            if (pureCoverage) {
                format = 'image/png8';
            }

            // Build the default bounds array.
            var bounds = new OpenLayers.Bounds(
                -8344149.6594826,
                4855703.4254752,
                -8119424.7963554,
                5104888.1376502
            );

            // Starting options.
            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation(),
                  new OpenLayers.Control.LayerSwitcher()
                ],
                maxResolution: 'auto',
                units: 'm'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            // Construct the base layers.
            var layers = this._getBaseLayers();

            // Push the base layers onto the map, set default.
            this.map.addLayers(layers);
            this._setDefaultLayer();

            if (! this.setViewport(
                Neatline.record.default_map_bounds, Neatline.record.default_map_zoom
            )) {
                // Google.v3 uses EPSG:900913 as projection, so we have to
                // transform our coordinates
                this.map.setCenter(new OpenLayers.LonLat(10.2, 48.9).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    this.map.getProjectionObject()
                ), 5);
            }

        },

        /*
         * Initialize an image-based map.
         */
        _instantiateImageMap: function() {

            // Set OL global attributes.
            OpenLayers.IMAGE_RELOAD_ATTEMTPS = 3;
            OpenLayers.Util.onImageLoadErrorColor = 'transparent';
            OpenLayers.ImgPath = 'http://js.mapbox.com/theme/dark/';
            OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;

            // Starting options.
            var options = {
                controls: [
                  new OpenLayers.Control.PanZoomBar(),
                  new OpenLayers.Control.MousePosition(),
                  new OpenLayers.Control.Navigation()
                ],
                maxResolution: 'auto'
            };

            // Instantiate the map.
            this.map = new OpenLayers.Map('map', options);

            // Build the bounds and size objects.
            var bounds = new OpenLayers.Bounds(0, 0, Neatline.image.width, Neatline.image.height);
            var size = new OpenLayers.Size(Neatline.image.width, Neatline.image.height);

            // Build the baselayer.
            this.baseLayer = new OpenLayers.Layer.Image(
                Neatline.image.name,
                Neatline.image.path,
                bounds,
                size,
                options
            );

            // Push the base layer onto the map.
            this.map.addLayers([this.baseLayer]);

            if (! this.setViewport(
                Neatline.record.default_map_bounds,
                Neatline.record.default_map_zoom
            )) {
                this.map.zoomToExtent(bounds);
            }

        },

        /*
         * Position the opacity slider, layer switcher, and zoom bar.
         */
        positionControls: function(top, left, width, height) {

            // Get containers, measure element.
            this.panZoomBar = this.element.find('.olControlPanZoomBar');
            this.layerSwitcher = this.element.find('.olControlLayerSwitcher');
            var containerWidth = this.element.width();
            var containerHeight = this.element.height();

            // Layer switcher.
            this.layerSwitcher.css({
                top: top+25,
                right: containerWidth-(left+width)
            });

            // Zoom bar.
            this.panZoomBar.css({
                top: top+10,
                left: left+10
            });

        },

        /*
         * Load the feature data.
         */
        loadData: function() {

            var self = this;

            // If there are existing click and highlight controls, destroy them.
            this._removeSelectControls();
            this._removeEditControls();

            // Clear existing vectors.
            _.each(this._currentVectorLayers, function(layer) {
                self.map.removeLayer(layer);
                layer.destroy();
            });

            // Remove existing WMS layers.
            _.each(this._wmsLayers, function(layer) {
                self.map.removeLayer(layer);
            });

            // Empty out the layers database.
            this._currentVectorLayers = [];
            this._wmsLayers = [];

            // Abort the request if it is running.
            if (this.requestData !== null) {
                this.requestData.abort();
            }

            // Hit the json server.
            this.requestData = $.ajax({

                url: Neatline.dataSources.map,
                dataType: 'json',

                success: function(data) {

                    // Build the new layers and add default click controls.
                    self._buildLayers(data);
                    self._addClickControls();

                    // If a layer was being edited before the save,
                    // make that layer the active edit layer again.
                    if (self._currentEditItem !== null) {
                        self.edit(self._currentEditItem, true);
                    }

                    // Set starting visibility.
                    self._setStartingVisibility();

                }

            });

        },

        /*
         * Construct geometry and WMS map layers.
         */
        _buildLayers: function(layers) {

            var self = this;

            // Instantiate database and associations objects.
            this._db = TAFFY();

            _.each(layers, function(item) {

                // Get float values for opacities.
                item.vector_opacity = item.vector_opacity / 100;
                item.stroke_opacity = item.stroke_opacity / 100;

                // Construct the style.
                var style = self._getStyleMap(
                    item.vector_color,
                    item.vector_opacity,
                    item.stroke_color,
                    item.stroke_opacity,
                    item.stroke_width,
                    item.point_radius,
                    item.highlight_color
                );

                // Build the layer.
                var vectorLayer = new OpenLayers.Layer.Vector(item.title, {
                    styleMap: style,
                    displayInLayerSwitcher: false
                });

                // Empty array to hold features objects.
                var features = [];

                // Build the features.
                if (!_.isNull(item.wtk)) {
                    $.each(item.wkt.split(self.options.wkt_delimiter), function(i, wkt) {

                        // Construct WKT format reader.
                        var reader = new OpenLayers.Format.WKT();

                        // Try to read valid wkt. If valid, build geometry.
                        if (!_.isUndefined(reader.read(wkt))) {
                            var geometry = new OpenLayers.Geometry.fromWKT(wkt);
                            var feature = new OpenLayers.Feature.Vector(geometry);
                            features.push(feature);
                        }

                    });
                }

                // Add the vectors to the layer.
                vectorLayer.addFeatures(features);
                vectorLayer.setMap(self.map);

                var wmsLayer = null;

                // If a WMS address is defined.
                if (!_.isNull(item.wmsAddress) && !_.isNull(item.layers)) {

                    // Build layer.
                    wmsLayer = new OpenLayers.Layer.WMS(
                        item.title,
                        item.wmsAddress,
                        {
                            layers: item.layers,
                            styles: '',
                            transparent: true,
                            format: 'image/png8',
                            tiled: false
                        },
                        {
                            buffer: 0,
                            displayOutsideMaxExtent: true,
                            isBaseLayer: false
                        }
                    );

                    // Track and add.
                    self._wmsLayers.push(wmsLayer);
                    self.map.addLayer(wmsLayer);

                }

                // Add the database record.
                self._db.insert({
                    itemid: item.item_id,
                    layerid: vectorLayer.id,
                    recordid: item.id,
                    slug: item.slug,
                    data: item,
                    layer: vectorLayer,
                    wms: wmsLayer
                });

                // Add to the layers array and add to map.
                self._currentVectorLayers.push(vectorLayer);
                self.map.addLayer(vectorLayer);

            });

        },

        /*
         * Listen for mouseenter and mousedown on the features.
         */
        _addClickControls: function() {

            var self = this;

            // If there are existing click and highlight controls, destroy them.
            this._removeSelectControls();

            // Highlight controller.
            this.highlightControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {

                hover: true,
                highlightOnly: true,
                renderIntent: 'temporary',

                overFeature: function(feature) {

                    // Get record.
                    var record = self._db({
                        layerid: feature.layer.id
                    }).first();

                    // Trigger out to the deployment code.
                    self._trigger('featureenter', {}, {
                        'record': record
                    });

                    // Render highlight.
                    self.highlightControl.highlight(feature);

                    self._hoveredFeature = feature;
                },

                outFeature: function(feature) {

                    // Get record.
                    var record = self._db({
                        layerid: feature.layer.id
                    }).first();

                    // Trigger out to the deployment code.
                    self._trigger('featureleave', {}, {
                        'record': record
                    });

                    // Render default.
                    self.highlightControl.unhighlight(feature);

                    self._hoveredFeature = null;
                }

            });

            // Click controller.
            this.clickControl = new OpenLayers.Control.SelectFeature(this._currentVectorLayers, {

                clickout: true,
                toggle: true,

                // When the feature is selected.
                onSelect: function(feature) {

                    // Get the record.
                    var record = self._db({
                        layerid: feature.layer.id
                    }).first();

                    // Capture clicked feature.
                    self._clickedFeature = feature;

                    // Trigger out to the deployment code.
                    self._trigger('featureclick', {}, {
                        'recordid': record.recordid,
                        'slug': record.data.slug
                    });

                    if (!_.isUndefined(self.modifyFeatures)) {
                        self.modifyFeatures.selectFeature(feature);
                    }

                },

                // When the feature is unselected.
                onUnselect: function(feature) {

                    if (!_.isUndefined(self.modifyFeatures)) {
                        self.modifyFeatures.unselectFeature(feature);
                    }

                },

                // Listen for mouseleave.
                callbacks: {
                    out: function() {
                        // self._hideTitleTip();
                    }
                }

            });

            this.highlightControl.handlers.feature.stopDown = false;
            this.clickControl.handlers.feature.stopDown = false;

            // Add and activate the highlight control.
            this.map.addControl(this.highlightControl);
            this.highlightControl.activate();

            // Add and activate the click control.
            this.map.addControl(this.clickControl);
            this.clickControl.activate();

        },

        /*
         * Remove all click controls.
         */
        _removeSelectControls: function() {

            if (!_.isUndefined(this.clickControl)) {
                this.map.removeControl(this.clickControl);
                this.clickControl.destroy();
                delete this.clickControl;
            }

            if (!_.isUndefined(this.highlightControl)) {
                this.map.removeControl(this.highlightControl);
                this.highlightControl.destroy();
                delete this.highlightControl;
            }

        },

        /*
         * Remove all edit controls.
         */
        _removeEditControls: function() {

            if (!_.isUndefined(this.editToolbar)) {
                this.map.removeControl(this.editToolbar);
                this.editToolbar.destroy();
                delete this.editToolbar;
            }

            if (!_.isUndefined(this.modifyFeatures)) {
                this.map.removeControl(this.modifyFeatures);
                this.modifyFeatures.destroy();
                delete this.modifyFeatures;
            }

        },

        /*
         * Set starting visibility.
         */
        _setStartingVisibility: function() {

            // Use default focus if present.
            if (Neatline.record.default_focus_date) {
                this.renderVisibility(Neatline.record.default_focus_date);
            }

            // Otherwise, use the current time.
            else {
                this.renderVisibility(Date.now());
            }

        },

        /*
         * Focus the map on the feature data for a given item.
         */
        zoomToItemVectors: function(id) {

            // Get the record out of the database.
            var record = this._db({ recordid: parseInt(id, 10) }).first();
            this._showRecord(record);

        },

        /*
         * Focus the map on the feature data for a given record identified
         * by its slug.
         */
        zoomToItemVectorsBySlug: function(slug) {

            // Get the record out of the database.
            var record = this._db({ slug: slug }).first();
            this._showRecord(record);

        },

        /*
         * Filter feature visibility by date.
         */
        renderVisibility: function(date) {

            // Moment-ify the date.
            var now = moment(date);

            // Walk records.
            this._db().each(function(record) {

                // Get record dates.
                var start = moment(record.data.start_visible_date);
                var end = moment(record.data.end_visible_date);

                // If both are defined.
                if (!_.isNull(start) && !_.isNull(end)) {
                    var display = now > start && now < end;
                    record.layer.setVisibility(display);
                    if (record.wms) record.wms.setVisibility(display);
                }

                // If just the start is defined.
                else if (!_.isNull(start) && _.isNull(end)) {
                    var display = now > start;
                    record.layer.setVisibility(display);
                    if (record.wms) record.wms.setVisibility(display);
                }

                // If just the end is defined.
                else if (_.isNull(start) && !_.isNull(end)) {
                    var display = now < end;
                    record.layer.setVisibility(display);
                    if (record.wms) record.wms.setVisibility(display);
                }

            });

        },

        /*
         * Focus the map on the feature data for a given record.
         */
        _showRecord: function(record) {

            // If the record exists and there is a map feature.
            if (record && record.layer.features.length > 0 && _.isNull(record.wms)) {
                var bounds = record.data.bounds || record.data.center;

                // Otherwise, just fit the vectors in the viewport.
                if (! this.setViewport(bounds, record.data.zoom)) {

                    // Get data extent.
                    var extent = record.layer.getDataExtent();

                    // If the extent is defined, focus on it.
                    if (!_.isNaN(extent.top)) {
                        this.map.zoomToExtent(record.layer.getDataExtent());
                    }

                }

            }

            // If the record has a WMS layer.
            if (!_.isNull(record.wms)) {
                this._resetWmsZIndices();
                record.wms.setZIndex(1);
            }

        },

        /*
         * Reset all of the z-indices on the WMS layers to 0.
         */
        _resetWmsZIndices: function() {

            _.each(this.wmsLayers, function(layer) {
                layer.setZIndex(0);
            });

        },

        /*
         * Construct a StyleMap object with a given color.
         */
        _getStyleMap: function(
            fillColor,
            fillOpacity,
            strokeColor,
            strokeOpacity,
            strokeWidth,
            pointRadius,
            highlightColor) {

            // Capture fill color.
            var fillColor = (!_.isUndefined(fillColor)) ? fillColor :
                this.options.styles.vector_color;

            // Capture fill opacity.
            var fillOpacity = (!_.isUndefined(fillOpacity)) ? fillOpacity :
                this.options.styles.vector_opacity;

            // Capture stroke color.
            var strokeColor = (!_.isUndefined(strokeColor)) ? strokeColor :
                this.options.styles.stroke_color;

            // Capture highlight color.
            var highlightColor = (!_.isUndefined(highlightColor)) ? highlightColor :
                Neatline.highlightColor;

            // Capture stroke opacity.
            var strokeOpacity = (!_.isUndefined(strokeOpacity)) ? strokeOpacity :
                this.options.styles.stroke_opacity;

            // Capture stroke width.
            var strokeWidth = (!_.isUndefined(strokeWidth)) ? strokeWidth :
                this.options.styles.stroke_width;

            // Capture point radius.
            var pointRadius = (!_.isUndefined(pointRadius)) ? pointRadius :
                this.options.styles.point_radius;

            // Construct and return the StyleMaps.
            return new OpenLayers.StyleMap({
                'default': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                }),
                'select': new OpenLayers.Style({
                    fillColor: fillColor,
                    fillOpacity: fillOpacity,
                    strokeColor: strokeColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                }),
                'temporary': new OpenLayers.Style({
                    fillColor: highlightColor,
                    fillOpacity: fillOpacity,
                    strokeColor: highlightColor,
                    strokeOpacity: strokeOpacity,
                    pointRadius: pointRadius,
                    strokeWidth: strokeWidth
                })
            });

        },

        /*
         * Construct the base layer objects, set default.
         */
        _getBaseLayers: function() {

            // OpenStreetMap.
            this.osm = new OpenLayers.Layer.OSM();

            // Google physical.
            this.gphy = new OpenLayers.Layer.Google(
                "Google Physical",
                {type: google.maps.MapTypeId.TERRAIN}
            );

            // Google streets.
            this.gmap = new OpenLayers.Layer.Google(
                "Google Streets",
                {numZoomLevels: 20}
            );

            // Google hybrid.
            this.ghyb = new OpenLayers.Layer.Google(
                "Google Hybrid",
                {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
            );

            // Google sattelite.
            this.gsat = new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
            );

            // Stamen watercolor
            this.stwc = new OpenLayers.Layer.OSM(
              'Stamen Watercolor',
              'http://tile.stamen.com/watercolor/${z}/${x}/${y}.jpg',
              { numZoomLevels: 19 }
            );

            // Stamen toner
            this.sttn = new OpenLayers.Layer.OSM(
              'Stamen Toner',
              'http://tile.stamen.com/toner/${z}/${x}/${y}.jpg',
              { numZoomLevels: 19 }
            );

            // Stamen terrain
            this.sttr = new OpenLayers.Layer.OSM(
              'Stamen Terrain',
              'http://tile.stamen.com/terrain/${z}/${x}/${y}.jpg',
              { numZoomLevels: 19 }
            );

            return [
              this.osm,
              this.gphy,
              this.gmap,
              this.ghyb,
              this.gsat,
              this.stwc,
              this.sttn,
              this.sttr
            ];

        },

        /*
         * Set the default base layer.
         */
        _setDefaultLayer: function() {

            // Set default.
            switch (Neatline.baseLayer.name) {

                case 'OpenStreetMap':
                    this.map.setBaseLayer(this.osm);
                break;

                case 'Google Physical':
                    this.map.setBaseLayer(this.gphy);
                break;

                case 'Google Streets':
                    this.map.setBaseLayer(this.gmap);
                break;

                case 'Google Hybrid':
                    this.map.setBaseLayer(this.ghyb);
                break;

                case 'Google Satellite':
                    this.map.setBaseLayer(this.gsat);
                break;

                case 'Stamen Watercolor':
                    this.map.setBaseLayer(this.stwc);
                break;

                case 'Stamen Toner':
                    this.map.setBaseLayer(this.sttn);
                break;

                case 'Stamen Terrain':
                    this.map.setBaseLayer(this.sttr);
                break;

            }

        },


        /*
         * =================
         * Style change handlers.
         * =================
         */


        /*
         * Render a highlight on an item's vectors by id.
         */
        highlightVectors: function(recordid) {

            // Get the item record.
            var record = this._db({
                recordid: parseInt(recordid, 10)
            }).first();

            // Render highlight.
            this._renderVectorHighlight(record);

        },

        /*
         * Render a highlight on an item's vectors by slug.
         */
        highlightVectorsBySlug: function(slug) {

            // Get the record.
            var record = this._db({
                slug: slug
            }).first();

            // Render highlight.
            this._renderVectorHighlight(record);

        },

        /*
         * Render a highlight on an item's vectors.
         */
        _renderVectorHighlight: function(record) {

            var self = this;

            // If there is no extant data record, abort.
            if (!record || _.isUndefined(record.data)) {
                return;
            }

            // Rebuild the style map.
            record.layer.styleMap = self._getStyleMap(
                record.data.highlight_color,
                record.data.vector_opacity,
                record.data.highlight_color,
                record.data.stroke_opacity,
                record.data.stroke_width,
                record.data.point_radius,
                record.data.highlight_color);

            // Rerender the layer to manifest the change.
            // record.layer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(record.layer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

            // Show the bubble.
            // this._showTitleTip(record);

        },

        /*
         * Remove a highlight on an item's vectors by id.
         */
        unhighlightVectors: function(recordid) {

            // Get the item record.
            var record = this._db({
                recordid: parseInt(recordid, 10)
            }).first();

            // Remove highlight.
            this._removeVectorHighlight(record);

        },

        /*
         * Remove a highlight on an item's vectors by slug.
         */
        unhighlightVectorsBySlug: function(slug) {

            // Get the record.
            var record = this._db({
                slug: slug
            }).first();

            // Remove highlight.
            this._removeVectorHighlight(record);

        },

        /*
         * Remove a highlight on an item's vectors.
         */
        _removeVectorHighlight: function(record) {

            var self = this;

            // If there is no extant data record, abort.
            if (_.isUndefined(record.data)) {
                return;
            }

            // Rebuild the style map.
            record.layer.styleMap = self._getStyleMap(
                record.data.vector_color,
                record.data.vector_opacity,
                record.data.stroke_color,
                record.data.stroke_opacity,
                record.data.stroke_width,
                record.data.point_radius,
                record.data.highlight_color);

            // Rerender the layer to manifest the change.
            // record.layer.redraw();

            // redraw() (above) is _not_ working. This is a hack to
            // trigger a rerender on the features.
            $.each(record.layer.features, function(i, feature) {
                self.highlightControl.unhighlight(feature);
            });

            // Hide the title tip.
            // this._hideTitleTip();

        },

        /*
         * Re-render the map.
         */
        refresh: function(pos) {
            this.map.updateSize();
            this.positionControls(
                pos.top,
                pos.left,
                pos.width,
                pos.height
            );
        },

        /*
         * Set the viewport from the defaults given or from the settings, which
         * will need to be parsed. This returns a bool indicating whether it
         * was successful.
         */
        setViewport: function(centerBounds, zoom) {
            var success = false;

            if (centerBounds != null) {
                var bounds = centerBounds.split(',');

                if (bounds.length === 4) {
                    this.map.zoomToExtent(new OpenLayers.Bounds(
                        parseFloat(bounds[0]),
                        parseFloat(bounds[1]),
                        parseFloat(bounds[2]),
                        parseFloat(bounds[3])
                    ));
                    success = true;
                } else if (bounds.length === 2) {
                    var zoom   = zoom == null ? 5 : parseInt(zoom);
                    var latlon = new OpenLayers.LonLat(
                        parseFloat(bounds[0].trim()), parseFloat(bounds[1].trim())
                    );
                    this.map.setCenter(latlon, zoom);
                    success = true;
                }
            }

            return success;
        }

    });

})(jQuery);

<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>


<legend>Drawing Tools</legend>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="pan" checked>
    <?php echo __('Navigate'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="point">
    <?php echo __('Draw Point'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="line">
    <?php echo __('Draw Line'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="poly">
    <?php echo __('Draw Polygon'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="regPoly">
    <?php echo __('Draw Regular Polygon'); ?>
  </label>
</div>


<div class="regular-polygon">

  <div class="form-group">
    <input type="text" class="form-control" name="sides" value="3" />
    <label><?php echo __('Sides'); ?></label>
  </div>

  <div class="form-group">
    <input type="text" class="form-control" name="snap" value="15" />
    <label><?php echo __('Snap Angle'); ?></label>
  </div>

  <div class="checkbox">
    <label>
      <input type="checkbox" name="irreg">
      <label><?php echo __('Irregular?'); ?></label>
    </label>
  </div>

</div>


<div class="radio">
  <label>

    <input type="radio" name="mode" value="svg">
    <?php echo __('Draw SVG'); ?>
    ( <a href="#svg-modal" data-toggle="modal" class="label-link">
      <?php echo __('Enter Markup'); ?>
    </a> )

  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="modify">
    <?php echo __('Modify Shape'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="rotate">
    <?php echo __('Rotate Shape'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="resize">
    <?php echo __('Resize Shape'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="drag">
    <?php echo __('Drag Shape'); ?>
  </label>
</div>


<div class="radio">
  <label>
    <input type="radio" name="mode" value="remove">
    <?php echo __('Delete Shape'); ?>
  </label>
</div>


<a name="clear" class="btn btn-primary btn-xs">
  <?php echo __('Clear all Geometry'); ?>
</a>


<legend>Spatial Data</legend>


<?php echo common('neatline/textarea', array(
    'name'  => 'coverage',
    'label' => 'Geometry (Well-Known Text)',
    'bind'  => 'record:coverage',
    'class' => 'code'
)); ?>

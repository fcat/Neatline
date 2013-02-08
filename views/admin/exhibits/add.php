<?php

/* vim: set expandtab tabstop=2 shiftwidth=2 softtabstop=2 cc=76; */

/**
 * Create exhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

?>

<?php
  echo head(array(
    'title' => __('Neatline | Create an Exhibit'),
    'content_class' => 'neatline'
  ));
?>

<div id="primary">
  <?php echo flash(); ?>
  <?php echo $form; ?>
</div>

<?php echo foot(); ?>

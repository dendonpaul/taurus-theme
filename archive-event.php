<?php get_header() ?>

  <?php pageBanner(array(
    'title'=>"All Events",
    'subtitle'=>'Checkout all the Events!',
    
  ));?>
  <div class="container container--narrow page-section">
    <?php
    while(have_posts()){
      the_post(); 
      get_template_part('/template-parts/content-event');
         }
    echo paginate_links();wp_reset_postdata();
    ?>
    Looking for a recap? <a href="<?php echo site_url('/past-events')?>">Check out the past event.</a>
  </div>
  
<?php get_footer()?>
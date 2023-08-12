<?php get_header() ?>
  <?php pageBanner(array(
    'title'=>'All Campuses',
    'subtitle'=>'Checkout all the Campuses!',
  ))?>
  <div class="container container--narrow page-section">
    <div class="acf-map">
        <?php while(have_posts()){ the_post(); ?>
        <?php $mapLocation = get_field('map_location');?>
        <div class="marker" data-lat="<?php echo $mapLocation['lat']?>" data-lng="<?php echo $mapLocation['lng']?>">
            <h3><a href="<?php the_permalink();?>"><?php the_title();?></a></h3>
            <?php echo $mapLocation['address']?>
        </div>
        <?php }
        echo paginate_links();wp_reset_postdata();
        ?>
    </div>
  </div>
  
<?php get_footer()?>
<?php get_header() ?>
  <?php pageBanner(array(
    'title'=> 'All Professors',
    'subtitle'=>'Check out all the Professors we have!',
  ));?>
  <div class="container container--narrow page-section">
    <ul class="min-list link-list">
        <?php while(have_posts()){ the_post(); ?>
        <li><a href="<?php the_permalink()?>"><?php the_title()?></a></li>
        <?php }
        echo paginate_links();wp_reset_postdata();
        ?>
    </ul>
  </div>
  
<?php get_footer()?>
<?php get_header()?>
<?php while(have_posts()){
        the_post();?>
    <?php pageBanner();?>
    <div class="container container--narrow page-section">
    
        <div class="generic-content">
            <div class="row group">
                <div class="one-third">
                    <?php the_post_thumbnail('pageBanner');?>
                </div>
                <div class="two-third">
                    <?php the_content();?>
                </div>
            </div>
        </div>
        <hr class="section-break">
        <h2 class="headline headline--medium">Subjects Taught</h2>
        <ul class="link-list min-list">
        <?php
            $related_programmes = get_field('related_programme');
            if($related_programmes):
            foreach($related_programmes as $programme){?>
                <li><a href="<?php echo get_the_permalink($programme);?>"><?php echo get_the_title($programme);?></a></li>
            <?php    
            } endif;
        ?>
        </ul>
    </div>
        <?php
    }
    ?>
<?php get_footer();?>
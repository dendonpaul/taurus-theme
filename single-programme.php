<?php get_header()?>
<?php while(have_posts()){
        the_post();?>
    <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('images/ocean.jpg')?>)"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php the_title();?></h1>
        <div class="page-banner__intro">
          <p>DONT FORGET TO REPLACE ME LATER!!!</p>
        </div>
      </div>
    </div>
    <div class="container container--narrow page-section">
    <div class="metabox metabox--position-up metabox--with-home-link">
            <p>
            <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('programme')?>"><i class="fa fa-home" aria-hidden="true"></i> Programmes Home</a> <span class="metabox__main"><?php the_title();?></span>
            </p>
        </div>
        <div class="generic-content">
            <?php the_content();?>
        </div>
        <!--Related Professor-->
        <?php 
            
            $relatedprofessors = new WP_Query(array(
            'posts_per_page'=>2,
            'post_type'=>'professor',
            'orderby'=>'title',
            'order'=>'ASC',
            'meta_query'=>array(
                array(
                    'key'=>'related_programme',
                    'compare'=> 'LIKE',
                    'value'=>'"' . get_the_ID() . '"'
                )
                ),
        )) ?>
        <?php if($relatedprofessors->have_posts()):?>
            <hr class="section-break">
            <h2 class="headline headline--small"><?php echo get_the_title(); ?> Professors</h2>
            <ul class=" professor-cards">
            <?php while($relatedprofessors->have_posts()): $relatedprofessors->the_post();
            ?>
                <li class="professor-card__list-item">
                    <a class="professor-card" href="<?php the_permalink()?>">
                        <img class="professor-card__image" src="<?php the_post_thumbnail();?>"/>
                        <span class="professor-card__name"><?php the_title();?></span>
                    </a>
                </li>
            <?php endwhile; wp_reset_postdata();?>
            </ul>
        <?php endif;?>
        <!-- Related Programs-->
        <?php 
            $today = date('Ymd');
            $relatedevents = new WP_Query(array(
            'posts_per_page'=>2,
            'post_type'=>'event',
            'meta_key'=>'event_date',
            'orderby'=>'meta_value',
            'order'=>'ASC',
            'meta_query'=>array(
                array(
                    'key'=>'event_date',
                    'compare'=> '>=',
                    'value'=>$today
                ),
                array(
                    'key'=>'related_programme',
                    'compare'=> 'LIKE',
                    'value'=>'"' . get_the_ID() . '"'
                )
                ),
        )) ?>
        <?php if($relatedevents->have_posts()):?>
            <hr class="section-break">
            <h2 class="headline headline--medium">Upcoming <?php echo get_the_title(); ?> Events</h2>
            <?php while($relatedevents->have_posts()): $relatedevents->the_post();
                get_template_part('/template-parts/content-event');
            endwhile; wp_reset_postdata();
            endif;?>
            <!-- //Related Campuses -->
            <?php
            $relatedCampuses = get_field('related_campuses');
            if($relatedCampuses){
                echo "<hr/>";
                echo "<h2 class='headline headline--medium'>".get_the_title() ." is available at these campuses</h2>";
                echo "<ul class='min-list link-list'>";
                foreach($relatedCampuses as $campus): ?>
                    <li><a href="<?php echo get_the_permalink($campus)?>"><?php echo get_the_title($campus)?></a></li>
                <?php endforeach;
                echo "</ul>";
            }
            
            ?>

    </div>
        <?php
    }
    ?>
<?php get_footer();?>
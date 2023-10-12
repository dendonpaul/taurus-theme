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
                    <?php
                        $likesCount = new WP_Query(array(
                            'post_type' => 'like',
                            'meta_query' => array(
                                array(
                                    'key' => 'liked_professor_id',
                                    'compare' => '=',
                                    'value' => get_the_ID()
                                )
                            ),
                        ));

                        $existStatus = 'no';

                        if(is_user_logged_in()){
                            $existQuery = new WP_Query(array(
                                'author' => get_current_user_id(),
                                'post_type' => 'like',
                                'meta_query' => array(
                                    array(
                                        'key'=>'liked_professor_id',
                                        'compare'=>'=',
                                        'value'=>get_the_ID()
                                    )
                                ),
                            ));
    
                            $likeID=null;
                            if($existQuery->found_posts){
                                $existStatus = 'yes';
                                // var_dump($existQuery->post->ID);
                                $likeID = $existQuery->post->ID;
                            }
                        }
                    ?>
                    <span class="like-box" data-likeid="<?php if($likeID!=null) echo $likeID;?>" data-proffId="<?php the_ID();?>" data-exists="<?php echo $existStatus;?>">
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <i class="fa fa-heart" aria-hidden="true"></i>
                        <span class="like-count"><?php echo $likesCount->found_posts;?></span>
                    </span>
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
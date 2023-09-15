<?php get_header() ?>
<?php while(have_posts()){
        the_post();?>
        <?php pageBanner();?>

    <div class="container container--narrow page-section">
        <?php 
            $theParent = wp_get_post_parent_id(get_the_ID());
            if(wp_get_post_parent_id(get_the_ID())){ 
        ?>
            <div class="metabox metabox--position-up metabox--with-home-link">
                <p>
                <a class="metabox__blog-home-link" href="<?php echo get_permalink(wp_get_post_parent_id(get_the_ID()))?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title(wp_get_post_parent_id(get_the_ID()))?></a> <span class="metabox__main"><?php the_title();?></span>
                </p>
            </div>
        <?php } ?>
    <?php 
    $childArray = get_pages(array(
        'child_of'=>get_the_ID()
    ));
    if(wp_get_post_parent_id(get_the_ID()) || $childArray){?>
        <div class="page-links">
            <h2 class="page-links__title"><a href="<?php echo get_permalink(wp_get_post_parent_id(get_the_ID()))?>"><?php echo get_the_title(wp_get_post_parent_id(get_the_ID())) ?></a></h2>
            <ul class="min-list">
            <?php 
            if($theParent){
                $findChildrenOf = wp_get_post_parent_id(get_the_ID());
            }else{
                $findChildrenOf = get_the_ID();
            }
                wp_list_pages(array(
                    'title_li'=>NULL,
                    'child_of'=>$findChildrenOf
                ));
            ?>
            </ul>
        </div>
    <?php }?>

      <div class="generic-content">
        <?php get_search_form();?>
      </div>
    </div>
        <?php
    }
    ?>
<?php get_footer();?>
<?php
if(!is_user_logged_in()){
    wp_redirect(esc_url(site_url('/')));
    exit;
}
get_header() ?>
<?php while(have_posts()){
        the_post();?>
        <?php pageBanner();?>

    <div class="container container--narrow page-section">
        <ul class="min-list link-list" id="my-notes">
            <?php 
            $notes = new WP_Query(array(
                'post_type' => 'note',
                'posts_per_page'=> -1,
                'author'=>get_current_user_id()
            ));

            while($notes->have_posts()){
                $notes->the_post();
            ?>
                <li data-id="<?php the_ID();?>">
                    <form method="get" data-id="<?php the_ID();?>">
                    <input class="note-title-field" type="text" name="note-title" value="<?php echo esc_attr(get_the_title());?>" readonly/>
                    <span id="edit-note" class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</span>
                    <span id="cancel-edit" class="edit-note" style="display:none"><i class="fa fa-close" aria-hidden="true"></i>Cancel</span>
                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</span>
                    <textarea class="note-body-field" name='note-content' readonly><?php echo esc_attr(wp_strip_all_tags(get_the_content())); ?></textarea>
                    <!-- <input id="save-note" style="display:none" type="submit" value='save'/> -->
                    <span id="save-note" style="visibility:hidden;" class="btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i>Save</span>
                    <span id="cancel-edit" style="visibility:hidden;" class="btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i>Cancel</span>
                    </form>
                </li>
            <?php
            }
            ?>

        </ul>
    </div>
        <?php
    }
get_footer();?>
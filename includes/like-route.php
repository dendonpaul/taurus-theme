<?php

add_action('rest_api_init', 'taurusRegisterLikeRoute');

function taurusRegisterLikeRoute(){
    register_rest_route('taurus/v1','updateLike',array(
        'methods' => 'POST',
        'callback'=>'taurusCreateLike'
    ));

    register_rest_route('taurus/v1','updateLike',array(
        'methods' => 'DELETE',
        'callback' => 'taurusDeleteLike'
    ));
}

//Create Like
function taurusCreateLike($data){
    if(is_user_logged_in()){
        $professorId = sanitize_text_field($data['professor_id']);

        $likeExists = new WP_Query(array(
            'post_type'=> 'like',
            'author'=> get_current_user_id(),
            'meta_query'=> array(
                array(
                    'key' => 'liked_professor_id',
                    'compare'=> '=',
                    'value'=>$professorId
                )
            )
        ));

        if($likeExists->found_posts == 0 AND get_post_type($professorId) == "professor"){
            $my_post = array(
                'post_title'    => '',
                'post_type'     => 'like',
                'post_content'  => "",
                'post_status'   => 'publish',
                'post_author'   => get_current_user_id(),
                'meta_input'    => array(
                    'liked_professor_id' => $professorId,
                )
            );
            $createPost = wp_insert_post($my_post, $wp_error);
            
            return $createPost;
        }else{
            // die("Already Liked");
            return false;
        }
    }else{
        return false;
    }

}

//Delete Like
function taurusDeleteLike($data){
    wp_delete_post($data['likePostId']);
    return $data['likePostId'];
}
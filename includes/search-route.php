<?php

add_action('rest_api_init', 'taurusRegisterSearch');

function taurusRegisterSearch(){
    register_rest_route('taurus/v1', 'search', array(
        'methods'=>'GET',
        'callback'=> 'taurusSearchResults'
    ));
}

function taurusSearchResults($data){
    $mainQuery = new WP_Query(array(
        'post_type'=> array('professor','programme','campus','event','post','page'),
        's'=> sanitize_text_field($data['term'])
    ));

    $results = array(
        "generalInfo" => array(),
        'campuses' => array(),
        'events' => array(),
        'programmes' => array(),
        'professors' => array()
    );

    while($mainQuery->have_posts()){
        $mainQuery->the_post();

        //Push to general info, if post or page.
        if(get_post_type()=='post' || get_post_type()=='page'){
            array_push($results['generalInfo'], array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink(),
            ));
        }
        //push to campuses
        if(get_post_type() == 'campus'){
            array_push($results['campuses'], array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink()
            ));
        }
        //push to events
        if(get_post_type() == 'event'){
            array_push($results['events'],array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink()
            ));
        }
        //push to professors
        if(get_post_type() == 'professor'){
            array_push($results['professors'],array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink()
            ));
        }
        //push to programs
        if(get_post_type() == 'programme'){
            array_push($results['programmes'],array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink()
            ));
        }
    }

    return $results;
}
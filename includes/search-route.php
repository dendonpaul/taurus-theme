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
                'postType' => get_post_type(),
                'postAuthor'=>get_the_author()
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
                'link'=>get_the_permalink(),
                'eventMonth'=>get_the_time('M'),
                'eventDay'=>get_the_time('d'),
                'eventContent'=>wp_trim_words(get_the_content(),18)
            ));
        }
        //push to professors
        if(get_post_type() == 'professor'){
            array_push($results['professors'],array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink(),
                'imageURL'=>get_the_post_thumbnail_url()
            ));
        }
        //push to programs
        if(get_post_type() == 'programme'){
            array_push($results['programmes'],array(
                'name'=>get_the_title(),
                'link'=>get_the_permalink(),
                'archiveUrl'=>get_post_type_archive_link('programme'),
                'id'=>get_the_id()
            ));
        }
    }

    $programRelationQuery = new WP_Query(array(
        'post_type'=>'professor', 
        'meta_query'=> array(
            array(
                "key" => 'related_programme',
                "compare" => 'LIKE',
                "value" =>'"53"'
            )
        )
    ));

   //Display related professors under professor section, if a programme is in the search results.
   $showRelatedProfessors = new WP_Query(array(
    'post_type' => 'professor',
    'meta_query' => array(
        array(
            'key' => 'related_programme',
            'compare' => 'LIKE',
            'value' => '"'.$results['programmes'][0]['id'].'"',
        )
    )
   ));

   while($showRelatedProfessors->have_posts()){
    $showRelatedProfessors->the_post();

    if(get_post_type() == 'professor'){
        array_push($results['professors'], array(
            'name'=>get_the_title(),
            'link'=>get_the_permalink(),
            'imageURL'=>get_the_post_thumbnail_url()
        ));
    }
   }

   $results['professors'] = array_values(array_unique($results['professors'],SORT_REGULAR));
    
    return $results;
}
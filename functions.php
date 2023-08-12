<?php
//Function to enqueue scripts and styles
function tauras_theme_enqueue_scripts(){
    //Enqueue Styles
    wp_enqueue_style('tauras-google-custom-font','//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome','//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('tauras-theme-style-index',get_template_directory_uri().'/build/style-index.css');
    wp_enqueue_style('tauras-theme-extra-css',get_template_directory_uri().'/build/index.css');
    //Enqueue Scripts
    wp_enqueue_script('tauras-main-js',get_theme_file_uri('/build/index.js'),['jquery'],1.0,true);
    wp_enqueue_script('tauras-googlemaps-js','//maps.googleapis.com/maps/api/js?key=AIzaSyC8JtvmSHV32RK2WpueRvX0ZZMIzOdDoPM',NULL,1.0,false);
}

//Function to enable Theme Features
function tauras_features(){
    // add_theme_support('menus');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails', array(
        'professor'
    ));
    add_image_size('pageBanner',1500,350,true);
    register_nav_menu('headermenulocation', 'Header Menu Location');
    register_nav_menu('footer1','Footer 1');
    register_nav_menu('footer2','Footer 2');
}

//Tauras theme custom post types
//Function to create post type
function tauras_events_post_type(){

    //Register Campus Post Type
    register_post_type('campus',array(
        'public'=>true,
        'show_in_rest'=>true,
        'supports'=>array('title','editor', 'excerpt'),
        'menu_icon'=>'dashicons-bank',
        'has_archive'=>true,
        'rewrite'=>array('slug'=>'campuses'),
        'labels'=>array(
            'name'=>'Campuses',
            'singular_name'=>'campus',
            'add_new_item'=>'Add a Campus',
            'edit_item'=>'Edit Campus',
            'all_items'=>'All Campuses',
        ),
    ));
    //Register Event Post Type
    register_post_type('event',array(
        'public'=>true,
        'show_in_rest'=>true,
        'supports'=>array('title','editor', 'excerpt'),
        'menu_icon'=>'dashicons-calendar',
        'labels'=>array(
            'name'=>'Events',
            'singular_name'=>'event',
            'add_new_item'=>'Add New Event',
            'edit_item'=>'Edit Event',
            'all_items'=>'All Events'
        ),
        'has_archive'=>true,
        'rewrite'=>array('slug'=>'events'),
    ));

    //Register Programme post type
    register_post_type('programme', array(
        'public'=>true,
        'show_in_rest'=>true,
        'rewrite'=>array(
            'slug'=>'programmes',
        ),
        'supports'=>array('title','editor','excerpt'),
        'menu_icon'=>'dashicons-book',
        'has_archive'=>true,
        'labels'=>array(
            'name'=>'Programmes',
            'singular_name'=>'Programme',
            'add_new_item'=>'Add new Programme',
            'edit_item'=>'Edit Programme',
            'all_items'=>'All Programmes',
        )
    ));

    //Register Professor Post Type
    register_post_type('professor', array(
        'show_in_rest'=>true,
         'public'=>true,
         'has_archive'=>false,
         'rewrite'=>array(
            'slug'=>'professors'
         ),
         'supports'=>array('title','editor','thumbnail'),
         'menu_icon'=>'dashicons-businessperson',
         'labels'=>array(
            'name'=>'Professors',
            'singular_name'=>'Professor',
            'add_new_item'=>'Add new Professor',
            'edit_item'=>'Edit Professor',
            'all_items'=>'All Professors'
         )
        ));
}

//Function to filter event queries for Events Archive
function tauras_filter_event_query($query){
    //Campus Post Type
    if(!is_admin() && is_post_type_archive('campus') && $query->is_main_query()){
        $query->set('posts_per_page',-1);
    }
    //Programmes Post Type
    if(!is_admin() && is_post_type_archive('programme') && $query->is_main_query()){
        $query->set('orderby','title');
        $query->set('order','ASC');
        $query->set('posts_per_page',-1);
    }
    //Event Post Type
    if(!is_admin() && is_post_type_archive('event') && $query->is_main_query()){
        $today = date('Ymd');
        $query->set('meta_key', 'event_date');
        $query->set('orderby','meta_value_num');
        $query->set('order','ASC');
        $query->set('meta_query', array(
            array(
                'key'=>'event_date',
                'compare' => '>=',
                'value'=>$today,
                'type'=>'numeric'
            )
            ));
    }
}

//Page Banner Function
function pageBanner($args=NULL){
    if(!isset($args['title'])) $args['title']= get_the_title();
    if(!isset($args['subtitle'])) $args['subtitle']=get_field('page_banner_subtitle');
    if(!isset($args['bgimage'])) $args['bgimage'] = get_field('page_banner_bg_image');
    ?>
    <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php 
        $bannerImage = $args['bgimage'];
        if(!isset($bannerImage)){
            $bannerImage=get_template_directory_uri().'/images/ocean.jpg';
        }else if(is_array($bannerImage)){
            $bannerImage = $bannerImage['url'];
        }
        echo $bannerImage;
      ?>)"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title']?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle']?></p>
        </div>
      </div>
    </div>
    <?php
}

//ACF Google Map API Filter
function tauras_acf_googlemap_filter($args){
    $args['key'] = 'AIzaSyC8JtvmSHV32RK2WpueRvX0ZZMIzOdDoPM';
    return $args;
}

//Action hooks
add_action('wp_enqueue_scripts', "tauras_theme_enqueue_scripts");
add_action('after_setup_theme','tauras_features');
add_action('init', 'tauras_events_post_type');
add_action('pre_get_posts', 'tauras_filter_event_query');

//Filter Hooks
add_filter('acf/fields/google_map/api', 'tauras_acf_googlemap_filter');


?>
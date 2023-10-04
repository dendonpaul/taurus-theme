import axios from "axios";

const Like = () => {
    //variables
    let userLoggedIn = false;

    //DOM Selectors
    const likeButtons = document.querySelectorAll('.like-box');

    //Methods
    //Delete like
    const deleteLike = () => {
        console.log('Delete Like')
    }

    //Add like
    const addLike = () => {
        console.log('Add Like')
    }

    //Choose to delete or add like
    const likeClick = (e) => {
        e.stopPropagation();
        //first check if user is logged in 
        if(document.body.classList.contains('logged-in')){
            if(e.target.getAttribute('data-exists') == 'yes' || e.target.parentElement.getAttribute('data-exists') == 'yes'){
                deleteLike();
            }else{
                addLike();
            }
        }else{
            alert('You need to login to Like a professor');
        } 
    }

    //event triggers
    likeButtons.forEach((lb)=>{
        lb.addEventListener('click',likeClick);
    })

}

export default Like;
import axios from "axios";

const Like = () => {
    //variables
    let userLoggedIn = false;
    const headers = {
        'X-WP-Nonce' : taurusData.nonce,

    }

    //DOM Selectors
    const likeButtons = document.querySelectorAll('.like-box');

    //Methods
    //Delete like
    const deleteLike = async (e) => {
        const likeBoxID = e.dataset.likeid;
        const data = {
            'likePostId' : likeBoxID
        }
        axios.delete(taurusData.root_url+`/wp-json/taurus/v1/updateLike/`,data,{headers})
        .then(res=>console.log(res))
        .catch(err=>console.log(err))
    }

    //Add like
    const addLike = async (e) => {
        const data = {
            'professor_id' : e.dataset.proffid
        }
        axios.post(taurusData.root_url+`/wp-json/taurus/v1/updateLike/`,data,{headers})
        .then(res=>{
            if(res.data != false){
                e.dataset.likeid = res.data
                let likeCount = parseInt(e.querySelectorAll('.like-count')[0].innerHTML);
                likeCount++;
                e.querySelectorAll('.like-count')[0].innerHTML = likeCount;
                e.dataset.exists = "yes"
            }
        })
        .then()
        .catch(res=>console.log(res))
    }

    //Choose to delete or add like
    const likeClick = (e) => {
        //first check if user is logged in 
        let selectLikeBox = e.target.closest('.like-box');
        if(document.body.classList.contains('logged-in')){
            if(selectLikeBox.getAttribute('data-exists') == 'yes'){
                deleteLike(selectLikeBox);
            }else{
                addLike(selectLikeBox);
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
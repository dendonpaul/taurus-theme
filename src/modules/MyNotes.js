import axios, { all } from "axios";

const MyNotes = ()=>{
    const deleteNoteButton = document.querySelectorAll('.delete-note');
    const editNoteButton = document.querySelectorAll('.edit-note');
    const allTitleFields = document.querySelectorAll('.note-title-field');
    const allTextAreaFields = document.querySelectorAll('.note-body-field');
    const saveButton = document.querySelectorAll('#save-note');
    const cancelEditButton = document.querySelectorAll('#cancel-edit');
    const createNewNoteButton = document.querySelector('.submit-note');
 
    //Methods--------------------------------------------------------------//
    //Delete Note
    const deleteNote = async (e)=>{
        const ID = e.target.parentElement.dataset.id;
        const headers = {
            'X-WP-Nonce' : taurusData.nonce
        }
        //confrim
        if(confirm('Delete')){
            axios.delete(taurusData.root_url+`/wp-json/wp/v2/note/${ID}`,{headers})
        .then(res=>e.target.parentElement.remove())
        }else{
            alert('not deleted');
        } 
    }

    //Update Note
    const updateNote = async (e)=>{
        const ID = e.target.parentElement.dataset.id
        const headers = {
            'X-WP-Nonce' : taurusData.nonce,
        }
        const data = {
            'title' : e.target.parentElement.querySelector('.note-title-field').value,
            'content': e.target.parentElement.querySelector('.note-body-field').value,
        }
        try{
            await axios.put(taurusData.root_url+`/wp-json/wp/v2/note/${ID}`,data,{headers}).then(deactivateEditFields);
        }catch(err){
            console.log(err)
        }

    }

    //Edit Note
    const editNote = async(e)=>{
        //make all other edit fields inactive.
        deactivateEditFields();
        const ID = e.target.parentElement.dataset.id
        e.target.parentElement.childNodes.forEach(d=>{
            if(d.nodeName == 'INPUT' || d.nodeName == 'TEXTAREA'){
                d.removeAttribute('readonly');
                d.classList.add('note-active-field');
                
                //If submit button is used instead of <span> tag
                // if(d.type == 'submit'){
                //     d.style.display = 'block';
                // }
            }
            
            //used only when span tag is used instead of input submit
            if(d.id == 'save-note' || d.id == 'cancel-edit'){
                console.log(d.id)
                d.style.visibility = 'visible';
            }
        })
    }
    //cancel edit
    // deactivate edit fields.
    const deactivateEditFields = () => {
        //disable all input fields.
        const allFields = [...allTitleFields, ...allTextAreaFields, ...saveButton, ...cancelEditButton]
        allFields.forEach(field=>{
            field.setAttribute('readonly','true');
            field.classList.remove('note-active-field');
            //If submit button is used instead of <span> tag
            // if(field.type == 'submit'){
            //     field.style.display = 'none';
            // }
            //used only when span tag is used instead of input submit
            if(field.id == 'save-note' || field.id == 'cancel-edit'){
                field.style.visibility = 'hidden';
            }

        });
        
    }

    //create new note
    const saveNewNote = async (e) => {
        // const ID = e.target.parentElement.dataset.id
        const headers = {
            'X-WP-Nonce' : taurusData.nonce,
        }
        const data = {
            'title' : document.querySelector('.new-note-title').value,
            'content': document.querySelector('.new-note-body').value,
            'status': 'publish'
        }
        try{
            await axios.post(taurusData.root_url+`/wp-json/wp/v2/note/`,data,{headers}).then(res => console.log("Notes Created"));
        }catch(err){
            console.log(err)
        }
    }

    //events---------------------------------------------------------------//
    //delete button event
    deleteNoteButton.forEach(data=>{
        data.addEventListener('click',deleteNote);
    });
    //edit button event
    editNoteButton.forEach(data=>{
        data.addEventListener('click',editNote);
    });
    //cancel button
    cancelEditButton.forEach(data=>{
        data.addEventListener('click',deactivateEditFields);
    });
    //save updated notes
    saveButton.forEach(data => {
        data.addEventListener('click',updateNote)
    });
    //create new note
    createNewNoteButton.addEventListener('click',saveNewNote);

}

export default MyNotes
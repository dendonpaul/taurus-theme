import axios, { all } from "axios";

const MyNotes = ()=>{
        
    let deleteNoteButton = document.querySelectorAll('.delete-note');
    let editNoteButton = document.querySelectorAll('.edit-note');
    let allTitleFields = document.querySelectorAll('.note-title-field');
    let allTextAreaFields = document.querySelectorAll('.note-body-field');
    let saveButton = document.querySelectorAll('#save-note');
    let cancelEditButton = document.querySelectorAll('#cancel-edit');
    let createNewNoteButton = document.querySelector('.submit-note');
    let notesBody = document.getElementById('my-notes');
    let errorSpan = document.getElementById('error');
    
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
            .then(res=>{if(res.data.id){e.target.parentElement.parentElement.remove()}})
        // .then(res=>e.target.parentElement.parentElement.remove())
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

    //Reset create note fields after creating new note
    const resetCreateNoteFields = () => {
        console.log("Hello")
        document.querySelector('.new-note-title').value = '';
        document.querySelector('.new-note-body').value = '';
    }

    //append new note
    const appendNewNote = (noteData) => {
        let newData = `
            <li data-id="${noteData.id}">
                <form method="get" data-id="${noteData.id}">
                    <input class="note-title-field" type="text" name="note-title" value="${noteData.title.raw}" readonly/>
                    <span id="edit-note" class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i>Edit</span>
                    <span id="cancel-edit" class="edit-note" style="display:none"><i class="fa fa-close" aria-hidden="true"></i>Cancel</span>
                    <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i>Delete</span>
                    <textarea class="note-body-field" name='note-content' readonly>${noteData.content.raw}</textarea>
                    <!-- <input id="save-note" style="display:none" type="submit" value='save'/> -->
                    <span id="save-note" style="visibility:hidden;" class="btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i>Save</span>
                    <span id="cancel-edit" style="visibility:hidden;" class="btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i>Cancel</span>
                </form>
            </li>
        `;

        notesBody.innerHTML= newData + notesBody.innerHTML;
        rerunEventTriggers();
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
            await axios.post(taurusData.root_url+`/wp-json/wp/v2/note/`,data,{headers})
            .then(res=>{
                console.log(res.data.userNoteCount);
                if(!res.data.id)
                    {errorSpan.innerText = res.data} 
                else{
                    appendNewNote(res.data)
            }})
            .then(()=>resetCreateNoteFields())
            
        }catch(err){
            console.log(err);
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
    if(createNewNoteButton){
    createNewNoteButton.addEventListener('click',saveNewNote);}
    
    //Rerun Event triggeres after create new post
    const rerunEventTriggers = () => {
        //select DOM Elements again 
        deleteNoteButton = document.querySelectorAll('.delete-note');
        editNoteButton = document.querySelectorAll('.edit-note');
        allTitleFields = document.querySelectorAll('.note-title-field');
        allTextAreaFields = document.querySelectorAll('.note-body-field');
        saveButton = document.querySelectorAll('#save-note');
        cancelEditButton = document.querySelectorAll('#cancel-edit');
        createNewNoteButton = document.querySelector('.submit-note');
        notesBody = document.getElementById('my-notes');

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
    }

}

export default MyNotes
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState =  (props) => {
  // const s1={
  //     "name":"PD",
  //     "class":"11"
  // }
  //const[state,setState]=useState(s1);

  //  const update=()=>{
  //     setTimeout(() => {
  //         setState({
  //             "name":"Sameer",
  //             "class":"1"
  //         })
  //{<NoteContext.Provider value={{state,update}} ></NoteContext.Provider>}
  //     }, 1000);
  //  }
  const host = "http://localhost:5000"
  const notesInitial =[]
  const [notes, setNotes] = useState(notesInitial)
  
  //Get all notes
  const getNotes =async () => {

    //todo api call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }

    });
   const json=await response.json()
   console.log(json)
   
   setNotes(json)
  }

  //Add Note
  const addNote =async (title, description, tag) => {

    //todo api call
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag}),
    });

    const note=await response.json();
    setNotes(notes.concat(note))
    
   
  
  }
  //Delete Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

    });
    const json = response.json();
    console.log(json )
    console.log("deleting note with id" + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)

  }

  //Edit Note
  const editNote = async (id, title, description, tag) => {
    //API call 

    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title,description,tag}),
    });

    const json=await response.json();
    console.log(json)
    //samjal nh
    //we are creating
   let newNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
   
    }
    setNotes(newNotes)
  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote ,getNotes}} >
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState;
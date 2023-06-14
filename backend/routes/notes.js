const express = require('express');
const router = express.Router()
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes')
const { body, validationResult } = require('express-validator');
//Route 1: Get all notes using:Get:"api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal server error");
    }

})

//Route 2: add new note using post notes using:Get:"api/notes/addnotes"
router.post('/addnotes', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),

], async (req, res) => {
    try {


        const { title, description, tag } = req.body;
        // if there are errors,return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = new Note({
            title, description, tag, user: req.user.id

        })
        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send(" Internal server error");
    }
})

//Route 3: Update existing note using put notes using:Get:"api/notes/updatenotes" login
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const{title,description,tag}=req.body;

    //create newNote object

    const newNote={}
    if(title){
        newNote.title=title
    }
    if(description){
        newNote.description=description
    }
    if(tag){
        newNote.tag=tag
    }

    //find note to be updated and update 
   let note=await Note.findById(req.params.id);
   if(!note){ return res.status(404).send("Not Found")}

   if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
   }

   note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
   res.json({note})
})


//Route 4: Delete existing note using delete notes using:Get:"api/notes/deletenotes" login
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    const{title,description,tag}=req.body;
 
    //find note to be deleted and delete it 
   let note=await Note.findById(req.params.id);
   if(!note){ return res.status(404).send("Not Found")}
//allow celetion only if user owns this note
   if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed");
   }

   note=await Note.findByIdAndDelete(req.params.id)
   res.json({"success":"note has been deleted",note:note})
})
module.exports = router
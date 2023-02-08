
import express from 'express';
import { userModel, tweetModel, messageModel } from '../dbRepo/models.mjs';
import mongoose from 'mongoose';
const router = express.Router()

app.get('/api/v1/users', async (req, res) => {

  const myId = req.body.token._id

  try {
      const q = req.query.q;
      console.log("q: ", q);

      let query;

      if (q) {
          query = userModel.find({ $text: { $search: q } })
      } else {
          query = userModel.find({}).limit(20)
      }

      const users = await query.exec();

      const modifiedUserList = users.map(eachUser => {

          let user = {
              _id: eachUser._id,
              firstName: eachUser.firstName,
              lastName: eachUser.lastName,
              email: eachUser.email
          }

          if (eachUser._id.toString() === myId) {

              console.log("matched");
              user.me = true
              return user;
          } else {
              return user;
          }
      })

      res.send(modifiedUserList);

  } catch (e) {
      console.log("Error: ", e);
      res.send([]);
  }
})


router.post('/api/v1/message', async (req, res) => {

  if (
      !req.body.text ||
      !req.body.to
  ) {
      res.status("400").send("invalid input")
      return;
  }

  const sent = await messageModel.create({
      from: req.body.token._id,
      to: req.body.to,
      text: req.body.text
  })

  console.log("sent: ", sent)

  res.send("message sent successfully");
})
router.get('/api/v1/messages/:id', async (req, res) => {

 const messages = await messageModel.find({
  $or : [
       { from : req.body.token._id,
        to: req.body.id
       },
       { from : req.params.id,
        to: req.body.token._id
       }
     ]
 })
 .populate({ path: 'from', select: 'firstName lastName email' })
 .populate({ path: 'to', select: 'firstName lastName email' })
 .sort({_id: -1})
 .limit(50)
 .exec();

 
  res.send(messages);
})


export default router
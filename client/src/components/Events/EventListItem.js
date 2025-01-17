import React, { useState, useEffect } from 'react';
import { BsCurrencyBitcoin, BsHeartFill } from 'react-icons/bs';
import TimeAgo from 'react-timeago';
import ConfirmationModal from '../Modals/ConfirmationModal';
import NotAvailableModal from '../Modals/NotAvailableModal';
import MesssageSentModal from '../Modals/MessageSentModal';
import axios from 'axios';

import {
 DrumImgA,
 DrumImgP,
 DrumImgF,
 GuitarImgA,
 GuitarImgP,
 GuitarImgF,
 VocalImgA,
 VocalImgP,
 VocalImgF,
} from '../styled-component/icons-styled';
import '../../scss/custom.scss';
import '../../App.scss';
import { EventStyles } from '../styled-component/mySessionListItem-styled';

const InstrumentStatusComp = {
 Drum: {
  Available: DrumImgA,
  Pending: DrumImgP,
  Filled: DrumImgF,
 },
 Guitar: {
  Available: GuitarImgA,
  Pending: GuitarImgP,
  Filled: GuitarImgF,
 },
 Vocal: {
  Available: VocalImgA,
  Pending: VocalImgP,
  Filled: VocalImgF,
 },
};

function EventListItem({
 id,
 title,
 user,
 userPhone,
 date,
 city,
 country,
 level,
 venue,
 genre,
 image,
 description,
 status,
 event_instruments_id,
 created,
 instruments,
 instrument_quantity,
 events,
 setEvents,
 setFavEvents
}) {
 const [show, setShow] = useState(false);
 const [showMsg, setShowMsg] = useState(false);
 const [showNAvail, setShowNAvail] = useState(false);
 const [activeEventId, setActiveEventId] = useState();
 const [activeEventInstrument, setActiveEventInstrument] = useState();
 const [userSignedUp, setUserSignedUp] = useState(false);

 const handleShow = (eventInstrumentId, eventId) => {
  setActiveEventInstrument(eventInstrumentId);
  setActiveEventId(eventId);
  setShow(true);
 };
 const handleClose = () => {
  setActiveEventInstrument(undefined);
  setShow(false);
 };

 const handleCloseMsg = () => setShowMsg(false);
 const handleOpenMsg = () => setShowMsg(true);

 const handleCloseNA = () => setShowNAvail(false);
 const handleOpenNA = () => setShowNAvail(true);

 const [like, setLike] = useState(false);

 //INSTRUMENTS ARRAY
 const instrumentsArr = [];
 const instrumentSummary = events.map((event) => {
  const user_id = event.user_id;
  const attendees = event.attendees;
  event.event_instruments.map((event_i) => {
   const instrument_name = event.instruments.find(
    (inst) => inst.id === event_i.instrument_id
   ).name;

   const instrument = {
    name: instrument_name,
    user_id: user_id,
    attendees: attendees,
    event_id: event_i.event_id,
    event_instruments_id: event_i.id,
    status: event_i.status.reduce((acc, curr, i) => {
     acc[curr.name] = curr.quantity;
     return acc;
    }, {}),
   };

   instrumentsArr.push(instrument);
  });
 });

 const generateKey = (index) => {
  return `${index}_${Math.random(index)}`;
}

 //GET EVENT DATA
 const getEventData = () => {
  const event = events.find((e) => e.id === id);

  const instrumentsById = event.instruments.reduce((acc, val) => {
   acc[val.id] = val;
   return acc;
  }, {});

  return event.event_instruments.map((ei) => {
   const name = instrumentsById[ei.instrument_id].name;
   const instrumentsAry = [];
   ei.status.forEach((item) => {
    const Comp = InstrumentStatusComp[name][item.name];
    [...Array(item.quantity)].forEach((v, i) => {
     instrumentsAry.push(
      <div
       className="render-icon"
       key={`selector-${generateKey(i)}`}
       onClick={() => userSignedUp ?  handleOpenNA() : handleShow(ei.id, ei.event_id)}  
      >
       <Comp />
      </div>
     );
    });
   });
   return instrumentsAry;
  });
 };

 useEffect(function () {
  axios
   .get(`/api/user_favourites/${id}`, {
    params: { user_id: currentUser.userData.id },
   })
   .then((res) => setLike(res.data.like))
   .catch((err) => console.log(err));
 }, []);

 const currentUser = JSON.parse(localStorage.getItem('user'));

 const handleLike = (e) => {
  e.preventDefault();
  const myfavourite = { event_id: id, user_id: currentUser.userData.id };
  if (!like) {
   axios
    .post('/api/user_favourites', { myfavourite })
    .then((response) => {
    })
    .catch((error) => {
     console.log('Clicking Heart', error);
    });
  } else {
   axios
    .delete(`/api/user_favourites/delete`, { data: { myfavourite } })
    .then((response) => {
     setFavEvents((prev) => {
      return prev.filter((item) => {
       return item.id !== response.data.event_id;
      });
     });
    })
    .catch((error) => {
     console.log('Clicking Heart', error);
    });
  }
  setLike((prevLike) => !prevLike);
 };

 const handleConfirm = (eventInstrumentId, eventId) => {
  handleClose();
  console.log('confirmation button clicked submitted');

  const status = instrumentsArr.find(
   (e, i) => eventInstrumentId === e.event_instruments_id
  ).status;
  const eventUser = instrumentsArr.map((e, i) => {
   let userId;
   if (e.event_id === eventId) {
    e.attendees.map((a) => {
     return (userId = a.user_id);
    });
   }
   return userId;
  });

  const event_instruments_id = instrumentsArr.find(
   (e, i) => eventInstrumentId === e.event_instruments_id
  ).event_instruments_id;
  const qtyA = status['Available'];
  const qtyP = status['Pending'];

  // console.log(eventUser.includes(currentUser.userData.id))

  if (status['Available'] > 0 && !eventUser.includes(currentUser.userData.id)) {
   const status = [
    { name: 'Available', quantity: qtyA - 1 },
    { name: 'Pending', quantity: qtyP + 1 },
    { name: 'Filled', quantity: 0 },
   ];
   console.log('confirmation request submitted');
   axios
    .put(
     `/api/event_instruments/${eventInstrumentId}`,
     {
      status: status,
     },
     {
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
     }
    )
    .then((response) => {
     console.log('PUT response >>>', response);
      const organizerNum = userPhone.replace(/[^0-9]/g, '') 

      const currentUser = JSON.parse(localStorage.getItem("user"));
      
      let sms_message = {
        mobile_number: `+1${organizerNum}`, 
        message: `${currentUser.userData.first_name} wants to join your session "${title}"! Text ${currentUser.userData.phone} for futher chat! Accept the offer on your browser!`
    }
    
      axios.post("/api/sms_messages", 
        {sms_message}
        ).then(res => console.log(res))
        .catch(error => {
        console.log("sending SMS error", error)
      })
     
      const event =  events.find((e) => {
        return e.id === eventId
      })
     
      const eventInstrument = event.event_instruments.find((instrument) =>{
        return instrument.id === eventInstrumentId
      })
      eventInstrument.status = status;
      event.event_instruments = event.event_instruments.map((instrument) =>{
        if( instrument.id === eventInstrumentId){
          return eventInstrument
        }else{
          return instrument
        }
      })
      const newEvents = events.map((e) =>{
        if(e.id === eventId){
          return event
        }else{
          return e
        }
      })
      setEvents(newEvents)
      setUserSignedUp(true);

     console.log('event update was successful');
     //>>>>>>>>>>>>>>>>>>>>
     return axios.post(
      `/api/new_attendee`,
      {
       accepted: false,
       user_id: currentUser.userData.id,
       event_instrument_id: event_instruments_id,
      },
      {
       headers: {
        'Content-type': 'application/json; charset=UTF-8',
       },
      }
     );
    })
    .then((response) => {
     console.log('POST attendee response >>>', response.data);
    })
    .catch((error) => {
     console.log(`Error: ${error.request}`);
     console.log('Error', error);
    });
   setTimeout(function () {
    handleOpenMsg();
   }, 1500);
   //>>>>>>>>>>>>>>>>>>>>>>>>>>
  } else {
   setTimeout(function () {
    handleOpenNA();
   }, 2500);
  }
 };

 return (
  <EventStyles>
   <div className="card">
    <div className="eventCard">
     <div className="left">
      <div className="top">
       <div className="event-name">{title}</div>
       <div className="event-organiser">
        <strong>By:&nbsp;&nbsp;</strong>
        {user}
       </div>
       <div className="heart-icon" onClick={handleLike}>
        {like ? (
         <BsHeartFill
          style={{ color: 'rgb(244, 56, 56)', fontSize: '1.6rem' }}
         />
        ) : (
         <BsHeartFill
          style={{ color: 'whitesmoke', fontSize: '1.6rem' }}
          onMouseOver={({ target }) =>
           (target.style.color = 'rgb(244, 56, 56)')
          }
          onMouseOut={({ target }) =>
           (target.style.color = 'rgba(244, 56, 56,0.2)')
          }
         />
        )}
       </div>
      </div>

      <div className="event-details">
       <div className="event-date">
        <strong>Date:&nbsp;&nbsp;</strong>
        {date}
       </div>
       <div className="details">
        <div className="details1">
         <div className="event-location">
          <strong>Location:&nbsp;&nbsp;</strong>
          {city}, {country}
         </div>
         <div className="event-level">
          <strong>Level:&nbsp;&nbsp;</strong> {level}
         </div>
        </div>
        <div className="details2">
         <div className="event-venue">
          <strong>Venue:&nbsp;&nbsp;</strong>
          {venue}
         </div>
         <div className="genre">
          <strong>Genre:&nbsp;&nbsp;</strong>
          {genre}
         </div>
        </div>
       </div>
      </div>

      <div className="event-description">{description}</div>

      <div className="spots">
       <div className="spots-heading">AVAILABLE SPOTS</div>
       <ConfirmationModal
        eventInstrumentId={activeEventInstrument}
        eventId={activeEventId}
        show={show}
        onHide={handleClose}
        onConfirm={handleConfirm}
        userPhone={userPhone}
        title={title}
       />
       <MesssageSentModal
        show={showMsg}
        onHide={handleCloseMsg}
        onClose={handleOpenMsg}
       />
       <NotAvailableModal
        show={showNAvail}
        onHide={handleCloseNA}
        onClose={handleOpenNA}
       />
       <div className="instrument-icons">
        <div className="icons">{getEventData()}</div>
       </div>
      </div>
     </div>

     <div className="right">
      <img className="main_image" src={image} alt="" />
      <TimeAgo className="timeago" date={created}></TimeAgo>
     </div>
    </div>
   </div>
  </EventStyles>
 );
}

export default EventListItem;

import React, { useState, useEffect } from 'react';
import EventListItem from './EventListItem';
import EventFilter from './EventFilter';
import styled from 'styled-components';
import '../../scss/custom.scss';
import '../../App.scss';

const api_url = `http://localhost:3000/api/events`;

const Styles = styled.div`
 .event {
  background: #fcfcfc;
 }
`;

function EventList() {
 const [state, setState] = useState({ items: [] });

 function getData() {
  fetch(api_url)
   .then((response) => response.json())
   .then((response_items) => {
    setState({ items: response_items });
   });
 }

 useEffect(() => {
  getData();
 }, []);

//  console.log(state.items);
 return (
  <Styles>
   <div className="event">
    <EventFilter api-url={api_url} state={state}/>
    {/* {state.items.map((item) => {
     return (
      <>
       <EventListItem
        key={item.id}
        title={item.title}
        user={item.user.handle}
        date={item.event_date}
        start={item.start_time}
        end={item.end_time}
        city={item.city}
        country={item.country}
        level={item.level}
        venue={item.venue_style}
        genre={item.genre}
        image={item.event_image}
        description={item.description}
        status={item.post_active}
        created={item.created_at}
       />
      </>
     );
    })} */}
   </div>
  </Styles>
 );
}

export default EventList;

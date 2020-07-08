import React from "react";

import EventItem from "./EventItem";
import "./EventList.css";

const eventList = (props) => {
  const events = props.events.map((event) => {
    console.log("event id: ", event._id);
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        eventTitle={event.title}
        eventPrice={event.price}
        eventDate={event.date}
        userId={props.authUserId}
        creatorId={event.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="event__list">{events}</ul>;
};

export default eventList;

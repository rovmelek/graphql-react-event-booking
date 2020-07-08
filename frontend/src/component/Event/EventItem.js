import React from "react";

import "./EventItem.css";

const eventItem = (props) => {
  console.log(props);
  return (
    <li key={props.eventId} className="event__list-item">
      <div>
        <h1>{props.eventTitle}</h1>
        <h2>
          ${props.eventPrice} - {new Date(props.eventDate).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default eventItem;

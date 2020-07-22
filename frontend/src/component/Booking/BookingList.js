import React from "react";

import "./BookingList.css";

const bookingList = (props) => {
  return (
    <ul className="bookings__list">
      {props.bookings.map((el) => {
        return (
          <li className="bookings__item" key={el._id}>
            <div className="bookings__item-data">
              {el.event.title} - {new Date(el.createdAt).toLocaleDateString()} -
              ${el.event.price}
            </div>
            <div className="bookings__item-actions">
              <button
                className="btn"
                onClick={props.onDelete.bind(this, el._id)}
              >
                Cancel
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default bookingList;

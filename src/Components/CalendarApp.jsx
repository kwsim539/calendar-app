import {useState} from 'react'
const CalendarApp = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentyear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({hours: "00", minutes: "00"});
    const [eventText, setEventText] = useState("");
    const [editingEvent, setEditingEvent] = useState(null);

    const daysInMonth = new Date(currentyear, currentMonth + 1, 0).getDate(); // Calculate days of the current month
    const firstDayOfMonth = new Date(currentyear, currentMonth, 1).getDay(); // get the first day of the month

    // Calendar button functions
    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    }
    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    }

    const handleDailyClick = (day) => {
        const clickdate = new Date(currentyear, currentMonth, day);
        const today = new Date();
        if (clickdate >= today || isSameDay(clickdate, today)) {
            setSelectedDate(clickdate);
            setShowEventPopup(true);
            setEventText("");
            setEventTime({hours: "00", minutes: "00"});
            setEditingEvent(null);
        }
    }
    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }

    const handleEventSubmit = () => {
        const newEvent = {
            id: editingEvent ? editingEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
        }

        let updatedEvents = [...events]

        if (editingEvent) {
            updatedEvents = updatedEvents.map((event) =>
                event.id === editingEvent.id ? newEvent : event,
            )
        } else {
            updatedEvents.push(newEvent);
        }

        updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

        setEvents(updatedEvents)
        setEventTime({hours: "00", minutes: "00"})
        setEventText("")
        setShowEventPopup(false)
        setEditingEvent(null)
    }

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date));
        setEventTime({
            hours: event.time.split(':')[0],
            minutes: event.time.split(':')[1],
        });
        setEventText(event.text);
        setEditingEvent(event);
        setShowEventPopup(true);
    }

    const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter(event => event.id !== eventId);
        setEvents(updatedEvents);
    }

    const handelTimeChange = (e) => {
        const {name, value} = e.target;
        setEventTime((prevTime) => ({...prevTime, [name]: value.padStart(2, '0') }));
    }

    console.log(daysInMonth, firstDayOfMonth);

    return (
        <div className="calendar-app">
            <div className="calendar">
                <h1 className="heading">Calendar</h1>
                <div className="navigate-date">
                    <h2 className="navigate-date__month">{monthsOfYear[currentMonth]},</h2>
                    <h2 className="navigate-date__year">{currentyear}</h2>
                    <div className="navigate-date-buttons">
                        <i role="button" className="bx bx-chevron-left" onClick={prevMonth}></i>
                        <i role="button" className="bx bx-chevron-right" onClick={nextMonth}></i>
                    </div>
                </div>
                <div className="weekdays">
                    {daysOfWeek.map((day) => <span key={day}>{day}</span>)}
                </div>
                <div className="calendar-days">
                    {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                        // Now for each index the arrow function returns an empty span element.
                        // The key attribute is set to a unique value empty index to help react Identify which items have changed, are added, or are removed.
                        <span key={`empty${index}`} />
                    ))}
                    {[...Array(daysInMonth).keys()].map((day, index) =>
                        // Dynamically generate and display the dates of the current month in a calendar.
                        <span key={day +1} className={
                            day + 1 === currentDate.getDate() &&
                            currentMonth === currentDate.getMonth() &&
                            currentyear === currentDate.getFullYear()
                                ? 'current-day'
                                : ''
                        }
                              onClick={() => handleDailyClick(day +1)}
                        >
                            {day +1}
                        </span>
                    )}
                </div>
            </div>
            <div className="events">
                {showEventPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">Time</div>
                            <label htmlFor="hours" className="sr-only">Event Hours</label>
                            <input
                                type="number"
                                name="hours"
                                id="hours"
                                min={0}
                                max={24}
                                className="hours"
                                value={eventTime.hours}
                                onChange={handelTimeChange} />
                            <label htmlFor="minutes" className="sr-only">Event minutes</label>
                            <input
                                type="number"
                                name="minutes"
                                id="minutes"
                                min={0}
                                max={60}
                                className="minutes"
                                value={eventTime.minutes}
                                onChange={handelTimeChange} />
                        </div>
                        <label htmlFor="event-desc" className="sr-only">Event Description</label>
                        <textarea
                            placeholder="Enter Event Info (Max Chars: 60)"
                            name="event-desc"
                            id="event-desc"
                            cols="30"
                            rows="10"
                            value={eventText}
                            onChange={(e) => {
                                if (e.target.value.length <= 60) {
                                    setEventText(e.target.value)
                                }
                            } }></textarea>
                        <button className="event-popup-btn" aria-label={editingEvent ? "Update Event" : "Add Event"} onClick={handleEventSubmit}>
                            {editingEvent ? "Update Event" : "Add Event"}
                        </button>
                        <button className="close-event-popup-btn" aria-label="Close Event" onClick={() => setShowEventPopup(false)}>
                            <span className="sr-only">Close Event</span>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                )}
                {events.map((event, index) => (
                    <div className="event" key={index}>
                        <div className="event-date-wrapper">
                            <div className="event-date__date">
                                {`
                                ${monthsOfYear[event.date.getMonth()]} 
                                ${event.date.getDate()}, 
                                ${event.date.getFullYear()}
                                `}
                            </div>
                            <div className="event-date__time">{event.time}</div>
                        </div>
                        <div className="event__text">
                            {event.text}
                        </div>
                        <div className="event-buttons">
                            <i role="button" className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
                            <i role="button" className="bx bxs-message-alt-x" onClick={() => handleDeleteEvent(event.id)}></i>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default CalendarApp;

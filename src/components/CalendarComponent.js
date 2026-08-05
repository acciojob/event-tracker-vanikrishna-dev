import React, { useMemo, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function CalendarComponent({ filter, setFilter }) {
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [modalType, setModalType] = useState(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            if (filter === "all") return true;
            if (filter === "past") return moment(event.start).isBefore(moment(), "day");
            if (filter === "upcoming") {
                return (
                    moment(event.start).isAfter(moment(), "day") ||
                    moment(event.start).isSame(moment(), "day")
                );
            }
            return true;
        });
    }, [events, filter]);

    const openCreateModal = (slotInfo) => {
        setSelectedSlot(slotInfo);
        setSelectedEvent(null);
        setTitle("");
        setLocation("");
        setModalType("create");
    };

    const openDetailsModal = (event) => {
        setSelectedEvent(event);
        setTitle(event.title);
        setLocation(event.location || "");
        setModalType("details");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedSlot(null);
        setSelectedEvent(null);
        setTitle("");
        setLocation("");
    };

    const addEvent = () => {
        if (!title.trim() || !selectedSlot) return;

        const newEvent = {
            id: Date.now(),
            title: title.trim(),
            location: location.trim(),
            start: selectedSlot.start,
            end: selectedSlot.end,
        };

        setEvents((prev) => [...prev, newEvent]);
        closeModal();
    };

    const updateEvent = () => {
        if (!title.trim() || !selectedEvent) return;

        setEvents((prev) =>
            prev.map((event) =>
                event.id === selectedEvent.id
                    ? { ...event, title: title.trim(), location: location.trim() }
                    : event
            )
        );

        closeModal();
    };

    const deleteEvent = () => {
        if (!selectedEvent) return;
        setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id));
        closeModal();
    };

    const eventStyleGetter = (event) => {
        const isPast = moment(event.start).isBefore(moment(), "day");

        return {
            style: {
                backgroundColor: isPast ? "rgb(222, 105, 135)" : "rgb(140, 189, 76)",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
            },
        };
    };

    return (
        <div className="calendar-wrapper">
            <div className="topbar">
                <div>
                    <button
                        className="nav-btn"
                        onClick={() =>
                            setCurrentDate((prev) => moment(prev).subtract(1, "month").toDate())
                        }
                    >
                        ← Prev
                    </button>
                </div>

                <div>
                    <button
                        className="nav-btn"
                        onClick={() =>
                            setCurrentDate((prev) => moment(prev).add(1, "month").toDate())
                        }
                    >
                        Next →
                    </button>
                </div>

                <div className="month-title">{moment(currentDate).format("MMMM YYYY")}</div>

                <div>
                    <button
                        className="btn"
                        style={{ backgroundColor: "rgb(127, 155, 208)" }}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                </div>

                <div>
                    <button
                        className="btn"
                        style={{ backgroundColor: "rgb(222, 105, 135)" }}
                        onClick={() => setFilter("past")}
                    >
                        Past
                    </button>
                </div>

                <div>
                    <button
                        className="btn"
                        style={{ backgroundColor: "rgb(140, 189, 76)" }}
                        onClick={() => setFilter("upcoming")}
                    >
                        Upcoming
                    </button>
                </div>
            </div>

            <Calendar
                selectable
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                views={["month"]}
                view="month"
                toolbar={false}
                popup={false}
                date={currentDate}
                onNavigate={(date) => setCurrentDate(date)}
                onSelectSlot={openCreateModal}
                onSelectEvent={openDetailsModal}
                eventPropGetter={eventStyleGetter}
                style={{ height: "85vh" }}
            />

            {modalType && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>
                                {modalType === "create" && "Create Event"}
                                {modalType === "edit" && "Edit Event"}
                                {modalType === "details" && selectedEvent?.title}
                            </h3>
                            <button className="close-btn" onClick={closeModal}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            {(modalType === "create" || modalType === "edit") && (
                                <>
                                    <input
                                        placeholder="Event Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <input
                                        placeholder="Event Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </>
                            )}

                            {modalType === "details" && selectedEvent && (
                                <div className="event-details">
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {moment(selectedEvent.start).format("MMMM DD, YYYY")}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {selectedEvent.location || "No location"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <div className="mm-popup__box__footer__left-space">
                                {(modalType === "create" || modalType === "edit") && (
                                    <button className="mm-popup__btn cancel-btn" onClick={closeModal}>
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <div className="mm-popup__box__footer__right-space">
                                {modalType === "create" && (
                                    <button className="mm-popup__btn" onClick={addEvent}>
                                        Save
                                    </button>
                                )}

                                {modalType === "details" && (
                                    <>
                                        <button
                                            className="mm-popup__btn--info"
                                            onClick={() => setModalType("edit")}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="mm-popup__btn--danger"
                                            onClick={deleteEvent}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}

                                {modalType === "edit" && (
                                    <button className="mm-popup__btn" onClick={updateEvent}>
                                        Save
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarComponent;
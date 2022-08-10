import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DirectUpload } from 'activestorage';
import axios from 'axios';

function NewEvent (props) {

	const [title, setTitle] = useState("")
	const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
	const [level, setLevel] = useState("")
  const [venue, setVenue] = useState("")
  const [genre, setGenre] = useState("")
  const [eventImage, setEventImage] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

	const navigate = useNavigate();

	const currentUser = JSON.parse(localStorage.getItem("user"));

	const handleSubmit = (e) => {
		console.log("Submitted new event!")
		axios.post("/api/new_event",
            {
                event: {
										user_id: currentUser.userData.id,
										title: title,
										city: city,
                    country: country,
										level: level,
                    venue_style: venue,
                    genre: genre,
										description: description,
										event_date: eventDate,
										start_time: startTime,
                    end_time: endTime,
                }
            },
            { withCredentials: true }
        ).then(response => {
					console.log("axios call response>>>>>", response);
					if (response.data.status === 'created') {
							console.log("event POST is successful. response data:", response.data);
							uploadFile(eventImage, response.data.event.id)
              console.log("after uploadFile Run data >>>>>>>>>", response);
					}
        }).catch(error => {
            console.log("event creation error", error)
        })
    e.preventDefault()
	}

	const uploadFile = (file, eventId) => {
		const upload = new DirectUpload(file, '/api/rails/active_storage/direct_uploads')
		upload.create((error, blob) => {
			if (error) {
				console.log(error)
			} else {
				fetch(`/api/events/${eventId}`, {
					method: 'PUT',
					headers: {
							'Content-Type': 'application/json' 
					},
					body: JSON.stringify({event_image: blob.signed_id})
			})
			.then(resp => resp.json())
			.then(data => {
					console.log('updated event', data)
					navigate('/events');
			})
			}
		})
	}
	
	
	return (
		<div className="base-container">
			<div className="header"><h1>Organize a new session!</h1></div>
				<div className="content">
					<div className="form">
						<div className="form-group">
							<form onSubmit={handleSubmit}>
							<div className="container">
                  <div className="box">

							  <label htmlFor="title">Title</label>
								<input
									type="text"
									name="title"
									placeholder="Title"
									value={title}
									onChange={e => setTitle(e.target.value)}
									required
									/>

									<label htmlFor="city">city</label>
									<input
									type="text"
									name="city"
									placeholder="City"
									value={city}
									onChange={e => setCity(e.target.value)}

									required
									/>

								<label htmlFor="country">Country</label>
								<input
									type="text"
									name="country"
									placeholder="Country"
									value={country}
									onChange={e => setCountry(e.target.value)}
									required
									/>

								<label htmlFor="level">Proficiency</label>
								<input
									type="text"
									name="level"
									placeholder="Level"
									value={level}
									onChange={e => setLevel(e.target.value)}
									required
								/>
									
								<label htmlFor="genre">Genre</label>
								<input
									type="text"
									name="Genre"
									placeholder="Genre"
									value ={genre}
									onChange={e => setGenre(e.target.value)}
									required
							/>

								<label htmlFor="venue">Venue</label>
								<input
									type="text"
									name="Venue"
									placeholder="Venue"
									value ={venue}
									onChange={e => setVenue(e.target.value)}
									required
							/>
								</div>
								<div className="box">

								<label htmlFor="description">Event Description</label>
								<input
									type="text"
									name="description"
									placeholder="Event Description"
									value ={description}
									onChange={e => setDescription(e.target.value)}
									required
							/>

							
								<label htmlFor="event_image">Image</label>
								<input
									type="file"
									name="event_image"
									placeholder="Event Picture"
									onChange={e => setEventImage(e.target.files[0])}
									required
									direct_upload='true'
								/>   

								<label htmlFor="date">Event date</label>
								<input
									type="date"
									name="event_date"
									placeholder="Event Date"
									value ={eventDate}
									onChange={e => setEventDate(e.target.value)}
									required
							/>

								<label htmlFor="start_time">Start Time</label>
								<input
									type="time"
									name="start_time"
									placeholder="Event Start Time"
									value ={startTime}
									onChange={e => setStartTime(e.target.value)}
									required
							/>

								<label htmlFor="end_time">End Time</label>
								<input
									type="time"
									name="end_time"
									placeholder="Event End Time"
									value ={endTime}
									onChange={e => setEndTime(e.target.value)}
									required
							/>

								<button type="submit">
									Create a new event
								</button>
		</div>
		</div>
		

						</form>
					</div>
				</div>
			</div>
		</div>

	);
}

export default NewEvent;

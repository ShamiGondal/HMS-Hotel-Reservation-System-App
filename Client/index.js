const localhost = "https://hotelreservationsystemmern-production.up.railway.app";
document.addEventListener("DOMContentLoaded", function () {
  loadRooms();
  getReservations();
  document.getElementById("cardContainer").addEventListener("click", function (event) {
    var target = event.target;
    if (target.classList.contains("btn-danger")) {
      likes(event);
    } else if (target.classList.contains("btn-warning")) {
      addComment(event);
    } else if (target.classList.contains("btn-primary")) {
      RoomDetails(event);
    } else if (target.classList.contains("btn-info")) {
      roomReservation(event);
    }
  });

});

async function loadRooms() {
  let cardContainer = document.getElementById("cardContainer");
  try {
    let response = await fetch(`${localhost}/api/rooms/fetchRooms`);
    if (!response.ok) {
      cardContainer.innerHTML = "Could not load the rooms";
    } else {
      const data = await response.json();


      for (let i = 0; i < data.length; i++) {
        const rec = data[i];

        let roomsDiv = document.createElement("div");
        roomsDiv.className = "room";
        roomsDiv.setAttribute("data-id", rec._id);
        const dbdate = new Date(rec.date);
        const formattedDate = dbdate.toLocaleDateString();
        let status = rec.reservation ? "Booked" : "Available";
        roomsDiv.innerHTML = ` <div class="container mt-5 border-4 shadow-lg border-black p-3">
        <div class="row">
          <div class="col-lg-10 col-md-9 border-1 border-black d-lg-flex d-md-flex">
            <img class="d-lg-block d-none" src="${rec.picture
          }" height="170px" width="150px" alt="">
            <img class="d-lg-none position-relative d-flex" src="${rec.picture
          }" height="250px" width="300px" alt="">
            <div class="ms-md-4 ms-lg-4 mt-3 mt-md-0 mt-lg-0">
              <h3>${rec.name}</h3>
              <div class="d-flex"> <p><p class="fw-bold me-2">Details:</P>  ${rec.description} </p></div>
              <div class="d-flex"> <p><p class="fw-bold me-2">Facilities:</P>  ${rec.Rtype} </p></div>
            </div>
          </div>
          <div class="col">
            <div id='likeCount_${rec._id
          }' class="list-group-item" data-liked="${false}">
              <span class="list-group-item mb-2 text-primary fw-bolder"><h5>Price: ${rec.price
          }$</h5></span>
              <span class="list-group-item mb-4 text-warning fw-bolder">Date: ${formattedDate}</span>
              <button id='heartBtn' class="btn btn-danger border-0 heartBtn">
                <i class="fa-regular fa-heart"></i>
              </button>
              <span class="like-count text-danger fw-bold">${rec.likes}</span>
              <button type="button" class="btn btn-primary w-75 h-100 mt-3" data-toggle="modal" data-target="#exampleModal#exampleModal">
                Book Now
             </button>
             <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
             <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document">
                 <div class="modal-content">
                     <div class="modal-header">
                         <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                             <span aria-hidden="true">&times;</span>
                         </button>
                     </div>
                     <div id="modalbody" class="modal-body"></div>
                     <div class="modal-footer">
                         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                         <button type="button" class="btn btn-info ">Confirm Booking</button>
                     </div>
                 </div>
             </div>
         </div>
            </div>
          </div>
        </div>
      </div>`
        cardContainer.appendChild(roomsDiv);
      }
    }
  } catch (error) { }
}
let modal;
async function RoomDetails(event) {
  let btn = event.target;
  let parentDiv = btn.closest(".room");
  let id = parentDiv.getAttribute("data-id");

  try {
    let response = await fetch(`${localhost}/api/rooms/fetchRoom/${id}`);
    if (!response.ok) {
      modalbody.innerHTML = "Could not load the rooms";
    } else {
      const rec = await response.json();

      modal = new bootstrap.Modal(document.getElementById(`exampleModal`));

      let modalBody = modal._element.querySelector(".modal-body");
      modalBody.innerHTML = "";
      let roomDiv = document.createElement("div");
      roomDiv.className = "Proom";
      roomDiv.setAttribute("data-id", rec._id);
      roomDiv.innerHTML = `
      <div class="container">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col-lg-12 col-md-9">
                <img class="img-fluid h-25" src="${rec.picture}" alt="hotelImage">
            </div>
            <div class="col">
                <div id='likeCount_${rec._id}' class="list-group-item d-block d-md-flex d-lg-flex justify-content-between align-items-center" data-liked="${false}">
                <div class="mt-5 mt-md-0 mt-lg-0 col-md-6 col-lg-6 col-12">
                <h3 class="mt-5">${rec.name}</h3>
                <div class="d-flex"><p><h6 class="fw-bold me-2">Details:</h6> ${rec.description} </p></div>
                <div class="d-flex"><p><h6 class="fw-bold me-2">Facilities:</h6> ${rec.Rtype}</p></div>
                <div class="d-flex"><p><h6 class="fw-bold me-2">Address:</h6> The Mall Rd, Rawalpindi, Punjab 46000</p></div>
                <div class="d-flex"><p><h6 class="fw-bold me-2">Departments:</h6> PC Hotel Swimming Pool</p></div>
                <div class="d-flex"><p><h6 class="fw-bold me-2">Phone:</h6> (051) 111 505 505</p></div>
            </div>            
                    <div class="mt-5">
                        <div class=" align-items-center">
                            <span class="list-group-item mb-2">
                                <h5 class="text-primary fw-bolder">Price: ${rec.price}$</h5>
                            </span>
                            </div>
                            <button id='heartBtn' class="btn btn-danger border-0 heartBtn">
                            <i class="fa-regular fa-heart"></i>
                            </button>
                            <span class="like-count text-danger fw-bolder">${rec.likes}</span>
                        <div class="list-group-item mb-3 fw-bold text-dark">Comments:</div>
                        <div id="NewcommentOut" class="list-group-item mb-1">
                            ${rec.comments.map((comment) => `<div id="NewcommentOut" class="list-group-item mb-1 text-dark">Anonymous: ${comment}
                            </div>`).join("")}
                        </div>
                        <div class="input-group flex-nowrap">
                            <input type="text" id="newComment" name="newComment" class="form-control" placeholder="Comment here"
                                aria-label="Comment here" aria-describedby="addon-wrapping">
                            <span class="input-group-text" id="addon-wrapping">
                                <button class="border-0 btn btn-warning">
                                    <i class="fa-regular fa-paper-plane"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <h1 class="text-primary fw-bolder fs-2 mt-5 text-center ">Reservation Process</h1>
            <form id="reservationForm">
            <div class="mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="fullName" aria-describedby="emailHelp">
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="container mt-5">
                <div class="mb-3 row">
                    <div class="col-md-6">
                        <label for="startDate" class="form-label">Arrival Date:</label>
                        <input type="date" class="form-control" id="startDate" name="startDate" required>
                    </div>
                    <div class="col-md-6">
                        <label for="startTime" class="form-label">Arrival Time:</label>
                        <input type="time" class="form-control" id="startTime" name="startTime" required>
                    </div>
                </div>
        
                <div class="mb-3 row">
                    <div class="col-md-6">
                        <label for="endDate" class="form-label">Departure Date:</label>
                        <input type="date" class="form-control" id="endDate" name="endDate">
                    </div>
                    <div class="col-md-6">
                        <label for="endTime" class="form-label">Departure Time:</label>
                        <input type="time" class="form-control" id="endTime" name="endTime">
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <label for="formFile" class="form-label">Payment recipient</label>
                <input class="form-control" type="file" id="formFile">
            </div>
        </form>
        </div>
    </div>
    `;

      modalBody.appendChild(roomDiv);


    }
  } catch (error) {
    console.error(error);
  }
}


async function likes(event) {
  try {
    event.preventDefault();

    let btn = event.target;
    let parentDiv = btn.closest(".room");
    let id = parentDiv.getAttribute("data-id");

    let likeCountContainer = document.getElementById(`likeCount_${id}`);
    let likeCount = likeCountContainer.querySelector(".like-count");

    let isLiked = likeCountContainer.getAttribute("data-liked") === "true";

    if (!isLiked) {
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
      console.log("Successfully increased the likes");
      let res = await fetch(`${localhost}/api/rooms/likes/${id}`, {
        method: "POST",
      });
      if (!res.ok) {
        console.log("can not update the likes");
      }
    } else {
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
      console.log("Successfully decreased the likes");
    }

    likeCountContainer.setAttribute("data-liked", isLiked ? "false" : "true");
  } catch (error) {
    console.log(error + "error occurred");
  }
}

async function addComment(event) {
  let btn = event.target;
  let parentDiv = btn.closest(".room");
  let id = parentDiv.getAttribute("data-id");
  let newComment = document.getElementById("newComment");
  let NewcommentOut = document.getElementById("NewcommentOut");

  try {
    let req = await fetch(`${localhost}/api/rooms/comments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: newComment.value }),
    });

    if (!req.ok) {
      throw new Error(`Server responded with status ${req.status}`);
    }

    const res = await req.json();
    console.log(res + "successfully posted the comment");

    let commentDiv = document.createElement('div');
    commentDiv.className = 'list-group-item mb-1';
    commentDiv.innerText = newComment.value;
    NewcommentOut.appendChild(commentDiv);
    NewcommentOut.scrollTop = NewcommentOut.scrollHeight;
    newComment.value = '';
  } catch (error) {
    console.error(error);
    console.log("Error:", error.message);
  }
}






async function roomReservation(event) {
  let btn = event.target;
  let parentDiv = btn.closest(".room");
  let id = parentDiv.getAttribute("data-id");

  let fullName = document.getElementById('fullName').value;
  let email = document.getElementById('email').value;
  let startDate = document.getElementById('startDate').value;
  let startTime = document.getElementById('startTime').value;
  let endDate = document.getElementById('endDate').value;
  let endTime = document.getElementById('endTime').value;

  try {
    let req = await fetch(`${localhost}/api/rooms/reservation/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime
      }),
    });

    const rec = await req.json();

    let reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
      if (rec.success) {
        reservationForm.innerHTML = `<div class="d-flex justify-content-center align-items-center flex-column">
          <h3 class="text-danger text-center fw-bold mt-4">Thanks, Your Booking is confirmed</h3>`;
      } else {
        // Display an alert if the reservation was unsuccessful
        alert(rec.message);
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function getReservations() {
  try {
    let req = await fetch(`${localhost}/api/rooms/getAllReservations`, {
      method: "GET",
    });

    const rec = await req.json();

    let reservationContainer = document.getElementById('reservationContainer');
    if (reservationContainer) {
      reservationContainer.innerHTML = "";

      for (let i = 0; i < rec.length; i++) {
        const room = rec[i];
        let roomHeader = document.createElement('h5');
        roomHeader.innerText = `Room ${i + 1}`;
        reservationContainer.appendChild(roomHeader);

        if (room.reservations.length > 0) {
          let table = document.createElement('table');
          table.className = 'table';


          table.innerHTML = `
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">FullName</th>
                <th scope="col">Email</th>
                <th scope="col">Arrival Date</th>
                <th scope="col">Dep Date</th>
                <th scope="col">Arrival Time</th>
                <th scope="col">Dep Time</th>
                <th scope="col">Payment</th>
                <th scope="col">Delete</th> 
              </tr>
            </thead>
            <tbody></tbody>`;

          for (let j = 0; j < room.reservations.length; j++) {
            const reservation = room.reservations[j];
            let dbstartDate = new Date(reservation.startDate);
            let dbendDate = new Date(reservation.endDate);
            let startDate = dbstartDate.toLocaleDateString();
            let endDate = dbendDate.toLocaleDateString();
            let row = table.querySelector('tbody').insertRow();
            row.innerHTML = `
              <td>${j + 1}</td>
              <td>${reservation.fullName}</td>
              <td>${reservation.email}</td>
              <td>${startDate}</td>
              <td>${endDate}</td>
              <td>${reservation.startTime}</td>
              <td>${reservation.endTime}</td>
              <td>Done</td>
              <td><button class="btn btn-danger btn-grey btn-sm  " data-id="${reservation._id}" onClick="deleteReservation('${reservation._id}')">Delete</button></td>`;
          }
          reservationContainer.appendChild(table);
        } else {
          let noReservationsMsg = document.createElement('p');
          noReservationsMsg.innerText = 'No reservations for this room.';
          reservationContainer.appendChild(noReservationsMsg);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}


async function deleteReservation(reservationId) {
  const id = reservationId

  try {

    let req = await fetch(`${localhost}/api/rooms/deleteReservation/${id}`, {
      method: 'DELETE'
    })
    const res = req.json();
    if (res) {
      getReservations();
      console.log("successfully deleted the reservation")
    } else {

      console.log("can not delete the reservation")
    }

  } catch (error) {
    console.log(error);
  }


}
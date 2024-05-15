const API = "https://directory.messant.in/api"
var AUTH_TOKEN = ""

$(document).ready(function () {
    const token = getCookie('token');
    if (token) {
        console.log('Token found:', token);
        AUTH_TOKEN = token
        // Do something with the token, like setting it in state if using React
        loadHome()
    } else {
        console.log('Token not found');
        $("#loginModal").modal('show');
        // Handle the case when the token is not found
    }


    $("#btnSendCode").on('click', () => {
        let phone = $.trim($("#inputLoginPhone").val());
        if (phone.length < 10) {
            $("#textLoginStatus").text("Enter 10 digit phone number")
            return
        }
        $.ajax({
            url: API + "/login/" + phone,
            method: "GET",
            beforeSend: () => {
                $("#textLoginStatus").text("")
                $("#loadingLogin").removeClass("d-none")
            },
            success: (data) => {
                $("#loadingLogin").addClass("d-none")
                console.log(data)
                if (data.isUser) {
                    $("#inputLoginOtp").prop("disabled", false);
                    $("#inputLoginPhone").prop("disabled", true);
                    $("#btnVerifyCode").removeClass("d-none")
                    $("#btnSendCode").addClass("d-none")
                    AUTH_TOKEN = data.message
                } else {
                    $("#textLoginStatus").text(data.message)
                }
            }

        })
    })

    $("#btnVerifyCode").on('click', () => {
        let otp = $.trim($("#inputLoginOtp").val());
        $.ajax({
            url: API + "/login",
            method: "POST",
            data: {
                otp: otp
            },
            beforeSend: (request) => {
                request.setRequestHeader("authorization", AUTH_TOKEN);
                $("#textLoginStatus").text("");
                $("#loadingLogin").removeClass("d-none");
            },
            success: (data) => {
                $("#loadingLogin").addClass("d-none")
                console.log(data)
                if (data.isUser) {
                    AUTH_TOKEN = data.message
                    setCookie('token', AUTH_TOKEN, 30)
                    $("#loginModal").modal('hide')
                    loadHome()
                } else {
                    $("#textLoginStatus").text(data.message)
                }
            }

        })
    })

    $("#searchButtonInit").on('click', () => {
        $("#searchModel").modal('show');
    })

    $('#inputSearchBar').keyup(function () {
        var searchString = $("#inputSearchBar").val().trim()
        console.log(searchString)

        if (searchString.length == 0) {
            $("#searchResult").html("")
            return
        }

        $.ajax({
            url: API + "/search/ALL/" + searchString,
            method: "GET",
            beforeSend: (request) => {
                request.setRequestHeader("authorization", AUTH_TOKEN);
                $("#searchResult").html(`<div class="d-flex justify-content-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>`)
            },
            success: (data) => {
                console.log(data)
                $("#searchResult").html("")
                data.forEach(listItem => {
                    var IMAGE = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/1200px-Lions_Clubs_International_logo.svg.png"
                    if (listItem.image != null) {
                        IMAGE = listItem.image
                    }

                    var PDG_LABEL = ""

                    if (listItem.role == "PDG") {
                        PDG_LABEL = `<p class="card-text m-0">YEAR: <small class="text-body-secondary">${listItem.year_start} - ${listItem.year_end}</small></p>`
                    }


                    $("#searchResult").append(`<div class="card mb-3">
  <div class="row g-0">
    <div class="col-2">
      <img src="${IMAGE}" class="img-fluid rounded-start" alt="${listItem.name}">
    </div>
    <div class="col-10">
      <div class="card-body">
        <h5 class="card-title">${listItem.name}</h5>
        <p class="card-text m-0">${listItem.role} | ${listItem.designation}</p>
        <p class="card-text m-0">${listItem.club}</p>
        ${PDG_LABEL}
        <p class="card-text m-0">ID: <small class="text-body-secondary">${listItem.uid}</small></p>
        <p class="card-text m-0">IM NO: <small class="text-body-secondary">${listItem.im}</small></p>
        <p class="card-text m-0">Phone no: <small class="text-body-secondary">${listItem.mobile}</small></p>
        <p class="card-text m-0">Email Id: <small class="text-body-secondary">${listItem.email}</small></p>
      </div>
    </div>
  </div>
</div>`)
                })
            }

        })
    });
});




function loadHome() {
    $.ajax({
        url: API + "/home",
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
        },
        success: (data) => {
            console.log(data)
            $("#textUserName").text(data.user.name)
            $("#textUserDesignation").text(`${data.user.role} | ${data.user.club}`)
            $("#navUserName").text(data.user.name.split(" ")[0])
            if (data.user.image != null) {
                $("#imgUser").attr('src', data.user.image)
                $("#navUserImage").attr('src', data.user.image)

            }

            $("#listLeft").html("")
            data.menus.forEach(menu => {
                var icon = ""

                if (menu.type == "HOME") {
                    icon = `<i class="bi bi-house-fill"></i>`
                } else if (menu.type == "ZONE") {
                    icon = `<i class="bi bi-buildings-fill"></i>`
                } else if (menu.type == "USER") {
                    icon = `<i class="bi bi-people-fill"></i>`
                } else if (menu.type == "PAGE") {
                    icon = `<i class="bi bi-browser-safari"></i>`
                } else {
                    icon = `<i class="bi bi-list-ul"></i>`
                }

                $("#listLeft").append(`<li data-bs-dismiss="offcanvas" class="list-group-item leftMenuItem border-0" type="${menu.type}" identifier = "${menu.identifier}">${icon} ${menu.label}</li>`)
            });

            buildHome(data.banners, data.messages)
        }

    })
}



const buildHome = (banners, messages) => {
    $("#root").html(`<div id="carouselExample" class="carousel slide" data-bs-ride="carousel"><div class="carousel-inner" id="pager"></div>  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div><div class="accordion" id="accordionExample"></div>`)

    for (let i = 0; i < banners.length; i++) {
        const banner = banners[i];
        if (i == 0) {
            $("#pager").append(`<div class="carousel-item active" data-bs-interval="4000"><img src="${banner.image}" class="h-100 d-block slideImage" alt="slide"></div>`)
        } else {
            $("#pager").append(`<div class="carousel-item" data-bs-interval="2000"><img src="${banner.image}" class="h-100 d-block slideImage" alt="slide"></div>`)
        }
    }

    messages.forEach(message => {
        $("#accordionExample").append(`<div class="accordion-item"><h2 class="accordion-header"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${message.mid}" aria-expanded="true" aria-controls="collapse${message.mid}">${message.label}</button></h2><div id="collapse${message.mid}" class="accordion-collapse collapse" data-bs-parent="#accordionExample"><div class="accordion-body"><p>${message.body}</p></div></div></div>`)
    })

}



$(document).on('click', '.leftMenuItem', function () {

    var type = $(this).attr('type');
    var identifier = $(this).attr('identifier');

    if (type == "HOME") {
        loadHome()
    } else if (type == "PAGE") {
        loadPage(identifier)
    } else if (type == "LIST") {
        loadList(identifier)
    } else if (type == "USER") {
        loadUser(identifier)
    } else if (type == "ZONE") {
        loadZones()
    }

});


const loadZones = () => {
    $.ajax({
        url: API + `/zone`,
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
            $("#root").html(`<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`)
        },
        success: (data) => {
            console.log(data)
            $("#root").html("")
            data.zones.forEach(zone => {
                $("#root").append(`<div class="card mb-2">
<div class="card-body">
    <h5 class="card-title"><i class="bi bi-cloud"></i> ${zone.zone}  <i class="bi bi-building-fill"></i> : ${zone.clubs}</h5>
</div>
  
  <ul class="list-group list-group-flush">
    <li class="list-group-item"><strong>[ ZC ] </strong>${zone.zcName} <i class="bi bi-telephone-fill"></i> ${zone.zcPhone}</li>
    <li class="list-group-item"><strong>[ GMT ] </strong>${zone.gmtName} <i class="bi bi-telephone-fill"></i> ${zone.gmtPhone}</li>
    <li class="list-group-item"><strong>[ GST ] </strong>${zone.gstName} <i class="bi bi-telephone-fill"></i> ${zone.gstPhone}</li>
    <li class="list-group-item"><strong>[ GLT ] </strong>${zone.gltName} <i class="bi bi-telephone-fill"></i> ${zone.gltPhone}</li>
  </ul>

  <div class="card-body">
    <button class="btn btn-success" onclick="showClubs(${zone.zid})">View clubs</button>
  </div>
</div>`)
            })
        }
    })
}


const showClubs = (zid) => {
    $.ajax({
        url: API + `/club/${zid}/0`,
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
            $("#root").html(`<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`)
        },
        success: (data) => {
            console.log(data)
            $("#root").html("")
            data.list.forEach(club => {
                $("#root").append(`<div class="card mb-2">
  <div class="card-body">
    <h5 class="card-title">${club.club_name}</h5>
    <button onclick="loadUser(${club.cid})" class="btn btn-primary">View Members</button>
  </div>
</div>`)
            })
        }
    })
}


const loadUser = (id) => {
    $("#root").html(`<div id="list"></div><div class="text-center"><button class="btn btn-primary" id="loadMoreUsers" data-id="${id}" data-current="0" data-max="0">Load more</button></div>`)
    userLoadMore(id, 0)
}


const userLoadMore = (id, page) => {
    $.ajax({
        url: API + `/user/${id}/${page}`,
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
        },
        success: (data) => {
            console.log(data)
            $("#loadMoreUsers").attr("data-max", data.pages).attr("data-current", page)

            if (page == data.pages) {
                $("#loadMoreUsers").hide()
            }

            data.users.forEach(listItem => {
                var IMAGE = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/1200px-Lions_Clubs_International_logo.svg.png"
                if (listItem.image != null) {
                    IMAGE = listItem.image
                }

                var PDG_LABEL = ""

                if (listItem.role == "PDG") {
                    PDG_LABEL = `<p class="card-text m-0">YEAR: <small class="text-body-secondary">${listItem.year_start} - ${listItem.year_end}</small></p>`
                }


                $("#list").append(`<div class="card mb-3">
  <div class="row g-0">
    <div class="col-2">
      <img src="${IMAGE}" class="img-fluid rounded-start" alt="${listItem.name}">
    </div>
    <div class="col-10">
      <div class="card-body">
        <h5 class="card-title">${listItem.name}</h5>
        <p class="card-text m-0">${listItem.role} | ${listItem.designation}</p>
        <p class="card-text m-0">${listItem.club}</p>
        ${PDG_LABEL}
        <p class="card-text m-0">ID: <small class="text-body-secondary">${listItem.uid}</small></p>
        <p class="card-text m-0">IM NO: <small class="text-body-secondary">${listItem.im}</small></p>
        <p class="card-text m-0">Phone no: <small class="text-body-secondary">${listItem.mobile}</small></p>
        <p class="card-text m-0">Email Id: <small class="text-body-secondary">${listItem.email}</small></p>
      </div>
    </div>
  </div>
</div>`)
            })
        }
    })
}


$(document).on('click', '#loadMoreUsers', () => {
    let current = $("#loadMoreUsers").attr("data-current")
    let intC = parseInt(current) + 1
    let id = $("#loadMoreUsers").attr("data-id")
    userLoadMore(id, intC)
    console.log('Increament', intC)
})


$(document).on('click', '#loadMoreList', () => {
    let current = $("#loadMoreList").attr("data-current")
    let intC = parseInt(current) + 1
    let id = $("#loadMoreList").attr("data-id")
    listLoadMore(id, intC)
    console.log('Increament', intC)
})


const loadList = (id) => {
    $("#root").html(`<div id="list"></div><div class="text-center"><button class="btn btn-primary" id="loadMoreList" data-id="${id}" data-current="0" data-max="0">Load more</button></div>`)
    listLoadMore(id, 0)
}



const listLoadMore = (id, page) => {
    $.ajax({
        url: API + `/list/${id}/${page}`,
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
        },
        success: (data) => {
            console.log(data)
            $("#loadMoreList").attr("data-max", data.pages).attr("data-current", page)

            if (page == data.pages) {
                $("#loadMoreList").hide()
            }

            data.list.forEach(listItem => {
                var IMAGE = "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Lions_Clubs_International_logo.svg/1200px-Lions_Clubs_International_logo.svg.png"
                if (listItem.image != null) {
                    IMAGE = listItem.image
                }


                $("#list").append(`<div class="card mb-3">
  <div class="row g-0">
    <div class="col-2">
      <img src="${IMAGE}" class="img-fluid rounded-start" alt="${listItem.heading}">
    </div>
    <div class="col-10">
      <div class="card-body">
        <h5 class="card-title">${listItem.heading}</h5>
        <p class="card-text">${listItem.body}</p>
        <p class="card-text"><small class="text-body-secondary">${listItem.info}</small></p>
      </div>
    </div>
  </div>
</div>`)
            })
        }
    })
}


const loadPage = (id) => {
    $.ajax({
        url: API + `/page/${id}`,
        method: "GET",
        beforeSend: (request) => {
            request.setRequestHeader("authorization", AUTH_TOKEN);
        },
        success: (data) => {
            console.log(data)
            $("#root").html(`<div class="card">
                            <h5 class="card-header text-center">${data.title}</h5>
                            <div class="card-body">
                                <img class="card-img-top" src="${data.image}" alt="Card image cap">
                                <p class="card-text pt-2">${data.body}</p>
                            </div>
                            </div>`)
        }

    })
}


// setCookie('token', token, 30); // Setting token with an expiry of 30 days

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check if this cookie is the one we are looking for
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null; // Return null if cookie is not found
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
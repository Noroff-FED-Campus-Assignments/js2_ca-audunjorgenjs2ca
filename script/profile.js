const profileName = document.querySelector(".profile_name");
const friendsContainer = document.querySelector(".friends-container");
// const bioEmail = document.querySelector(".bio_email")
// const bioNoPosts = document.querySelector(".bio_no_posts");
// const bioFollowers = document.querySelector(".bio_followers");
// const bioFollows = document.querySelector(".bio_follows");
// const bioTable  = document.querySelector(".bio_table");
const profilePicture = document.querySelector("#profile-picture");
const editProfile = document.querySelector(".edit_profile");
const banner = document.querySelector("#forsidebilde");
const userPost = document.querySelector(".user_posts");
const profileContainer = document.querySelector(".profile_info_container");




profileName.innerHTML = `<h1>${localStorage.getItem("username")}</h1>`

baseUrl = `https://nf-api.onrender.com/api/v1/social/profiles/${localStorage.getItem("username")}`


const header = {
    headers : {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }, 
}

async function getUser(){
    const response = await fetch(baseUrl, header)
    const results = await response.json();
    profileContainer.innerHTML += `<p>Email: ${results.email}</p>`
    profileContainer.innerHTML += `<p>No. Posts: ${results._count.posts}</p>`
    profileContainer.innerHTML += `<p>Followers: ${results._count.followers}</p>`
    profileContainer.innerHTML += `<p>Following:${results._count.following}`
    profilePicture.src = `${results.avatar}`
    banner.src = `${results.banner}`
}

getUser();

async function getUserInfo(endpoint){
    try{
        const username = localStorage.getItem("username");
        const response = await fetch(`${baseUrl}${endpoint}`, header);
        const results = await response.json();
        const following = results.following
        // console.log(results.posts)
        const posts = results.posts
        
        for (let i = 0; i< following.length; i++){
            friendsContainer.innerHTML += `
                                            <div class="friend-item d-flex flex-row justify-content-between m-3">
                                                <p><strong>${following[i].name}</strong></p>
                                                <button id="${following[i].name}" class="btn btn-outline-info btn-sm unfollow_btn btn_unfollow">Unfollow</button>
                                            </div>
    
                                            `
        } 

        for (let i = 0; i < posts.length; i++){
            console.log(posts.length)
            userPost.innerHTML += `
                                    <div class="user_posts">
                                        <h4>${posts[i].title}</h4>
                                        <p>Created:</p>
                                        <p>${posts[i].created}</p>
                                        <div class="user_post_img">
                                            <img src=${posts[i].media}>
                                        </div>
                                        <p>${posts[i].body}</p>
                                        <hr>
                                    </div>`

        }

    }catch(e){
        console.log(e)
    }finally{
        const following = document.querySelectorAll(".btn_unfollow");
        for (let i =0; i < following.length; i++){
            following[i].addEventListener("click", () =>{
            unfollowUser(event.target.id);
            })
        }
    }
}

getUserInfo("?_posts=true&_following=true&_followers=true");

console.log("after funk")
async function unfollowUser (name) {
    try{
        const response = await fetch(`https://nf-api.onrender.com/api/v1/social/profiles/${name}/unfollow`,{
            method: "PUT",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
        })
    }catch(e){
        console.log(e)

    }
    finally{
        friendsContainer.innerHTML = "";
        getUserInfo("?_posts=true&_following=true&_followers=true");
    }
}


const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close_modal");

profilePicture.addEventListener('mouseover', (event) => {
    editProfile.classList.remove("no_show");
});
profilePicture.addEventListener('mouseout', (event) => {
    editProfile.classList.add("no_show")
});

closeModal.addEventListener("click", () =>{
    modal.classList.add("modal_no_show");
    
})

profilePicture.addEventListener("click", () =>{
    modal.classList.remove("modal_no_show")
})

window.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add("modal_no_show");
    }
};


//--------------------SET NEW PROFILE OR BANNER IMG-----------------------

const changeMedia = document.querySelector(".change_media");

changeMedia.addEventListener("click", (e) => {
    e.preventDefault();
    const changeProfileImg = document.querySelector(".change_profile_pic").value;
    const changeProfileBanner = document.querySelector(".change_profile_banner").value;

    const userInput = {
      banner: changeProfileBanner,
      avatar: changeProfileImg,
    
    };
    // console.log(email, password, userName);
  
    async function changeMedia(endpoint) {
      try {
        const request = await fetch(`${baseUrl}${endpoint}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json; charset=UTF-8",

            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

          },
          body: JSON.stringify(userInput),
        });
        const results = await request.json();
        console.log(request)

        if (request.status === 200){
            location.reload();

        }else{
            alert("Please enter a valid URL")
        }
        
        } catch (e) {
        console.log(e);
      }
    }
    changeMedia("/media");
});














const profileName = document.querySelector(".profile_name");
const friendsContainer = document.querySelector(".friends-container");
const bioEmail = document.querySelector(".bio_email")
const bioNoPosts = document.querySelector(".bio_no_posts");
const bioFollowers = document.querySelector(".bio_followers");
const bioFollows = document.querySelector(".bio_follows");
const bioTable  = document.querySelector(".bio_table");
const profilePicture = document.querySelector("#profile-picture");
const editProfile = document.querySelector(".edit_profile");
const banner = document.querySelector("#forsidebilde");



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
    console.log(results)
    bioEmail.innerHTML = `${results.email}`
    bioNoPosts.innerHTML = `${results._count.posts}`
    bioFollowers.innerHTML = `${results._count.followers}`
    bioFollows.innerHTML = `${results._count.following}`
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
        
        for (let i = 0; i< following.length; i++){
            friendsContainer.innerHTML += `
                                            <div class="friend-item d-flex flex-row justify-content-between m-3">
                                                <p><strong>${following[i].name}</strong></p>
                                                <button id="${following[i].name}" class="btn btn-outline-info btn-sm unfollow_btn btn_unfollow">Unfollow</button>
                                            </div>
    
                                            `
        } 
    }catch(e){
        console.log(e)
    }finally{
        const following = document.querySelectorAll(".btn_unfollow");
        // console.log(following)
        for (let i =0; i < following.length; i++){
            following[i].addEventListener("click", () =>{
            unfollowUser(event.target.id);
            })
        }
    }
}

getUserInfo("?_posts=true&_following=true&_followers=true");

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



profilePicture.addEventListener('mouseover', (event) => {
    editProfile.classList.remove("no_show");
});
profilePicture.addEventListener('mouseout', (event) => {
    editProfile.classList.add("no_show")
});











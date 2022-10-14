var removeClass = document.querySelector(".testing");

window.onresize = function () {
  console.log("test");
  if (window.innerWidth <= 990)
    removeClass.classList.add("flex-column-reverse");
  else removeClass.classList.remove("flex-column-reverse");
};
const token = localStorage.getItem("accessToken");
const user_name = localStorage.getItem("username");
const email = localStorage.getItem("email");
console.log(user_name);
const container = document.querySelector(".container-content");
const url = "https://nf-api.onrender.com/api/v1";

const DOMUsername = document.querySelector(".user_name");

DOMUsername.innerHTML = user_name;
const DOMAvatar = document.querySelector("#avatar-img");
DOMAvatar.innerHTML = `<img src="/img/profile.jfif" id="profile-picture" "id="profile-picture">`
const DOMFollowers = document.querySelector("#follower-count");
const DOMFollowing = document.querySelector("#following-count");

const options = {
  headers: {
    'content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
};
console.log(options)
async function getProfile() {
  try {
    console.log(user_name);
    const response = await fetch(
      `${url}/social/profiles/${user_name}?_followers=true&_following=true`,
      options
    );
    const result = await response.json();
    console.log(result.avatar);
    let avatar = result.avatar;
    DOMAvatar.innerHTML = `<img src="${result.avatar}" onerror="this.src = '/img/profile.jfif';" id="profile-picture" "id="profile-picture" />`;
    console.log(result._count.followers);
    DOMFollowers.innerHTML = `${result._count.followers} followers`;
    DOMFollowing.innerHTML = `${result._count.following} following`;
  } catch (e) {}
}
getProfile();

async function handleAPI() {
  try {
    const response = await fetch(
      `${url}/social/posts/?_author=true&_comments=true&_reactions=true`,
      options
    );
    const result = await response.json();
    for (let i = 0; i < result.length; i++) {
      let avatar = result[i].author.avatar;

      if (result[i].author.avatar === "") {
        avatar = `/img/profile.jfif"`;
      }

      let icon = "";
      if (result[i].author.name === user_name) {
        icon = `<button class="edit_btn btn btn-warning" id="${result[i].id}">edit</button><button class="delete_btn btn btn-danger" id="${result[i].id}">Delete</button>`
      }
      container.innerHTML += 
          `<div class="feed-content rounded" id="post_${result[i].id}">
          <div class="d-flex justify-content-between">
          <div class="content-left d-flex">
          <img src="${avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" />
<div class="div">
<p class="text-start p-feed ms-3">${result[i].author.name}</p>
<p class="text-start p-feed ms-3">Front-end developer</p>
</div>
          </div>
          <div class="content-right">
                 
<div class="align-self-end"">
${icon}
</div>
          </div>

</div>
          <h5 class="text-start">${result[i].title}</h5>
          <p class="text-start">${result[i].body}</p>
          <img src="${result[i].media}" id="feed-picture">

          <div class="text-end">
          <p class="view_comments" id="${result[i].id}">${result[i]._count.comments} comments</p>

          </div>
          <span id ="comment_${result[i].id}"></span>
          </div>`;
    }
  } catch (e) {
  } finally {
    const btnnEdit = document.querySelectorAll(".edit_btn");
    for(let i = 0; i <btnnEdit.length; i++) {
      btnnEdit[i].addEventListener("click", () => {
        let postID = event.target.id;
        updatePost(postID);
      })
    }
    const btnnDelete = document.querySelectorAll(".delete_btn");
    for(let i = 0; i <btnnDelete.length; i++) {
      btnnDelete[i].addEventListener("click", () => {
        let postID = event.target.id;
        deletePost(postID);
      })
    }

    console.log("FINALLY");

    const allComments = document.querySelectorAll(".view_comments");
    

    for (let j = 0; j < allComments.length; j++) {
      allComments[j].addEventListener("click", () => {
        let postID = event.target.id;
        displayComments(postID);
      });
    }
   
    }

  
}
handleAPI();

async function displayComments(postid) {
  const postSpan = document.querySelector(`#comment_${postid}`);
  try {
    const response = await fetch(
      `${url}/social/posts/${postid}?_author=true&_comments=true&_reactions=true`,
      options
    );
    const result = await response.json();
    postSpan.innerHTML += `<div class="post-comment p-2 m-2 rounded">
    <div class="d-flex m-2">
      <img src="/img/profile.jfif" id="feed-profile-pic" />
      <div class="div">
        <p class="text-start p-feed ms-3">${user_name}</p>
        <p class="text-start p-feed ms-3">Front-end developer</p>
      </div>
     
    </div>
    <input class="input_${postid}" type="text" placeholder="write a comment" id="input-comment">
    <button class="btn_${postid}" id="${postid}">Comment</button>
    
  </div>`;
    for (let i = 0; i < result.comments.length; i++) {
      console.log(result.comments[i].body);
      postSpan.innerHTML += `              <div class="post-comment p-2 m-2 rounded">
        <div class="d-flex m-2">
          <img src="/img/profile.jfif" id="feed-profile-pic" />
          <div class="div">
            <p class="text-start p-feed ms-3">${result.comments[i].owner}</p>
            <p class="text-start p-feed ms-3">Front-end developer</p>
          </div>
         
        </div>
        <p class="text-start ms-2">${result.comments[i].body}</p>
        
      </div>`;
    }
    console.log(postid);
  } catch (e) {
    console.log(e);
  } finally {
    postSpan.innerHTML += `<p id="hide_${postid}">hide comments</p>`;
    const hideComments = document.querySelector(`#hide_${postid}`);

    //post comments eventlistener
    const btnPostComment = document.querySelector(`.btn_${postid}`);
    const commentInput = document.querySelector(`.input_${postid}`);
    btnPostComment.addEventListener("click", () => {
      spesificPostID = postid;
      const bodyComment = commentInput.value;
      postComment(spesificPostID, bodyComment);
    });

    //Hide comment section after opening
    hideComments.addEventListener("click", () => {
      postSpan.innerHTML = "";
    });
  }
}
function postComment(post, commentContent) {
  const data = JSON.stringify( {
    body: commentContent
  });
    //url fetch and post method
    fetch(`${url}/social/posts/${post}/comment`, {
    method: 'POST', 
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'application/json',
    },
    //data in the body
    body: JSON.stringify( {
      body : commentContent,
    })
  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
       document.location.reload (true); 
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch(error => console.log("error",  error));
}
async function updatePost(postid) {
  try {

  
  const post_container = document.querySelector(`#post_${postid}`);

   const values = await getPost(postid);
   console.log(values.title);
   console.log(values.body);
   console.log(values.media);
   post_container.innerHTML = `
   <p>title</p>
   <input type="text" class="title_${postid}" value="${values.title}" id="input-post ">
   <p>tekst</p>
   <input type="text" class="body_${postid}" value="${values.body}" id="input-post ">
   <p>media</p>
   <input type="text" class="media_${postid}" value="${values.media}" id="input-post">
   <p class="oppdater_${postid}">OPPDATER</p>`;
   } catch(e) {
    console.log("error", e);
   } finally {
    console.log(postid);
    const inputTitle = document.querySelector(`.title_${postid}`);
    const body = document.querySelector(`.body_${postid}`);
    const media = document.querySelector(`.media_${postid}`);
    const btnUpdate = document.querySelector(`.oppdater_${postid}`);
    console.log(btnUpdate);
    btnUpdate.addEventListener("click", () => {
      sendUpdate(postid, inputTitle.value, body.value, media.value);
    })
    
   }
}

async function getPost(idPost) {
  try {
    console.log(idPost);
    const response = await fetch(`${url}/social/posts/${idPost}`, options);
    const result = await response.json();
    const title = result.title;
    const body = result.body;
    const media = result.media;
    console.log(title, body, media);
    return {title, body, media};

  } catch(e) {

  } finally {

  }
}

function sendUpdate(postid, title, body, media) {

    //url fetch and PUT method
    fetch(`${url}/social/posts/${postid}`, {
    method: 'PUT', 
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'application/json',
    },
    //data in the body
    body: JSON.stringify( {
      title: title,
    body: body,
    media: media,
    })
  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
       document.location.reload (true); 
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch(error => console.log("error",  error));
  }
function deletePost(postid) {
   //url fetch and PUT method
   fetch(`${url}/social/posts/${postid}`, {
    method: 'DELETE', 
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'application/json',
    },

  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
       document.location.reload (true); 
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch(error => console.log("error",  error));
  }

  async function findFriends() {
    try{
      const DOMFindfriends = document.querySelector(".friends-container");
      const response = await fetch(`${url}/social/profiles?_followers=true`, options);
      const result = await response.json();
      console.log(result);
      console.log("før");
      let matched;
      //console.log(result[0].follwers[0].name);
      console.log("etter");
      for( let i = 0; i < result.length; i++) {
 
       // console.log(result[i].followers.length);
    
        for(let j = 0; j < result[i].followers.length; j++) {
          console.log(matched);
          console.log(result[i].followers[j].name);
          matched = false;
              if(result[i].followers[j].name === user_name) {
                  //console.log(result[i].followers[j].name);
                  matched = true;
                console.log("inneeeeeeee");
                //console.log(matched);
              }else {
                  matched = false;
                }
                //console.log(result[i].name);
                console.log(matched);
                console.log(result[i].name);

        }
        if(!matched) {
          console.log(result[i].name);
          console.log("test");
            DOMFindfriends.innerHTML += `<div class="d-flex find-friends m-1">
            <div class="p-2">
              <img src="${result[i].avatar}"  onerror="this.src = '/img/profile.jfif';" id="find-friends-picutre">
            </div>
            <div class="p-2">
              <p>${result[i].name}</p>
              
            </div>
            <button class="m-2 btn btn-info btnConnect" id="${result[i].name}">Connect</button>
          </div>`;
          if(i > 20) {
            break;
          }
          
         
        }
        //console.log(user_name);
    
    }
    } catch(e) {

    } finally{4
      const btn_connect = document.querySelectorAll(".btnConnect");
      for(let i = 0; i < btn_connect.length; i++) {
        btn_connect[i].addEventListener("click", () => {
          const followName = event.target.id;
          console.log(followName);
          followUser(followName);

        })
      }
    }
  }

  findFriends();

function followUser(followName) {
    try {
      const userName = `${user_name}`;
        //url fetch and PUT method
   fetch(`${url}/social/profiles/${followName}/follow`, {
    method: 'PUT', 
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'application/json',
    },
    //data in the body
    body: JSON.stringify( {
      name : followName,
    })

  })
    .then((response) => {
      if (response.ok === true) {
        //SUCCESS
       console.log("nice");
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch(error => console.log("error",  error));
  }
catch(e) {
      console.log(e);
    } finally {
    } 

    
  }

const inputSearch = document.querySelector(".input_search");

inputSearch.addEventListener("keyup", () => {

  console.log(inputSearch.value);
  apiSearch(inputSearch.value);
});
let searchArray = [];
async function apiSearch(searchWord) {
  try {
    
    const response = await fetch(
      `${url}/social/posts/?_author=true&_comments=true&_reactions=true`,
      options
    );
    const result = await response.json();
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      let avatar = result[i].author.avatar;
      console.log(searchWord.length);
      console.log(result[i].title);
      if (result[i].author.avatar === "") {
        avatar = `/img/profile.jfif"`;
      }
      console.log(result[i].title);
      if(result[i].title === searchWord) {
        console.log("FUNNET");
        searchArray.push(result[i]);
        if( i === 3) {
          break;
        }
      } else {
        //searchArray = [];
      }
      
     
    }
  } catch (e) {
  } finally {
    console.log(searchArray);
    const search_container = document.querySelector(".container-search");
   console.log(searchArray.length);
   for(let i = 0; i <searchArray.length; i++) {
   search_container.innerHTML += 

    `<div class="feed-content rounded" id="post_${searchArray[i].id}">
    <div class="d-flex justify-content-between">
    <div class="content-left d-flex">
    <img src="${searchArray[i].author.avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" />
<div class="div">
<p class="text-start p-feed ms-3">${searchArray[i].author.name}</p>
<p class="text-start p-feed ms-3">Front-end developer</p>
</div>
    </div>
    <div class="content-right">
           
<div class="align-self-end"">
</div>
    </div>

</div>
    <h5 class="text-start">${searchArray[i].title}</h5>
    <p class="text-start">${searchArray[i].body}</p>
    <img src="${searchArray[i].media}" id="feed-picture">

    <div class="text-end">
    <p class="view_comments" id="${searchArray[i].id}">${searchArray[i]._count.comments} comments</p>

    </div>
    <span id ="comment_${searchArray[i].id}"></span>
    </div>`;
}

   }
    
  
}
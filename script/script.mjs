//imports information from local storage that is assigned to variables in signedInUser.mjs.
import {token, user_name, email, options} from './signedInUser.mjs';

console.log(user_name);
const container = document.querySelector(".container-feed");
const url = "https://nf-api.onrender.com/api/v1";
console.log(email);
const DOMUsername = document.querySelector(".user_name");
const DOMAvatarPost = document.querySelector("#avatar-img-post");
const DOMUsernamePost = document.querySelector(".name-post");
DOMUsernamePost.innerHTML = user_name;
DOMUsername.innerHTML = user_name;



const DOMAvatar = document.querySelector("#avatar-img");
DOMAvatar.innerHTML = `<img src="/img/profile.jfif" id="profile-picture" "id="profile-picture">`;
const DOMFollowers = document.querySelector("#follower-count");
const DOMFollowing = document.querySelector("#following-count");


//removes bootstrap class on mobile.
const profileContainer = document.querySelector(".profile-info")
window.onresize = function() {
  if (window.innerWidth <= 1000) profileContainer.classList.remove('sticky-top');
  else profileContainer.classList.add('sticky-top');
};
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
    DOMAvatarPost.innerHTML = `<img src="${result.avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" "id="feed-profile-pic" />`;
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
        icon = `<button class="edit_btn btn btn-warning" id="${result[i].id}">edit</button><button class="delete_btn btn btn-danger" id="${result[i].id}">Delete</button>`;
      }
      container.innerHTML += 
        `<div class="feed-content rounded card mb-3" id="post_${result[i].id}">
        <div class="d-flex justify-content-between m-1">
        <div class="content-left d-flex">
        <img src="${avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" />
        <div class="div">
        <p class="text-start p-feed ms-3">${result[i].author.name}</p>
        <p class="text-start p-feed ms-3">Front-end developer</p>
        </div>
        </div>
        <div class="content-right"> 
        <div class="align-self-end">
        ${icon}
          </div>
          </div>
          </div>
          <h5 class="text-start ms-1">${result[i].title}</h5>
          <p class="text-start ms-1">${result[i].body}</p>
          <img class="p-1" src="${result[i].media}" id="feed-picture">
          <div class="text-end">
          <div class="d-flex justify-content-between text-end ms-1 me-1">
          <p class="like_post" id="${result[i].id}">${result[i]._count.reactions} likes | like</p>
          <p class="view_comments" id="${result[i].id}">${result[i]._count.comments} comments</p>       
          </div>
          </div>
          <span id ="comment_${result[i].id}"></span>
          </div>`;
    }
  } catch (e) {
  } finally {
    const btnnEdit = document.querySelectorAll(".edit_btn");
    for (let i = 0; i < btnnEdit.length; i++) {
      btnnEdit[i].addEventListener("click", () => {
        let postID = event.target.id;
        updatePost(postID);
      });
    }
    const btnnDelete = document.querySelectorAll(".delete_btn");
    for (let i = 0; i < btnnDelete.length; i++) {
      btnnDelete[i].addEventListener("click", () => {
        let postID = event.target.id;
        deletePost(postID);
      });
    }

    console.log("FINALLY");

    const allComments = document.querySelectorAll(".view_comments");
    const reactPosts = document.querySelectorAll(".like_post");

    for (let j = 0; j < allComments.length; j++) {
      allComments[j].addEventListener("click", () => {
        let postID = event.target.id;
        displayComments(postID);
      });
    }
    const btn_post = document.querySelector(".input_btn_submit");

    btn_post.addEventListener("click", (e) => {
      e.preventDefault();
      createEntry("/social/posts");
    });

    for (let x = 0; x < reactPosts.length; x++) {
      reactPosts[x].addEventListener("click", () => {
        let postID = event.target.id;
        reactPost(postID);
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
    <div class="d-flex">
    <input class="input_${postid} form-control me-3" type="text" placeholder="write a comment" id="input-comment">
    <button class="btn_${postid} btn btn-primary" id="${postid}">Comment</button>
    </div>
    
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
    postSpan.innerHTML += `<p class="hide_comments" id="hide_${postid}">hide comments</p>`;
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
  const data = JSON.stringify({
    body: commentContent,
  });
  //url fetch and post method
  fetch(`${url}/social/posts/${post}/comment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-Type": "application/json",
    },
    //data in the body
    body: JSON.stringify({
      body: commentContent,
    }),
  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
        document.location.reload(true);
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch((error) => console.log("error", error));
}
//this function is ran when user press 'edit' on their post.
//the function gets previous values of post into input fields that they can change
//then when pressed 'Update' the new values are sent to function sendUpdate
async function updatePost(postid) {
  try {
    const post_container = document.querySelector(`#post_${postid}`);

    const values = await getPost(postid);
    console.log(values.title);
    console.log(values.body);
    console.log(values.media);
    post_container.innerHTML = `
   <p>title</p>
   <input type="text" class="title_${postid} form-control m-1" value="${values.title}" id="input-post ">
   <p>tekst</p>
   <input type="text" class="body_${postid} form-control m-1" value="${values.body}" id="input-post ">
   <p>media</p>
   <input type="text" class="media_${postid} form-control m-1" value="${values.media}" id="input-post">
   <p class="oppdater_${postid} btn_oppdater">OPPDATER</p>`;
  } catch (e) {
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
    });
  }
}
/**
 * 
 * @param {Number} idPost 
 * @returns {object} title, body, media
 
 */
//this function is used to display previous values in the update post form
async function getPost(idPost) {
  try {
    console.log(idPost);
    const response = await fetch(`${url}/social/posts/${idPost}`, options);
    const result = await response.json();
    const title = result.title;
    const body = result.body;
    const media = result.media;
    console.log(title, body, media);
    return { title, body, media };
  } catch (e) {
  } finally {
  }
}
/**
 *
 * @param {Number} postid id of this post
 * @param {String} title input of new title
 * @param {String} body input of new body
 * @param {String} media input of media content.
 * takes these new inputs and use PUT method to update post of this postid.
 */
function sendUpdate(postid, title, body, media) {
  //url fetch and PUT method
  fetch(`${url}/social/posts/${postid}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-Type": "application/json",
    },
    //data in the body
    body: JSON.stringify({
      title: title,
      body: body,
      media: media,
    }),
  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
        document.location.reload(true);
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch((error) => console.log("error", error));
}

/**
 *
 * @param {Number} postid id of post
 * takes the postID and use DELETE method to delete it.
 */
function deletePost(postid) {
  fetch(`${url}/social/posts/${postid}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok === true) {
        //reloads page if comment is posted to update the display
        document.location.reload(true);
      }
      return response.json();
    })
    .then((Object) => {
      //failed
    })
    .catch((error) => console.log("error", error));
}
const DOMFindfriends = document.querySelector(".friends-container");
/**
 * calls uppon the API to get list of users, and calls uppon function returnFollowing
 * for a list of logged in users list of following, compares them and
 * dont display already followed users.
 */
async function findFriends() {
  let matched;
  try {
    const response = await fetch(
      `${url}/social/profiles?_followers=true&limit=1000`,
      options
    );
    const result = await response.json();
    // console.log(result);
    console.log("før");

    //console.log(result[0].follwers[0].name);
    console.log("etter");
    const listFollowers = await returnFollowing();
    console.log(listFollowers.length);
    let count = 0;
    for (let i = 0; i < result.length; i++) {
      if (!listFollowers.includes(result[i].name)) {
        count++;
        DOMFindfriends.innerHTML += `<div class="d-flex find-friends m-1">
            <div class="p-2">
              <img src="${result[i].avatar}"  onerror="this.src = '/img/profile.jfif';" id="find-friends-picutre">
            </div>
            <div class="p-2">
              <p>${result[i].name}</p>
              
            </div>
            <button class="m-2 btn btn-info btnConnect" id="${result[i].name}">Connect</button>
          </div>`;

        if (count === 5) {
          break;
        }
      }
      //console.log(user_name);
    }
  } catch (e) {
  } finally {
    4;
    const btn_connect = document.querySelectorAll(".btnConnect");
    for (let i = 0; i < btn_connect.length; i++) {
      btn_connect[i].addEventListener("click", () => {
        const followName = event.target.id;
        console.log(followName);
        followUser(followName);
      });
    }
  }
}

findFriends();

/**
 *
 * @param {string} followName unique name that logged in user wants to follow
 * function calls on other functions in the finally statement to update containers.
 */
function followUser(followName) {
  try {
    const userName = `${user_name}`;
    //url fetch and PUT method
    fetch(`${url}/social/profiles/${followName}/follow`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      //data in the body
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
      .catch((error) => console.log("error", error));
  } catch (e) {
    console.log(e);
  } finally {
    DOMFindfriends.innerHTML = `<h2>Find Friends</h2>`;
    getProfile();
    findFriends();
  }
}

const inputSearch = document.querySelector(".input_search");

inputSearch.addEventListener("keyup", () => {
  console.log(inputSearch.value);
  apiSearch(inputSearch.value);
});

async function apiSearch(searchWord) {
  console.log(window.innerWidth);
  const search_container = document.querySelector(".container-search");
  let searchArray = [];
  let searchID = [];
  try {
    const response = await fetch(
      `${url}/social/posts/?_author=true&_comments=true&_reactions=true&limit=300`,
      options
    );
    const result = await response.json();
    for (let i = 0; i < result.length; i++) {
      searchArray.push(result[i]);
    }
  } catch (e) {
    console.log(e);
  } finally {
    if (searchWord.length > 2) {
      const searchResult = getValue(searchWord, searchArray);
      search_container.innerHTML = "";

      for (let i = 0; i < searchResult.length; i++) {


        search_container.style.display = "block";
        search_container.innerHTML += 
        `<div class="feed-content rounded" id="post_${searchResult[i].id}">
        <div class="d-flex justify-content-between">
        <div class="content-left d-flex">
        <img src="${searchResult[i].author.avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" />
        <div class="div">
        <p class="text-start p-feed ms-3">${searchResult[i].author.name}</p>
        <p class="text-start p-feed ms-3">Front-end developer</p>
        </div>
        </div>
        <div class="content-right">    
        <div class="align-self-end"">
        </div>
        </div>
        </div>
        <h5 class="text-start">${searchResult[i].title}</h5>
        <p class="text-start">${searchResult[i].body}</p>
        <img src="${searchResult[i].media}" id="feed-picture">
        <div class="text-end">
        <p class="view_comments" id="${searchResult[i].id}">${searchResult[i]._count.comments} comments</p>
        </div>
        <span id ="comment_${searchResult[i].id}"></span>
        </div>`;
      }
    } else {
      search_container.innerHTML = "";
      search_container.style.display = "none";
    }
  }
}

function getValue(searchText, searchArray) {
  const localData = [...searchArray];
  function getValueLogic(data, searchText) {
    const arr = [];
    if (data && Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const ele = data[i];
        ele && ele.title.toUpperCase().includes(searchText.toUpperCase())
          ? arr.push(ele)
          : arr.push(...getValueLogic(ele.items, searchText));
      }
    }
    return arr;
  }
  return getValueLogic(localData, searchText);
}

async function createEntry(endpoint) {
  try {
    const inputHeadline = document.querySelector(".input_headline").value;
    const inputBody = document.querySelector(".input_body").value;
    const inputImage = document.querySelector(".input_image").value;
    const entry = {
      title: inputHeadline,
      body: inputBody,
      media: inputImage,
    };
    const request = await fetch(`${url}${endpoint}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(entry),
    });
    const results = await request.json();
    console.log("This is the " + results);
  } catch (e) {
    console.log(e);
  } finally {
    container.innerHTML = "";
    handleAPI();
  }
}

const btn_filterExplore = document.querySelector(".filter_explore");
btn_filterExplore.addEventListener("click", () => {
  container.innerHTML = "";
  handleAPI();
});
const btn_filterFriends = document.querySelector(".filter_follow");
btn_filterFriends.addEventListener("click", filterPosts);

/**
 *
 * filter only filters by friends post so far, if i want to add more i will use parameter here
 *
 */
async function filterPosts() {
  try {
    container.innerHTML = "";
    const response = await fetch(
      `${url}/social/posts/?_author=true&_comments=true&_reactions=true&_followers=true&limit=1000`,
      options
    );
    const result = await response.json();
    console.log(result);
    const listFollowers = await returnFollowing();
    console.log(listFollowers.length);
    for (let i = 0; i < result.length; i++) {
      let avatar = result[i].author.avatar;
      if (result[i].author.avatar === "") {
        avatar = `/img/profile.jfif"`;
      }

      if (listFollowers.includes(result[i].author.name)) {
        console.log(result[i].id);
        console.log(result[i].title);
        console.log(result[i].body);
        container.innerHTML += `<div class="feed-content rounded card mb-3" id="post_${result[i].id}">
        <div class="d-flex justify-content-between m-1">
        <div class="content-left d-flex">
        <img src="${avatar}" onerror="this.src = '/img/profile.jfif';" id="feed-profile-pic" />
        <div class="div">
        <p class="text-start p-feed ms-3">${result[i].author.name}</p>
        <p class="text-start p-feed ms-3">Front-end developer</p>
        </div>
        </div>
        <div class="content-right">     
        <div class="align-self-end"">
        </div>
        </div>
        </div>
        <h5 class="text-start ms-1">${result[i].title}</h5>
        <p class="text-start ms-1">${result[i].body}</p>
        <img class="p-1" src="${result[i].media}" id="feed-picture">

        <div class="text-end">
        <div class="d-flex justify-content-between text-end ms-1 me-1">
        <p class="like_post" id="${result[i].id}">${result[i]._count.reactions} likes | like</p>
        <p class="view_comments" id="${result[i].id}">${result[i]._count.comments} comments</p>       
        </div>
        </div>
        <span id ="comment_${result[i].id}"></span>
        </div>`;
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    const btnnEdit = document.querySelectorAll(".edit_btn");
    for (let i = 0; i < btnnEdit.length; i++) {
      btnnEdit[i].addEventListener("click", () => {
        let postID = event.target.id;
        updatePost(postID);
      });
    }
    const btnnDelete = document.querySelectorAll(".delete_btn");
    for (let i = 0; i < btnnDelete.length; i++) {
      btnnDelete[i].addEventListener("click", () => {
        let postID = event.target.id;
        deletePost(postID);
      });
    }

    console.log("FINALLY");

    const allComments = document.querySelectorAll(".view_comments");

    for (let j = 0; j < allComments.length; j++) {
      allComments[j].addEventListener("click", () => {
        let postID = event.target.id;
        displayComments(postID);
      });
    }
    const reactPosts = document.querySelectorAll(".like_post");

    for (let x = 0; x < reactPosts.length; x++) {
      reactPosts[x].addEventListener("click", () => {
        let postID = event.target.id;
        reactPost(postID);
      });
    }
  }
}
console.log(user_name);

/**
 *
 * @returns {postArray} array of logged in users following.
 */
async function returnFollowing() {
  let postArray = [];
  try {
    const response = await fetch(
      `${url}/social/profiles/${user_name}?_followers=true&_following=true`,
      options
    );
    const result = await response.json();
    console.log(result.following.length);

    for (let i = 0; i < result.following.length; i++) {
      console.log("test");
      postArray.push(result.following[i].name);
    }
  } catch (e) {
  } finally {
    return postArray;
  }
}

/**
 *
 * @param {postID} postID is sent to reactPost
 *  function does not return
 * in the future i would have liked empty the post container and make a new API call and insert it with updated post.
 */
async function reactPost(postID) {
  try {
    const userName = `${user_name}`;
    fetch(`${url}/social/posts/${postID}/react/👍`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      //data in the body
    })
      .then((response) => {
        if (response.ok === true) {
          //SUCCESS
          console.log("du har likt en post");
        }
        return response.json();
      })
      .then((Object) => {
        //failed
      })
      .catch((error) => console.log("error", error));
  } catch (e) {
    console.log(e);
  } finally {
  }
}

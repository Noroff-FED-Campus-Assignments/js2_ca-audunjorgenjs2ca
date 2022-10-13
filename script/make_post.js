const inputBtnSubmit = document.querySelector(".input_btn_submit");
const postForm = document.querySelector(".post_form");
const baseUrl = "https://nf-api.onrender.com/api/v1";

console.log("i make_post.js");

inputBtnSubmit.addEventListener("click", (e) => {
  console.log("click");
  e.preventDefault();
});

inputBtnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("inne i eventlistner2");
  const inputHeadline = document.querySelector(".input_headline").value;
  const inputBody = document.querySelector(".input_body").value;
  const inputImage = document.querySelector(".input_image").value;
  const entry = {
    title: inputHeadline,
    body: inputBody,
  };
  async function createEntry(endpoint) {
    try {
      const request = await fetch(`${baseUrl}${endpoint}`, {
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
    }
  }
  createEntry("/social/posts");
});

// -------------------------------------Filter---------------------------------------------

const filterAsc = document.querySelector(".filter_asc");
const filterDsc = document.querySelector(".filter_dsc");
const feedContent = document.querySelector(".feed-content");

filterAsc.addEventListener("click", (e) => {
  e.preventDefault();
  async function ascPost(endpoint) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const results = await response.json();
      for (let i = 0; i < results.length; i++) {
        console.log(results[i].id);
      }
    } catch (e) {
      console.log(e);
    }
  }

  ascPost("/social/posts?sort=created&sortOrder=desc");
});

filterDsc.addEventListener("click", (e) => {
  e.preventDefault();
  async function dscPost(endpoint) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const results = await response.json();
      for (let i = 0; i < results.length; i++) {
        console.log(results[i].id);
      }
    } catch (e) {
      console.log(e);
    }
  }

  dscPost("/social/posts?sort=created&sortOrder=asc");
});

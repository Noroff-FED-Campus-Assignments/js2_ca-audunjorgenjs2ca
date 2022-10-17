const email = document.querySelector(".input_email");
const password = document.querySelector(".input_password");
const loginForm = document.querySelector(".login_form");
const errorContainer = document.querySelector(".error_container");

const baseUrl = "https://nf-api.onrender.com/api/v1";
 localStorage.clear();
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector(".input_email").value;
  const password = document.querySelector(".input_password").value;
  const user = {
    email: email,
    password: password,
  };

  async function login(endpoint) {
    try {
      const request = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(user),
      });
      const results = await request.json();
      console.log(results);

      if (request.status === 200) {
        window.location.href = "feed.html";
        localStorage.setItem("accessToken", results.accessToken);
        localStorage.setItem("email", results.email);
        localStorage.setItem("username", results.name);

      } else {
        errorContainer.innerHTML = `<p>Wrong username or password</p>`;
      }
    } catch (e) {
      console.log(e);
    }
  }
  login("/social/auth/login");
});

//------------------------------- Create user -----------------------------

const headline = document.querySelector(".headline");
const createAccount = document.querySelector(".create_account_btn");
const createAccForm = document.querySelector(".create-acc-form");
const usernameDiv = document.querySelector(".username");
const createAccBtnNext = document.querySelector(".create_account_next_btn");
const createAccNextForm = document.querySelector(".create-acc-next-form");
const btnLogin = document.querySelector(".btn_login");
const createAccountSuccess = document.querySelector(".create_account_success");

createAccount.addEventListener("click", (e) => {
  e.preventDefault();
  headline.innerHTML = "<h1>Create Account</h1>";
  usernameDiv.classList.remove("username");
  createAccount.classList.add("remove_btn");
  createAccBtnNext.classList.remove("remove_btn");
  btnLogin.classList.add("remove_btn");
});

createAccNextForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector(".input_email").value;
  const password = document.querySelector(".input_password").value;
  const userName = document.querySelector(".input_username").value;
  const user = {
    name: userName,
    email: email,
    password: password,
  };
  console.log(email, password, userName);

  async function register(endpoint) {
    try {
      const request = await fetch(`${baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(user),
      });
      console.log(request.status);
      const results = await request.json();
      if (request.status === 200 || request.status === 201) {
        createAccountSuccess.innerHTML = `<div class="acc_created_success bg-success card"><h2>Account created<h2>`;
        createAccBtnNext.classList.add("remove_btn");
        usernameDiv.classList.add("username");
        btnLogin.classList.remove("remove_btn");
        headline.innerHTML = "<h1>Login</h1>";
      } else {
        createAccountSuccess.innerHTML = `<div class="bg-danger card"><h2>${results.message}</h2></div>`;
      }
    } catch (e) {
      console.log("This is the error: " + e);
    }
  }
  register("/social/auth/register");
});

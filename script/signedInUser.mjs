export { token, user_name, email, options };


const token = localStorage.getItem("accessToken");
const user_name = localStorage.getItem("username");
const email = localStorage.getItem("email");
const options = {
    headers: {
      "content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
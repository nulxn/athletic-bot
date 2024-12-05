console.clear();

function login() {
  // Create popup elements
  const popup = document.createElement("div");
  const closeButton = document.createElement("span");

  // Style the popup
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.padding = "20px";
  popup.style.backgroundColor = "var(--nord1)";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "1000";

  // Style the close button
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.cursor = "pointer";

  // Create title and content elements
  const title = document.createElement("h2");
  const content = document.createElement("p");

  // Set title and content text
  title.textContent = "Login";
  content.innerHTML =
    "Please use the command <code>/login</code> in Discord to login.";

  // Style title and content
  title.style.marginTop = "0";
  content.style.marginBottom = "20px";

  // Append title and content to popup
  popup.appendChild(title);
  popup.appendChild(content);

  // Append elements
  popup.appendChild(closeButton);
  document.body.appendChild(popup);

  // Close popup on button click
  closeButton.onclick = function () {
    document.body.removeChild(popup);
  };
}

function showProfile() {
  console.log("showProfile");
}

if (!localStorage.getItem("id")) {
  document.querySelector("header").querySelector("button").onclick = login;
} else {
  document.querySelector("header").querySelector("button").onclick =
    showProfile;
  document.querySelector("header").querySelector("button").textContent =
    "Profile";
}

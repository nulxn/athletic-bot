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
  popup.style.backgroundColor = "var(--bg)";
  popup.style.outline = "2px solid var(--border)";
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

let userDetails = {
  athleticid: "",
  created_at: "",
  id: 1,
  name: "",
};

let wsOptions = {
  picker: localStorage.getItem("id"),
};

function showProfile() {
  // Create popup elements
  const popup = document.createElement("div");
  const closeButton = document.createElement("span");

  // Style the popup
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.padding = "20px";
  popup.style.backgroundColor = "var(--bg)";
  popup.style.outline = "2px solid var(--border)";
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
  title.textContent = "Profile";
  content.innerHTML = `
    <strong>ID:</strong> ${userDetails.id}<br>
    <strong>Name:</strong> ${userDetails.name}<br>
    <strong>Athletic ID:</strong> ${userDetails.athleticid}<br>
    <strong>Created At:</strong> ${userDetails.created_at}
  `;

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

if (!localStorage.getItem("id")) {
  document.querySelector("header").querySelector("button").onclick = login;
} else {
  document.querySelector("header").querySelector("button").onclick =
    showProfile;
  document.querySelector("header").querySelector("button").textContent =
    "Profile";

  fetch("/api/user/details?id=" + localStorage.getItem("id"))
    .then((res) => res.json())
    .then((data) => {
      userDetails = data.user;
      wsOptions.name = data.user.name;
    });

  fetch("/api/user/athletes?id=" + localStorage.getItem("id"))
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });

  const ws = new WebSocket("ws://localhost:3001");

  ws.onopen = function () {
    ws.send(
      JSON.stringify({ type: "start", data: localStorage.getItem("id") })
    );
  };

  ws.onmessage = function (message) {
    let data = JSON.parse(message.data);
    let type = data.type;

    if (type === "draftPickComplete") {
      console.log(`${data.data.name} has picked ${data.data.athlete}`);
    }
  };

  document.getElementById("bob").onclick = function () {
    ws.send(
      JSON.stringify({ ...wsOptions, type: "draftPick", pick: "Lebron James" })
    );

    console.log(userDetails);
  };
}

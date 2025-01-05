console.clear();

let notyf = new Notyf();
const nopts = {
  dismissible: true,
  ripple: true,
  position: {
    x: "right",
    y: "bottom",
  },
};

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
      console.log("/details", data);
    });

  fetch("/api/user/athletes?id=" + localStorage.getItem("id"))
    .then((res) => res.json())
    .then((data) => {
      console.log("/athletes", data);
    });

  const ws = new WebSocket(
    window.location.href
      .replace("https", "wss")
      .replace("http", "ws")
      .replace("3000", "3001")
  );

  ws.onopen = function () {
    ws.send(
      JSON.stringify({ type: "start", data: localStorage.getItem("id") })
    );
  };

  let validPicks = [];
  let picked = [];
  let connectedUsers = [];
  let currentPicker = "";

  function populateTable() {
    let table = document.getElementById("table");
    document.getElementById("picker").textContent = currentPicker;
    table.innerHTML = "";

    validPicks.forEach((athlete) => {
      if (typeof athlete.prs === "string") {
        athlete.prs = JSON.parse(athlete.prs);
      }

      if (athlete.prs.length < 1) return;
      let row = document.createElement("tr");

      let icon = document.createElement("td");
      icon.innerHTML = `<img src="${athlete.icon}" alt="${athlete.name}" style="width: 50px; height: 50px;">`;
      let name = document.createElement("td");
      name.textContent = athlete.name;
      let school = document.createElement("td");
      school.textContent = athlete.school;
      let gender = document.createElement("td");
      gender.textContent = athlete.gender;

      let m100 = document.createElement("td");
      m100.textContent =
        athlete.prs.find((pr) => pr.event === "100")?.time ?? "-";
      let m200 = document.createElement("td");
      m200.textContent =
        athlete.prs.find((pr) => pr.event === "200")?.time ?? "-";
      let m400 = document.createElement("td");
      m400.textContent =
        athlete.prs.find((pr) => pr.event === "400")?.time ?? "-";
      let m800 = document.createElement("td");
      m800.textContent =
        athlete.prs.find((pr) => pr.event === "800")?.time ?? "-";
      let m1500 = document.createElement("td");
      m1500.textContent =
        athlete.prs.find((pr) => pr.event === "1500")?.time ?? "-";
      let m1600 = document.createElement("td");
      m1600.textContent =
        athlete.prs.find((pr) => pr.event === "1600")?.time ?? "-";
      let m3200 = document.createElement("td");
      m3200.textContent =
        athlete.prs.find((pr) => pr.event === "3200")?.time ?? "-";

      row.appendChild(icon);
      row.appendChild(name);
      row.appendChild(school);
      row.appendChild(gender);

      row.appendChild(m100);
      row.appendChild(m200);
      row.appendChild(m400);
      row.appendChild(m800);
      row.appendChild(m1500);
      row.appendChild(m1600);
      row.appendChild(m3200);

      let claim = document.createElement("td");
      if (picked.includes(athlete.name)) {
        claim.textContent = "Claimed";
        claim.style.color = "var(--text-dk)";
      } else {
        let button = document.createElement("button");
        button.textContent = "Claim";
        button.onclick = function () {
          ws.send(
            JSON.stringify({
              ...wsOptions,
              type: "draftPick",
              pick: athlete.name,
            })
          );
        };
        claim.appendChild(button);
      }
      row.appendChild(claim);

      table.appendChild(row);
    });

    const event = new Event("tableUpdate");
    document.dispatchEvent(event);
  }

  ws.onmessage = function (message) {
    let data = JSON.parse(message.data);
    let type = data.type;

    if (type === "draftPickComplete") {
      console.log(`${data.data.name} has picked ${data.data.athlete}`);
      console.log(`\t${data.data.next} picks next`);
      picked = data.data.picked;
      currentPicker = data.data.next;
      populateTable();
    } else if (type === "validPicks") {
      validPicks = data.data;
      populateTable();
    } else if (type === "userJoin") {
      connectedUsers = data.data;
    } else if (type === "draftFinished") {
      console.log("Draft Finished!");
    } else if (type === "error") {
      notyf.error({
        ...nopts,
        message: data.data,
      });
    }
  };
}

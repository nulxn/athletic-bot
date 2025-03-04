import fs from "fs";

let data = `1 Vestemean, Daniel 12 West Hills
2 Craig, Lyon 12 Health Scien
3 Gachuzo, Jaime 12 Del Lago Aca
4 Fleck, Kellan 10 La Costa Can
5 Stephens, Benjamin 11 Scripps Ranc
6 Bamford, Nathan 11 Scripps Ranc
7 Sun, Brandon 11 Scripps Ranc
8 Hannaman, Rowan 12 Westview
9 Silva, Gunner 11 Classical Ac
10 Lorenzano, Leo 11 Crawford
11 Gerding, Jamison 11 St Augustine
12 Hernandez, Ruben 10 High Tech Hi
13 Guerrero, Matteo 12 Vista Murrie
14 Benrud, Paul 11 Grossmont
15 Ramirez, Jose 12 Rancho Berna
16 Naranjo, Luis 10 Grossmont
17 Mesa, George 11 Ramona
18 Kaneko, Sho 12 Olympian
19 Levine, Ethan 11 Point Loma
20 Revak, Ryan 10 West Hills
21 Hawkins, Keaton 10 Mission Vist
22 Liu, William 11 Rancho Berna
23 Reed, Finn 10 La Costa Can
24 Torres, Alexis 12 Oceanside
25 Riley, Vincent 11 Crawford
26 Bejar, Baruch 9 University C
27 Echsner, Nicholas 10 Del Norte
28 Porter, Josh 11 San Marcos
29 Hoffman, Joshua 12 Bonita Vista
30 George, William 11 Ramona
31 Blanco, Giovanni 12 San Marcos
32 Clemeshaw, Evers 12 Classical Ac
33 Kelsey, Alex 10 Mission Vist
34 Hurtado, Adan 12 Bonita Vista
35 Branch, Noah 12 Vista Murrie
36 Degenhardt, Jack 11 Olympian
37 Hightower, Nolan 10 Del Norte
38 Iverson, Cameron 10 Westview
39 Masho, Yohannes 11 Crawford
40 Martinez, Andrew 11 Cathedral Ca
41 Robles, Cristian 12 Torrey Pines
42 Orozco, Roberto 12 Mount Miguel
43 Reyes, Loan 12 Grossmont
44 O'Connell, Liam 10 Scripps Ranc
45 Lesniewski, Max 11 Del Lago Aca
46 Nash, Dylan 9 Poway
47 Rivera Garcia, Tobias 10 Westview`;

let lines = data.split("\n");
let students = [];

for (let line of lines) {
  let parts = line.split(" ");
  let num = Number(parts[0]);

  let last = parts.slice(1).join(" ");
  let lastName = last.split(", ")[0];
  let firstName = last.split(", ")[1].split(" ")[0];
  students.push({ num, lastName, firstName });
}

const athletes = JSON.parse(fs.readFileSync("athletes.json"));

async function processStudents() {
  await Promise.all(
    students.map(async (student) => {
      let fullName = student.firstName + " " + student.lastName;
      let found = athletes.find((athlete) => athlete.Name === fullName);
      student.athlete = found || null;
    })
  );

  students.sort((a, b) => {
    let aPR =
      a.athlete?.prs.find((pr) => pr.event === "3200")?.time || "99:99.99";
    let bPR =
      b.athlete?.prs.find((pr) => pr.event === "3200")?.time || "99:99.99";
    return aPR.localeCompare(bPR);
  });

  students.forEach((student) => {
    console.log(
      student.firstName +
        " " +
        student.lastName +
        " " +
        student.athlete?.prs.find((pr) => pr.event === "3200")?.time
    );
  });
}

processStudents();

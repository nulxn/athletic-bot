console.clear();

console.log("\x1b[34m%s\x1b[0m", "Athletic.net Scraper\n");

import fs from "fs";
import path from "path";

const events = {
  1: "100",
  2: "200",
  3: "400",
  4: "800",
  5: "1500",
  52: "1600",
  60: "3200",
};

const url =
  "https://www.athletic.net/api/v1/DivisionHome/GetTree?sport=tfi&divisionId=162176&depth=3&includeTeams=true"; // change
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log("-----");
    console.log(`Division: ${data.tree.DivName}`);
    console.log(`ID: ${data.tree.IDDivision}`);
    console.log("-----");

    let sections = data.tree.L2.map((section) => ({
      id: section.IDDivision,
      name: section.DivName,
      leagues: section.L3.map((league) => ({
        id: league.IDDivision,
        name: league.DivName,
      })),
    }));

    const chosenSection = "North County"; // change
    const section = sections.find((section) => section.name === chosenSection);

    console.log(`Section: ${section.name}`);
    console.log(
      `Leagues: ${section.leagues.map((league) => league.name).join(", ")}`
    );
    console.log("-----\n");

    let leagues = section.leagues.map((league) => league.id);
    let athletes = [];
    let teams = data.alignedTeams.filter((team) =>
      leagues.includes(team.DivisionID)
    );

    async function scrapeTeam(team) {
      console.log(`Scraping: ${team.SchoolName}`);

      const teamCoreResponse = await fetch(
        `https://www.athletic.net/api/v1/TeamHome/GetTeamCore?teamId=${team.SchoolID}&sport=tfo&year=2025`
      );
      const teamCoreData = await teamCoreResponse.json();
      let jwt = teamCoreData.jwtTeamHome;
      console.log(`\t JWT: ${jwt.slice(0, 10)}...`);

      const athletesResponse = await fetch(
        "https://www.athletic.net/api/v1/TeamHome/GetAthletes?seasonId=2025",
        {
          headers: {
            anettokens: jwt,
          },
          referrer: `https://www.athletic.net/team/${team.SchoolID}/track-and-field-outdoor/2025`,
          method: "GET",
        }
      );
      const athletesData = await athletesResponse.json();

      athletesData.forEach((athlete) => {
        console.log(
          `Adding athlete ${athlete.Name} to team ${team.SchoolName}`
        );

        const existingAthlete = athletes.find((a) => a.ID === athlete.ID);
        if (!existingAthlete) {
          athletes.push({
            ...athlete,
            team: team.SchoolName,
            team_id: team.SchoolID,
            icon: team.MascotUrl,
          });
        } else {
          console.log(
            "'\x1b[31m%s\x1b[0m'",
            `\tDuplicate athlete detected: ${athlete.Name}`
          );
        }
      });
    }

    async function scrapeTeams(teams) {
      for (const team of teams) {
        await scrapeTeam(team);
      }
    }

    async function scrapeAthlete(athlete) {
      console.log(`Scraping: ${athlete.Name} of ${athlete.team}`);
      const response = await fetch(
        `https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athlete.ID}&sport=tf&level=undefined`
      );
      const data = await response.json();
      const level = data.allTeams[String(athlete.team_id)]?.Level ?? "timmy";

      if (level !== "timmy") {
        const res = await fetch(
          `https://www.athletic.net/api/v1/AthleteBio/GetAthleteBioData?athleteId=${athlete.ID}&sport=tf&level=${level}`
        );
        const json = await res.json();

        let prs = json.resultsTF
          .filter((result) => result.PersonalBest === 14)
          .map((result) => ({
            time: result.Result,
            event: events[result.EventID],
          }));

        athlete.prs = prs;
      }
    }

    async function scrapeAthletes(athletes) {
      for (const athlete of athletes) {
        await scrapeAthlete(athlete);
      }
    }

    async function main() {
      await scrapeTeams(teams);
      await console.log("-----\n");

      await scrapeAthletes(athletes);
      await console.log(athletes[0].prs);
      await console.log("-----\n");
      await fs.writeFileSync(
        "athletes.json",
        JSON.stringify(athletes, null, 2)
      );
      await console.log("Data saved to athletes.json!");
    }

    main();
  });

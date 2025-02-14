const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const companies = {
  sonolife: {
    name: "Sonolife",
    file: "Sonolife.csv",
    days: 6,
  },
  mercamobil: {
    name: "Merca Mobil Max",
    file: "MMM.csv",
    days: 5,
  },
  compasso: {
    name: "Compasso",
    file: "Compasso.csv",
    days: 5,
  },
};

// Create the output folder if it doesn't exist
const outputFolder = path.join(__dirname, "output_files");
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

for (let company in companies) {
  const results = []; // Clear results for each company
  const data = []; // Clear data for each company

  fs.createReadStream(companies[company].file)
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => {
      results.forEach((result) => {
        if (!result["Person ID"].includes("Check-In")) {
          data.push({
            name: result["Name"],
            date: result["Date"],
            status: result["Attendance Status"],
            in: result["Check-In"],
            out: result["Check-out"],
            late: result["Late"],
          });
        }
      });

      // Save the CSV in the output folder
      writeCSV(
        convertToCSV(data, companies[company].days),
        path.join(outputFolder, `output - ${companies[company].name}.csv`)
      );
    });
}

const convertToCSV = (data, days) => {
  const header = Object.keys(data[0]).join(",") + "\n";

  const csv = data
    .map((row, index) => {
      const csvRow = Object.values(row).join(",") + "\n";

      // Insert an empty line after days
      if ((index + 1) % days === 0 && index !== data.length - 1) {
        return csvRow + "\n";
      } else {
        return csvRow;
      }
    })
    .join("");

  return header + csv;
};

const writeCSV = (data, filename) => {
  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    console.log(`${filename} has been saved!`);
  });
};

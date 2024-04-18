const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const data = [];

fs.createReadStream("Attendance Details.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    results.map((result) => {
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
    writeCSV(convertToCSV(data), "output.csv");
  });

const convertToCSV = (data) => {
  const header = Object.keys(data[0]).join(",") + "\n";

  const csv = data
    .map((row, index) => {
      const csvRow = Object.values(row).join(",") + "\n";

      // Insert an empty line after every 6 entries
      if ((index + 1) % 6 === 0 && index !== data.length - 1) {
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
    console.log("The file has been saved!");
  });
};

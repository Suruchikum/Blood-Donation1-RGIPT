
const fs = require("fs");
const path = require("path");
const express = require("express");
const ExcelJS = require("exceljs");

const app = express();
const port = 4500;

app.get("/home", (req, res) => {
  res.send("hello home");
});

app.get("/donors", (req, res) => {
  fs.readFile("datargipt.pdf", "utf-8", (err, datargipt) => {
    if (err) {
      return res.status(500).send("Error reading file");
    }

    const donors = [];
    const lines = datargipt.split("\n");

    let currentDonor = null;

    lines.forEach((line) => {
      // Match for Donor Name
      const donorNameMatch = line.match(/Donor Name\s+:\s+(.+?)\s+\|/);
      if (donorNameMatch) {
        if (currentDonor) {
          // Check for duplicates before pushing
          if (!donors.find(donor => donor.donorName === currentDonor.donorName && donor.hb === currentDonor.hb && donor.bloodGroup === currentDonor.bloodGroup)) {
            donors.push(currentDonor);
          }
        }
        currentDonor = { donorName: donorNameMatch[1] };
      }

      // Match for HB (gm/dl)
      const hbMatch = line.match(/HB\s+:\s+(\d+(\.\d+)?)/);
      if (hbMatch) {
        currentDonor.hb = parseFloat(hbMatch[1]);
      }

      // Match for Blood Group
      const bloodGroupMatch = line.match(/Blood Group\s+:\s+(\w+)/);
      if (bloodGroupMatch) {
        currentDonor.bloodGroup = bloodGroupMatch[1];
      }
    });

    if (currentDonor) {
      // Check for duplicates before pushing
      if (!donors.find(donor => donor.donorName === currentDonor.donorName && donor.hb === currentDonor.hb && donor.bloodGroup === currentDonor.bloodGroup)) {
        donors.push(currentDonor);
      }
    }

    console.log(`Parsed donors: ${JSON.stringify(donors, null, 2)}`);

    const outputFilePath = path.join(__dirname, "donors.json");
    fs.writeFile(outputFilePath, JSON.stringify(donors, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing JSON file");
      }

      createWorkbook(donors, (err) => {
        if (err) {
          return res.status(500).send("Error creating Excel file");
        }
        res.json({ message: "Data written to donors.json and donors.xlsx", donors });
      });
    });
  });
});

function createWorkbook(donors, callback) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Donors');

  // Add headers
  worksheet.getRow(1).values = ["Donor Name", "HB (gm/dl)", "Blood Group"];

  // Add donor data
  donors.forEach((donor) => {
    worksheet.addRow([donor.donorName, donor.hb || 0.0, donor.bloodGroup]);
  });

  // Save the workbook to a file
  const filePath = path.join(__dirname, 'donors.xlsx');
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log(`Workbook saved to ${filePath}`);
      callback();
    })
    .catch(err => {
      console.error('Error writing workbook:', err);
      callback(err);
    });
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

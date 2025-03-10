const express = require("express");
const os = require("os");
const { execSync } = require("child_process");
const useragent = require("useragent");
const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");
const progress = require("progress");
const reverseDns = require("reverse-dns");
const geo = require("ip-api");
const netPing = require("net-ping");
const asciiCharts = require("ascii-charts");
const terminalImage = require("terminal-image");

const app = express();
const PORT = 3000;
const FILE_PATH = "tracked_ips.json";
const IP_API_URL = "http://ip-api.com/json/";

if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 4));

app.use(express.static(__dirname));

// Helper function to fetch IP reputation
async function getIPReputation(ip) {
  const spinner = ora(`Checking reputation for IP: ${ip}`).start();
  try {
    const response = await axios.get(`https://www.abuseipdb.com/check/${ip}`);
    spinner.stop();
    return response.data;
  } catch (err) {
    spinner.stop();
    console.error(chalk.red("Error checking IP reputation: "), err);
    return { error: "Failed to fetch IP reputation." };
  }
}

// Helper function for port scanning
function scanPorts(ip) {
  const ports = [80, 443, 21, 22, 23, 3306, 8080]; // Common ports
  const openPorts = [];
  const spinner = ora("Scanning for open ports...").start();
  const session = netPing.createSession();

  ports.forEach((port) => {
    session.pingHost(ip, (error, target) => {
      if (!error) {
        openPorts.push(port);
      }
    });
  });

  spinner.stop();
  return openPorts;
}

// Function to check the geolocation of an IP
async function getGeolocation(ip) {
  const spinner = ora("Fetching geolocation data...").start();
  try {
    const response = await axios.get(`${IP_API_URL}${ip}`);
    spinner.stop();
    return response.data;
  } catch (err) {
    spinner.stop();
    console.error(chalk.red("Error fetching geolocation data: "), err);
    return { error: "Failed to fetch geolocation data." };
  }
}

// Function to reverse DNS lookup
async function reverseDNS(ip) {
  const spinner = ora("Performing reverse DNS lookup...").start();
  try {
    const result = await reverseDns.lookup(ip);
    spinner.stop();
    return result;
  } catch (err) {
    spinner.stop();
    console.error(chalk.red("Error performing reverse DNS lookup: "), err);
    return { error: "Failed to perform reverse DNS lookup." };
  }
}

// Function to scan local network
function scanLAN() {
  let devices = [];
  try {
    const arpOutput = execSync("arp -a", { encoding: "utf-8" });
    const lines = arpOutput.split("\n");
    lines.forEach((line) => {
      const match = line.match(/([0-9]+.[0-9]+.[0-9]+.[0-9]+)\s+([a-fA-F0-9:-]+)/);
      if (match) {
        devices.push({ ip: match[1], mac: match[2], hostname: "Unknown" });
      }
    });
  } catch (err) {
    console.error(chalk.red("Error scanning LAN: "), err);
  }
  return devices;
}

// Function to display the graphical report
function showReport(data) {
  const chartData = asciiCharts.plot({
    data: [
      {
        label: "Open Ports",
        data: data.openPorts,
      },
      {
        label: "Scanned Devices",
        data: data.lanDevices,
      },
    ],
    height: 10,
    width: 40,
  });

  console.log(chalk.green("\nGraphical Report:\n"));
  console.log(chartData);
}

// Main function to show the interactive menu
async function displayMenu() {
  console.clear();
  console.log(boxen(chalk.green.bold("===================================="), { padding: 1, margin: 1 }));
  console.log(boxen(chalk.green.bold("   Welcome to the IP Stalker Tool   "), { padding: 1, margin: 1 }));
  console.log(boxen(chalk.green.bold("===================================="), { padding: 1, margin: 1 }));

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Choose an option:",
      choices: [
        "Track Your IP",
        "Track Another IP",
        "Scan Local Network",
        "Port Scan",
        "Geolocation Info",
        "Reverse DNS Lookup",
        "IP Reputation Check",
        "Show Graphical Report",
        "View Tracked Data",
        "Developer Information",
        "Exit",
      ],
    },
  ]);

  switch (choice) {
    case "Track Your IP":
      console.log(chalk.blue("Tracking your public IP..."));
      app.get("/track", trackUserIP);
      app.listen(PORT, () => {
        console.log(chalk.yellow(`Server running at http://localhost:${PORT}`));
      });
      break;

    case "Track Another IP":
      const { ip } = await inquirer.prompt([
        {
          type: "input",
          name: "ip",
          message: "Enter the IP address you want to track:",
          validate: function (input) {
            const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return regex.test(input) ? true : "Please enter a valid IP address.";
          },
        },
      ]);
      const data = await trackOtherIP(ip);
      console.log(chalk.green("\nIP Information:\n"), JSON.stringify(data, null, 2));
      break;

    case "Scan Local Network":
      console.log(chalk.blue("Scanning local network..."));
      const lanDevices = scanLAN();
      console.log(chalk.green("\nLAN Devices:\n"), JSON.stringify(lanDevices, null, 2));
      break;

    case "Port Scan":
      const { targetIp } = await inquirer.prompt([
        {
          type: "input",
          name: "targetIp",
          message: "Enter the IP address for port scanning:",
          validate: function (input) {
            const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            return regex.test(input) ? true : "Please enter a valid IP address.";
          },
        },
      ]);
      const openPorts = scanPorts(targetIp);
      console.log(chalk.green("\nOpen Ports:\n"), openPorts.join(", "));
      break;

    case "Geolocation Info":
      const { geoIp } = await inquirer.prompt([
        {
          type: "input",
          name: "geoIp",
          message: "Enter the IP address for geolocation:",
        },
      ]);
      const geoData = await getGeolocation(geoIp);
      console.log(chalk.green("\nGeolocation Info:\n"), JSON.stringify(geoData, null, 2));
      break;

    case "Reverse DNS Lookup":
      const { dnsIp } = await inquirer.prompt([
        {
          type: "input",
          name: "dnsIp",
          message: "Enter the IP address for reverse DNS lookup:",
        },
      ]);
      const reverseDnsResult = await reverseDNS(dnsIp);
      console.log(chalk.green("\nReverse DNS Result:\n"), reverseDnsResult);
      break;

    case "IP Reputation Check":
      const { ipCheck } = await inquirer.prompt([
        {
          type: "input",
          name: "ipCheck",
          message: "Enter the IP address to check its reputation:",
        },
      ]);
      const reputationData = await getIPReputation(ipCheck);
      console.log(chalk.green("\nIP Reputation:\n"), JSON.stringify(reputationData, null, 2));
      break;

    case "Show Graphical Report":
      const dataForGraph = {
        openPorts: [80, 443, 8080, 3306],
        lanDevices: ["Device1", "Device2", "Device3"],
      };
      showReport(dataForGraph);
      break;

    case "View Tracked Data":
      const trackedData = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
      console.log(chalk.green("\nTracked Data:\n"), JSON.stringify(trackedData, null, 2));
      break;

    case "Developer Information":
      console.log(chalk.cyan(`
        Developer: Redwan Ahemed
        Version: 5.0
        GitHub: https://github.com/redwan-ahemed
        This tool allows you to track IPs, scan local networks, perform reverse DNS lookups, and more.
      `));
      break;

    case "Exit":
      console.log(chalk.red("Exiting the tool. Goodbye!"));
      process.exit();
      break;

    default:
      console.log(chalk.red("Invalid option. Please try again."));
      displayMenu();
      break;
  }
}

// Function to run the tool
displayMenu();

# IP Stalker Tool

A powerful command-line-based IP tracking and analysis tool for stalking IP addresses, scanning local networks, retrieving detailed information, and more. This tool is designed to help developers and security researchers analyze network information, track devices, and gather useful data for network troubleshooting or investigation.

## Features

- **Track Your Own IP Info**: Get detailed information about your own IP address (public and local IPs, device info, etc.).
- **Stalk Someone's IP Info**: Input a remote IP address to retrieve its details.
- **Developer Info**: Display information about the tool and the developer.
- **Network Scanning**: Scan your local network to find devices connected to it.
- **Real-Time Data**: Gather real-time data from devices and track activities such as VPN use, camera/mic status, Bluetooth devices, USB devices, etc.

## Prerequisites

- Node.js (version 14.0.0 or above)
- npm (Node Package Manager)

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/yourusername/ip-stalker-tool.git
cd ip-stalker-tool
2. Install Dependencies
Run the following command to install all the necessary dependencies:

bash
Copy code
npm install
3. Run the Tool
After installing dependencies, you can run the tool using the following command:

bash
Copy code
npm start
This will start the application and show a simple text-based interface in your terminal where you can select various options like tracking your own IP, stalking someone else's IP, or viewing developer information.

Usage
Main Menu
Upon running the tool, you will see a menu with the following options:

Get Your Own IP Stalked Info: Track details related to your own public and local IP.
Get Someone Else's IP Stalked Info: Input a real-time IP address and get information about that IP.
Developer Info: View information about the developer and the tool.
Use the arrow keys or input the corresponding number to select an option.

Features
Track Your Own IP Info
The tool will automatically detect your public IP address and provide additional details, including:

Public IP
Local IP
MAC Address
Device Name
VPN status
Camera/Microphone status
Bluetooth devices
USB devices
Wi-Fi passwords (Windows only)
Running applications
Stalk Someone Else's IP Info
You can input a real-time IP address to get detailed information about it, including:

Geolocation (City, Country, etc.)
Reverse DNS lookup
Ping status
Other network-related data
Developer Info
Shows information about the developer and additional resources or contact info.

Supported Platforms
Linux
macOS
Windows (with some Windows-specific features such as retrieving Wi-Fi passwords)
Dependencies
This project uses the following dependencies:

axios: To make HTTP requests for external APIs.
chalk: For colored terminal output.
express: For creating a simple web server.
inquirer: For interactive command-line prompts.
boxen: For creating beautiful box-style output.
ora: For showing spinners to indicate progress.
reverse-dns: For reverse DNS lookups.
progress: For showing progress bars.
terminal-image: For displaying images in the terminal.
net-ping: For checking if a remote IP is reachable (ping).
ip-api: For geolocation and IP information.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Note: This tool is intended for educational and personal use only. Please ensure you have permission before attempting to gather information from networks or devices that you do not own or control.

Contributing
If you'd like to contribute to the development of this tool, feel free to fork the repository, make changes, and submit a pull request. All contributions are welcome!

Developer: Redwan Ahemed
Contact: [Your Contact Information or Social Links]

vbnet
Copy code

### Key Sections in the `README.md`

1. **Project Title and Description**: Brief overview of what the tool does and its purpose.
2. **Features**: A list of the key features of the tool.
3. **Prerequisites**: Requirements like Node.js and npm.
4. **Installation Instructions**: Steps to set up the tool on the local machine.
5. **Usage**: Describes how to use the tool and the features it offers.
6. **Dependencies**: A list of the libraries that the tool depends on.
7. **License**: Basic information about the project's license (MIT in this case).
8. **Contributing**: How users can contribute to the project.

### Customization

You can replace "yourusername" in the clone URL with your actual GitHub username, and you can add contact info or social media links in the "Developer" section. Feel free to expand or modify sections as needed.

Let me know if you'd like any additional changes!


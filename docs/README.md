<div align="center">

<table width="100%">
<tr>

<td align="left" width="25%">
<img src="./images/indiapost_logo_v2.webp"
     alt="India Post"
     width="100"/>

<p style="font-size: 8px; font-weight: bold; color: #444444; font-family: Arial, Helvetica, sans-serif; margin-top: 4px; margin-left: 2px;">
भारतीय डाक · डाक सेवा जन सेवा
</p>
</td>

<td align="center" width="50%">

<p align="center">
<img src="./images/DIGIPIN_Logo.png"
     alt="DIGIPIN logo"
     width="52"
     style="vertical-align: middle; margin-right: 12px;"/>
<span style="font-size: 48px; font-weight: 800; letter-spacing: 1px; vertical-align: middle; font-family: Arial, Helvetica, sans-serif;">
DIGIPIN


<td align="left" width="25%">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Ministry_of_Communications_India.svg/1920px-Ministry_of_Communications_India.svg.png"
     alt="Ministry of Communications"
     width="210"/>

<p style="font-size: 10px; font-weight: bold; color: #444444; font-family: Arial, Helvetica, sans-serif; margin-top: 4px; margin-left: 0px;">
Government of India
</p>

</td>

</tr>
</table>

<div style="height:4px; width:100%; background:linear-gradient(to right, #f58220 50%, #138808 50%);"></div>

</div>

## 🌐 A Geospatial Addressing Solution by India Post

<p align="justify">

<b>
<img src="./images/DIGIPIN_Logo.png"
     alt="DIGIPIN logo"
     width="14"
     style="vertical-align: middle; margin-right: 4px;"/>
DIGIPIN (Digital PIN)
</b> is visualized as an geospatial addressing grid system that assigns a unique 10-digit alphanumeric code that represents a 4-meter by 4-meter(approx.) units, derived from the latitude and longitude coordinates of the unit. This alphanumeric code serves as the addressing reference for any specific location within the DIGIPIN system. DIGIPIN is a function of the latitude and longitude of the location represented as a grid value.  
<br>
<br>

<p>
  This open-source Node.js project exposes a public API to generate and decode DIGIPINs, supporting geolocation services, postal logistics, and spatial analysis applications.
</p>


[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.x-blue.svg)](https://expressjs.com/)

---

## 🏛️ About DIGIPIN

The Department of Posts has undertaken an initiative to establish a Digital Public Infrastructure (DPI) for a standardized, geo-coded addressing system in India. DIGIPIN represents the foundation layer of this infrastructure.

Developed in collaboration with IIT Hyderabad and NRSC (National Remote Sensing Centre, ISRO), DIGIPIN is an open-source national-level addressing grid that serves as a key component of India's digital address ecosystem.

After extensive public consultation and expert review, the DIGIPIN Grid has been finalized to provide simplified addressing solutions for seamless delivery of public and private services, enabling "Address as a Service" (AaaS) across the country.

It provides a precise, user-friendly, and interoperable method for representing geographic locations, enabling seamless conversion between DIGIPIN codes and latitude/longitude coordinates for easy sharing, navigation, and digital addressing.



### ✨ Key Highlights

- **Uniform Referencing Framework**: Provides logical, precise location identification both offline and online
- **GIS Integration**: Bridges the gap between physical and digital addresses
- **Cross-Sector Support**: Enhances service delivery across emergency response, e-commerce, logistics, BFSI, and governance
- **Policy Alignment**: Complies with the National Geospatial Policy 2022, enriching India's geospatial knowledge stack

DIGIPIN simplifies address management and enhances service delivery accuracy, promoting a thriving geospatial ecosystem for India's digital economy.

---

## ⚙️ Features

- **Encode**: Convert latitude and longitude into a compact 10-character DIGIPIN
- **Decode**: Transform a DIGIPIN back to its center-point coordinates
- **Lightweight**: Optimized for performance and minimal resource usage
- **RESTful API**: Clean, standard-compliant endpoints
- **Interactive Documentation**: Comprehensive Swagger UI for easy exploration
- **Production-Ready**: Built with Node.js and Express for reliability

---
## 🔖 DIGIPIN Representation Guidelines

<p align="justify">
DIGIPIN shall be represented using the <b>official DIGIPIN symbol</b> adopted by the Department of Posts, Government of India, followed by a valid <b>10-character alphanumeric DIGIPIN</b>.

For digital processing, storage, transmission, and interoperability, DIGIPIN shall be maintained as a <b>continuous 10-character identifier</b> containing only approved DIGIPIN characters. Hyphens (-) and other punctuation characters are not permitted. For display purposes, spaces may optionally be used in a <b>3-4-3 grouping pattern</b> to improve readability.
</p>

<table width="100%">
<tr>
<th align="left">Representation</th>
<th align="left">Status</th>
</tr>

<tr>
<td>
<img src="./images/DIGIPIN_Logo.png" alt="DIGIPIN" width="14" style="vertical-align:middle;" />
&nbsp;<b>C4P8K63M4M</b>
</td>
<td>✅ Approved</td>
</tr>

<tr>
<td>
<img src="./images/DIGIPIN_Logo.png" alt="DIGIPIN" width="14" style="vertical-align:middle;" />
&nbsp;<b>C4P 8K63 M4M</b>
</td>
<td>✅ Acceptable Display Format</td>
</tr>

<tr>
<td>
<b>C4P8K63M4M</b>
</td>
<td>❌ DIGIPIN symbol missing</td>
</tr>

<tr>
<td>
<img src="./images/DIGIPIN_Logo.png" alt="DIGIPIN" width="14" style="vertical-align:middle;" />
&nbsp;<b>C4P-8K6-3M4M</b>
</td>
<td>❌ Hyphens are not permitted</td>
</tr>
</table>

> **Note:** For APIs, databases, integrations, and system-to-system exchange, DIGIPIN shall always be represented as a continuous **10-character alphanumeric identifier** without spaces, hyphens, or other punctuation characters.
---

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Getting Started

1. **Clone the Repository**

```bash
git clone https://github.com/INDIAPOST-gov/digipin.git
cd digipin
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the project root with the following variables:

```
PORT=5000
NODE_ENV=development
```

4. **Start the Server**

```bash
npm start
```

For development with hot reloading:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

---

## 🚀 API Usage

The project exposes two primary REST APIs: an encoding API to generate a DIGIPIN from latitude and longitude coordinates, and a decoding API to derive geographic coordinates from a valid DIGIPIN.

### 1. Encode Coordinates to DIGIPIN
The API validates the supplied latitude and longitude coordinates and encodes them into a single unique 10-character alphanumeric DIGIPIN string, without any punctuations.

### Example Request

```
GET /api/digipin/encode?latitude=13.11179621&longitude=80.20264269
```

**Example Response:**

```
json
{
  "digipin": "4T396F42L7"
}
```

### 2. Decode DIGIPIN to Coordinates
The API validates the supplied 10-character alphanumeric DIGIPIN and decodes it into the corresponding geographic coordinates (latitude and longitude) representing the center point of the identified grid cell.

### Example Request

```
GET /api/digipin/decode?digipin=4P3JK852C9
```

**Example Response:**

```
json
{
    "latitude": "12.971601",
    "longitude": "77.594584"
}
```

### Interactive API Documentation

Access the Swagger UI documentation at:

```
http://localhost:5000/api-docs
```

---
 
## 🔧 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code adheres to the existing style and passes all tests.

---

## 📜 License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Department of Posts, Government of India
- Indian Institute of Technology, Hyderabad
- National Remote Sensing Centre, ISRO

---

## ⚖️ Legal

- [Privacy Policy](PRIVACY_POLICY.md)
- [Disclaimer](DISCLAIMER.md)

---

*Transforming addresses for Digital India*
---

## 📝 Release Information

See [CHANGELOG.md](CHANGELOG.md) for version history and release notes.
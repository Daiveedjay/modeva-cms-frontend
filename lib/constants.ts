export const MIN_PRODUCT_NAME_LENGTH = 1;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 300;
export const MAX_TAG_LENGTH = 20;
export const MAX_TAGS = 10;
export const MAX_COMPOSITION_FIELDS = 5;
export const MAX_COMPOSITION_LABEL_LENGTH = 20;
export const MAX_COMPOSITION_CONTENT_LENGTH = 50;
export const MAX_PRICE = 1000000; // 1 million
export const MAX_STOCK = 10000; // 10 thousand
export const MAX_MEDIA_FILES = 4; // Maximum number of media files allowed
export const MAX_SEO_TITLE_LENGTH = 100; // Maximum length for SEO title
export const MAX_SEO_DESCRIPTION_LENGTH = 400; // Maximum length for SEO description

export const MAX_CATEGORY_NAME_LENGTH = 50; // Maximum length for category name
export const MAX_CATEGORY_DESCRIPTION_LENGTH = 200; // Maximum length for category description

export const MIN_CATEGORY_NAME_LENGTH = 3; // Minimum length for category name

export const TAX_PERCENTAGE = 20;
export const SHIPPING_PERCENTAGE = 10;

// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
// export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION!;
// export const API_ENDPOINT = `${BASE_URL}${API_VERSION}`;
// constants.ts
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
const apiAdminPrefix = process.env.NEXT_PUBLIC_API_ADMIN_PREFIX;

if (!baseUrl || !apiVersion) {
  throw new Error(
    `Missing env vars: NEXT_PUBLIC_BASE_URL = ${baseUrl}, NEXT_PUBLIC_API_VERSION = ${apiVersion}`,
  );
}

export const BASE_URL = baseUrl;
export const API_VERSION = apiVersion;
export const API_ENDPOINT = `${baseUrl}${apiVersion}`;
export const API_ADMIN_PREFIX = apiAdminPrefix;

export const COUNTRIES = [
  {
    value: "Afghanistan",
    code: "AF",
  },
  {
    value: "Åland Islands",
    code: "AX",
  },
  {
    value: "Albania",
    code: "AL",
  },
  {
    value: "Algeria",
    code: "DZ",
  },
  {
    value: "American Samoa",
    code: "AS",
  },
  {
    value: "Andorra",
    code: "AD",
  },
  {
    value: "Angola",
    code: "AO",
  },
  {
    value: "Anguilla",
    code: "AI",
  },
  {
    value: "Antarctica",
    code: "AQ",
  },
  {
    value: "Antigua and Barbuda",
    code: "AG",
  },
  {
    value: "Argentina",
    code: "AR",
  },
  {
    value: "Armenia",
    code: "AM",
  },
  {
    value: "Aruba",
    code: "AW",
  },
  {
    value: "Australia",
    code: "AU",
  },
  {
    value: "Austria",
    code: "AT",
  },
  {
    value: "Azerbaijan",
    code: "AZ",
  },
  {
    value: "Bahamas",
    code: "BS",
  },
  {
    value: "Bahrain",
    code: "BH",
  },
  {
    value: "Bangladesh",
    code: "BD",
  },
  {
    value: "Barbados",
    code: "BB",
  },
  {
    value: "Belarus",
    code: "BY",
  },
  {
    value: "Belgium",
    code: "BE",
  },
  {
    value: "Belize",
    code: "BZ",
  },
  {
    value: "Benin",
    code: "BJ",
  },
  {
    value: "Bermuda",
    code: "BM",
  },
  {
    value: "Bhutan",
    code: "BT",
  },
  {
    value: "Bolivia",
    code: "BO",
  },
  {
    value: "Bosnia and Herzegovina",
    code: "BA",
  },
  {
    value: "Botswana",
    code: "BW",
  },
  {
    value: "Bouvet Island",
    code: "BV",
  },
  {
    value: "Brazil",
    code: "BR",
  },
  {
    value: "British Indian Ocean Territory",
    code: "IO",
  },
  {
    value: "British Virgin Islands",
    code: "VG",
  },
  {
    value: "Brunei",
    code: "BN",
  },
  {
    value: "Bulgaria",
    code: "BG",
  },
  {
    value: "Burkina Faso",
    code: "BF",
  },
  {
    value: "Burundi",
    code: "BI",
  },
  {
    value: "Cambodia",
    code: "KH",
  },
  {
    value: "Cameroon",
    code: "CM",
  },
  {
    value: "Canada",
    code: "CA",
  },
  {
    value: "Cape Verde",
    code: "CV",
  },
  {
    value: "Caribbean Netherlands",
    code: "BQ",
  },
  {
    value: "Cayman Islands",
    code: "KY",
  },
  {
    value: "Central African Republic",
    code: "CF",
  },
  {
    value: "Chad",
    code: "TD",
  },
  {
    value: "Chile",
    code: "CL",
  },
  {
    value: "China",
    code: "CN",
  },
  {
    value: "Christmas Island",
    code: "CX",
  },
  {
    value: "Cocos (Keeling) Islands",
    code: "CC",
  },
  {
    value: "Colombia",
    code: "CO",
  },
  {
    value: "Comoros",
    code: "KM",
  },
  {
    value: "Cook Islands",
    code: "CK",
  },
  {
    value: "Costa Rica",
    code: "CR",
  },
  {
    value: "Croatia",
    code: "HR",
  },
  {
    value: "Cuba",
    code: "CU",
  },
  {
    value: "Curaçao",
    code: "CW",
  },
  {
    value: "Cyprus",
    code: "CY",
  },
  {
    value: "Czechia",
    code: "CZ",
  },
  {
    value: "Denmark",
    code: "DK",
  },
  {
    value: "Djibouti",
    code: "DJ",
  },
  {
    value: "Dominica",
    code: "DM",
  },
  {
    value: "Dominican Republic",
    code: "DO",
  },
  {
    value: "DR Congo",
    code: "CD",
  },
  {
    value: "Ecuador",
    code: "EC",
  },
  {
    value: "Egypt",
    code: "EG",
  },
  {
    value: "El Salvador",
    code: "SV",
  },
  {
    value: "Equatorial Guinea",
    code: "GQ",
  },
  {
    value: "Eritrea",
    code: "ER",
  },
  {
    value: "Estonia",
    code: "EE",
  },
  {
    value: "Eswatini",
    code: "SZ",
  },
  {
    value: "Ethiopia",
    code: "ET",
  },
  {
    value: "Falkland Islands",
    code: "FK",
  },
  {
    value: "Faroe Islands",
    code: "FO",
  },
  {
    value: "Fiji",
    code: "FJ",
  },
  {
    value: "Finland",
    code: "FI",
  },
  {
    value: "France",
    code: "FR",
  },
  {
    value: "French Guiana",
    code: "GF",
  },
  {
    value: "French Polynesia",
    code: "PF",
  },
  {
    value: "French Southern and Antarctic Lands",
    code: "TF",
  },
  {
    value: "Gabon",
    code: "GA",
  },
  {
    value: "Gambia",
    code: "GM",
  },
  {
    value: "Georgia",
    code: "GE",
  },
  {
    value: "Germany",
    code: "DE",
  },
  {
    value: "Ghana",
    code: "GH",
  },
  {
    value: "Gibraltar",
    code: "GI",
  },
  {
    value: "Greece",
    code: "GR",
  },
  {
    value: "Greenland",
    code: "GL",
  },
  {
    value: "Grenada",
    code: "GD",
  },
  {
    value: "Guadeloupe",
    code: "GP",
  },
  {
    value: "Guam",
    code: "GU",
  },
  {
    value: "Guatemala",
    code: "GT",
  },
  {
    value: "Guernsey",
    code: "GG",
  },
  {
    value: "Guinea",
    code: "GN",
  },
  {
    value: "Guinea-Bissau",
    code: "GW",
  },
  {
    value: "Guyana",
    code: "GY",
  },
  {
    value: "Haiti",
    code: "HT",
  },
  {
    value: "Heard Island and McDonald Islands",
    code: "HM",
  },
  {
    value: "Honduras",
    code: "HN",
  },
  {
    value: "Hong Kong",
    code: "HK",
  },
  {
    value: "Hungary",
    code: "HU",
  },
  {
    value: "Iceland",
    code: "IS",
  },
  {
    value: "India",
    code: "IN",
  },
  {
    value: "Indonesia",
    code: "ID",
  },
  {
    value: "Iran",
    code: "IR",
  },
  {
    value: "Iraq",
    code: "IQ",
  },
  {
    value: "Ireland",
    code: "IE",
  },
  {
    value: "Isle of Man",
    code: "IM",
  },
  {
    value: "Israel",
    code: "IL",
  },
  {
    value: "Italy",
    code: "IT",
  },
  {
    value: "Ivory Coast",
    code: "CI",
  },
  {
    value: "Jamaica",
    code: "JM",
  },
  {
    value: "Japan",
    code: "JP",
  },
  {
    value: "Jersey",
    code: "JE",
  },
  {
    value: "Jordan",
    code: "JO",
  },
  {
    value: "Kazakhstan",
    code: "KZ",
  },
  {
    value: "Kenya",
    code: "KE",
  },
  {
    value: "Kiribati",
    code: "KI",
  },
  {
    value: "Kosovo",
    code: "XK",
  },
  {
    value: "Kuwait",
    code: "KW",
  },
  {
    value: "Kyrgyzstan",
    code: "KG",
  },
  {
    value: "Laos",
    code: "LA",
  },
  {
    value: "Latvia",
    code: "LV",
  },
  {
    value: "Lebanon",
    code: "LB",
  },
  {
    value: "Lesotho",
    code: "LS",
  },
  {
    value: "Liberia",
    code: "LR",
  },
  {
    value: "Libya",
    code: "LY",
  },
  {
    value: "Liechtenstein",
    code: "LI",
  },
  {
    value: "Lithuania",
    code: "LT",
  },
  {
    value: "Luxembourg",
    code: "LU",
  },
  {
    value: "Macau",
    code: "MO",
  },
  {
    value: "Madagascar",
    code: "MG",
  },
  {
    value: "Malawi",
    code: "MW",
  },
  {
    value: "Malaysia",
    code: "MY",
  },
  {
    value: "Maldives",
    code: "MV",
  },
  {
    value: "Mali",
    code: "ML",
  },
  {
    value: "Malta",
    code: "MT",
  },
  {
    value: "Marshall Islands",
    code: "MH",
  },
  {
    value: "Martinique",
    code: "MQ",
  },
  {
    value: "Mauritania",
    code: "MR",
  },
  {
    value: "Mauritius",
    code: "MU",
  },
  {
    value: "Mayotte",
    code: "YT",
  },
  {
    value: "Mexico",
    code: "MX",
  },
  {
    value: "Micronesia",
    code: "FM",
  },
  {
    value: "Moldova",
    code: "MD",
  },
  {
    value: "Monaco",
    code: "MC",
  },
  {
    value: "Mongolia",
    code: "MN",
  },
  {
    value: "Montenegro",
    code: "ME",
  },
  {
    value: "Montserrat",
    code: "MS",
  },
  {
    value: "Morocco",
    code: "MA",
  },
  {
    value: "Mozambique",
    code: "MZ",
  },
  {
    value: "Myanmar",
    code: "MM",
  },
  {
    value: "Namibia",
    code: "NA",
  },
  {
    value: "Nauru",
    code: "NR",
  },
  {
    value: "Nepal",
    code: "NP",
  },
  {
    value: "Netherlands",
    code: "NL",
  },
  {
    value: "New Caledonia",
    code: "NC",
  },
  {
    value: "New Zealand",
    code: "NZ",
  },
  {
    value: "Nicaragua",
    code: "NI",
  },
  {
    value: "Niger",
    code: "NE",
  },
  {
    value: "Nigeria",
    code: "NG",
  },
  {
    value: "Niue",
    code: "NU",
  },
  {
    value: "Norfolk Island",
    code: "NF",
  },
  {
    value: "North Korea",
    code: "KP",
  },
  {
    value: "North Macedonia",
    code: "MK",
  },
  {
    value: "Northern Mariana Islands",
    code: "MP",
  },
  {
    value: "Norway",
    code: "NO",
  },
  {
    value: "Oman",
    code: "OM",
  },
  {
    value: "Pakistan",
    code: "PK",
  },
  {
    value: "Palau",
    code: "PW",
  },
  {
    value: "Palestine",
    code: "PS",
  },
  {
    value: "Panama",
    code: "PA",
  },
  {
    value: "Papua New Guinea",
    code: "PG",
  },
  {
    value: "Paraguay",
    code: "PY",
  },
  {
    value: "Peru",
    code: "PE",
  },
  {
    value: "Philippines",
    code: "PH",
  },
  {
    value: "Pitcairn Islands",
    code: "PN",
  },
  {
    value: "Poland",
    code: "PL",
  },
  {
    value: "Portugal",
    code: "PT",
  },
  {
    value: "Puerto Rico",
    code: "PR",
  },
  {
    value: "Qatar",
    code: "QA",
  },
  {
    value: "Republic of the Congo",
    code: "CG",
  },
  {
    value: "Réunion",
    code: "RE",
  },
  {
    value: "Romania",
    code: "RO",
  },
  {
    value: "Russia",
    code: "RU",
  },
  {
    value: "Rwanda",
    code: "RW",
  },
  {
    value: "Saint Barthélemy",
    code: "BL",
  },
  {
    value: "Saint Helena, Ascension and Tristan da Cunha",
    code: "SH",
  },
  {
    value: "Saint Kitts and Nevis",
    code: "KN",
  },
  {
    value: "Saint Lucia",
    code: "LC",
  },
  {
    value: "Saint Martin",
    code: "MF",
  },
  {
    value: "Saint Pierre and Miquelon",
    code: "PM",
  },
  {
    value: "Saint Vincent and the Grenadines",
    code: "VC",
  },
  {
    value: "Samoa",
    code: "WS",
  },
  {
    value: "San Marino",
    code: "SM",
  },
  {
    value: "São Tomé and Príncipe",
    code: "ST",
  },
  {
    value: "Saudi Arabia",
    code: "SA",
  },
  {
    value: "Senegal",
    code: "SN",
  },
  {
    value: "Serbia",
    code: "RS",
  },
  {
    value: "Seychelles",
    code: "SC",
  },
  {
    value: "Sierra Leone",
    code: "SL",
  },
  {
    value: "Singapore",
    code: "SG",
  },
  {
    value: "Sint Maarten",
    code: "SX",
  },
  {
    value: "Slovakia",
    code: "SK",
  },
  {
    value: "Slovenia",
    code: "SI",
  },
  {
    value: "Solomon Islands",
    code: "SB",
  },
  {
    value: "Somalia",
    code: "SO",
  },
  {
    value: "South Africa",
    code: "ZA",
  },
  {
    value: "South Georgia",
    code: "GS",
  },
  {
    value: "South Korea",
    code: "KR",
  },
  {
    value: "South Sudan",
    code: "SS",
  },
  {
    value: "Spain",
    code: "ES",
  },
  {
    value: "Sri Lanka",
    code: "LK",
  },
  {
    value: "Sudan",
    code: "SD",
  },
  {
    value: "Suriname",
    code: "SR",
  },
  {
    value: "Svalbard and Jan Mayen",
    code: "SJ",
  },
  {
    value: "Sweden",
    code: "SE",
  },
  {
    value: "Switzerland",
    code: "CH",
  },
  {
    value: "Syria",
    code: "SY",
  },
  {
    value: "Taiwan",
    code: "TW",
  },
  {
    value: "Tajikistan",
    code: "TJ",
  },
  {
    value: "Tanzania",
    code: "TZ",
  },
  {
    value: "Thailand",
    code: "TH",
  },
  {
    value: "Timor-Leste",
    code: "TL",
  },
  {
    value: "Togo",
    code: "TG",
  },
  {
    value: "Tokelau",
    code: "TK",
  },
  {
    value: "Tonga",
    code: "TO",
  },
  {
    value: "Trinidad and Tobago",
    code: "TT",
  },
  {
    value: "Tunisia",
    code: "TN",
  },
  {
    value: "Turkey",
    code: "TR",
  },
  {
    value: "Turkmenistan",
    code: "TM",
  },
  {
    value: "Turks and Caicos Islands",
    code: "TC",
  },
  {
    value: "Tuvalu",
    code: "TV",
  },
  {
    value: "Uganda",
    code: "UG",
  },
  {
    value: "Ukraine",
    code: "UA",
  },
  {
    value: "United Arab Emirates",
    code: "AE",
  },
  {
    value: "United Kingdom",
    code: "GB",
  },
  {
    value: "United States",
    code: "US",
  },
  {
    value: "United States Minor Outlying Islands",
    code: "UM",
  },
  {
    value: "United States Virgin Islands",
    code: "VI",
  },
  {
    value: "Uruguay",
    code: "UY",
  },
  {
    value: "Uzbekistan",
    code: "UZ",
  },
  {
    value: "Vanuatu",
    code: "VU",
  },
  {
    value: "Vatican City",
    code: "VA",
  },
  {
    value: "Venezuela",
    code: "VE",
  },
  {
    value: "Vietnam",
    code: "VN",
  },
  {
    value: "Wallis and Futuna",
    code: "WF",
  },
  {
    value: "Western Sahara",
    code: "EH",
  },
  {
    value: "Yemen",
    code: "YE",
  },
  {
    value: "Zambia",
    code: "ZM",
  },
  {
    value: "Zimbabwe",
    code: "ZW",
  },
];

interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Suspended";
  lastLogin: string;
  joinedDate: string;
}

export const admins: Admin[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    lastLogin: "2024-03-20 14:30",
    joinedDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Suspended",
    lastLogin: "2024-03-18 09:15",
    joinedDate: "2024-02-01",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    lastLogin: "2024-03-20 16:45",
    joinedDate: "2024-01-20",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "Active",
    lastLogin: "2024-03-20 11:20",
    joinedDate: "2024-03-01",
  },
];

interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

export const adminActivityLogs: ActivityLog[] = [
  {
    id: "1",
    adminName: "Sarah Johnson",
    action: "Product Updated",
    details: "Updated product 'Wireless Headphones' pricing",
    timestamp: "2024-03-20 14:30",
    status: "success",
  },
  {
    id: "2",
    adminName: "Emily Rodriguez",
    action: "Order Status Changed",
    details: "Changed order #ORD-001 status to 'Shipped'",
    timestamp: "2024-03-20 16:45",
    status: "success",
  },
  {
    id: "3",
    adminName: "David Kim",
    action: "Customer Deleted",
    details: "Deleted customer account for inactive user",
    timestamp: "2024-03-20 11:20",
    status: "error",
  },
  {
    id: "4",
    adminName: "Sarah Johnson",
    action: "Settings Updated",
    details: "Updated store currency settings",
    timestamp: "2024-03-20 10:15",
    status: "warning",
  },
  {
    id: "5",
    adminName: "Emily Rodriguez",
    action: "Category Created",
    details: "Created new category 'Smart Home'",
    timestamp: "2024-03-20 09:30",
    status: "success",
  },
];

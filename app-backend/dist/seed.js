"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const book_1 = __importDefault(require("./models/book"));
const bcrypt = require("bcrypt");
const date_joined = new Date();
const defaultPass = "Pass@123";
const uri = "mongodb://localhost:27017/abc"; //! Should be placed in environment variables
function getRandomInt() {
    return Math.floor(Math.random() * 5) || 1;
}
let users = [
    {
        name: "Jerel Brekke",
        email: "fredy75@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Ida Walter",
        email: "josefina.beatty@hintz.com",
        date_joined,
        password: "",
    },
    {
        name: "Gwen Pfeffer",
        email: "xspencer@goyette.com",
        date_joined,
        password: "",
    },
    {
        name: "Brent Smitham",
        email: "feeney.billy@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Steve Klein",
        email: "zgoyette@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Mr. Garrison Hartmann DDS",
        email: "earl.gaylord@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Elise Ward",
        email: "eloy.smitham@hirthe.org",
        date_joined,
        password: "",
    },
    {
        name: "Crystal Hermiston",
        email: "sarina24@yahoo.com",
        date_joined,
        password: "",
    },
    {
        name: "Miss Syble Bernhard",
        email: "sadye81@kemmer.com",
        date_joined,
        password: "",
    },
    {
        name: "Merritt Vandervort",
        email: "amie.bailey@medhurst.net",
        date_joined,
        password: "",
    },
    {
        name: "Mr. Jan Davis IV",
        email: "ciara.haag@yahoo.com",
        date_joined,
        password: "",
    },
    {
        name: "Anna Mosciski",
        email: "ipacocha@goodwin.com",
        date_joined,
        password: "",
    },
    {
        name: "Mr. Roger Wiegand V",
        email: "unitzsche@gutmann.info",
        date_joined,
        password: "",
    },
    {
        name: "Alene Kiehn MD",
        email: "tyson.donnelly@prosacco.com",
        date_joined,
        password: "",
    },
    {
        name: "Anastacio Cole",
        email: "morgan25@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Genevieve Murazik",
        email: "art72@ondricka.com",
        date_joined,
        password: "",
    },
    {
        name: "Dr. Myriam Runolfsdottir II",
        email: "haley.ahmed@turcotte.info",
        date_joined,
        password: "",
    },
    {
        name: "Prof. Verona Rempel Jr.",
        email: "lmcdermott@yahoo.com",
        date_joined,
        password: "",
    },
    {
        name: "Ms. Stephany Ritchie III",
        email: "zachery.bednar@ernser.com",
        date_joined,
        password: "",
    },
    {
        name: "Danielle Bahringer",
        email: "bartoletti.adrain@gmail.com",
        date_joined,
        password: "",
    },
    {
        name: "Administrator",
        email: "admin@abc.com",
        date_joined,
        password: "",
        role: "admin",
    },
    {
        name: "Editor",
        email: "editor@abc.com",
        date_joined,
        password: "",
        role: "editor",
    },
];
let books = [
    {
        title: "LESSONS IN CHEMISTRY",
        description: "A scientist and single mother living in California in the 1960s becomes a star on a TV cooking show.",
        author: "Bonnie Garmus",
        genre: "romance",
        year_published: "2023-01-01",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "THE BOYS FROM BILOXI",
        description: "Two childhood friends follow in their fathers’ footsteps, which puts them on opposite sides of the law.",
        author: "John Grisham",
        genre: "thriller",
        year_published: "2023-01-01",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "FAIRY TALE",
        description: "A high school kid inherits a shed that is a portal to another world where good and evil are at war.",
        author: "Stephen King",
        genre: "horror",
        year_published: "2023-01-01",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "THE MIDNIGHT LIBRARY",
        description: "Nora Seed finds a library beyond the edge of the universe that contains books with multiple possibilities of the lives one could have lived.",
        author: "Matt Haig",
        genre: "science_fiction",
        year_published: "2023-01-01",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "HOUSE OF SKY AND BREATH",
        description: "The second book in the Crescent City series. Bryce Quinlan and Hunt Athalar must choose to fight or stay silent.",
        author: "Sarah J. Maas",
        genre: "romance",
        year_published: "2022-03-06",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "THE MAID",
        description: "When a wealthy man is found dead in his room, a maid at the Regency Grand Hotel becomes a lead suspect.",
        author: "Nita Prose",
        genre: "thriller",
        year_published: "2022-02-06",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "THE LINCOLN HIGHWAY",
        description: "Two friends who escaped from a juvenile work farm take Emmett Watson on an unexpected journey to New York City in 1954.",
        author: "Amor Towles",
        genre: "history",
        year_published: "2022-02-06",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "GO TELL THE BEES THAT I AM GONE",
        description: "The ninth book in the Outlander series. As the Revolutionary War moves closer to Fraser’s Ridge, Claire and Jamie reunite with their daughter and her family.",
        author: "Diana Gabaldon",
        genre: "history",
        year_published: "2022-02-06",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "THE JUDGE'S LIST",
        description: "The second book in the Whistler series. Investigator Lacy Stoltz goes after a serial killer and closes in on a sitting judge.",
        author: "John Grisham",
        genre: "thriller",
        year_published: "2021-12-05",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
    {
        title: "TOM CLANCY: CHAIN OF COMMAND",
        description: "The 21st book in the Jack Ryan series. A shadowy billionaire plans to kidnap the first lady to get President Jack Ryan out of his way.",
        author: "Marc Cameron",
        genre: "action_and_adventure",
        year_published: "2021-12-05",
        borrowing_availability_status: true,
        quantity: getRandomInt(),
    },
];
mongoose_1.default.connect(uri).then(() => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcrypt.hash(defaultPass, 12);
    users.map((u) => (u.password = hash));
    user_1.default.insertMany(users)
        .then(() => {
        console.log("Successfully added users!");
    })
        .catch((e) => {
        console.log(e);
    });
    book_1.default.insertMany(books)
        .then(() => {
        console.log("Successfully added books!");
    })
        .catch((e) => {
        console.log(e);
    });
}));

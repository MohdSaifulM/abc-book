import mongoose from "mongoose";
import User from "./models/user";
const bcrypt = require('bcrypt');

const date_joined = new Date();

const defaultPass = 'Pass@123';

const uri = 'mongodb://localhost:27017/abc';    //! Should be placed in environment variables

let users = [
  { name: "Jerel Brekke", email: "fredy75@gmail.com", date_joined, password: '' },
  { name: "Ida Walter", email: "josefina.beatty@hintz.com", date_joined, password: '' },
  { name: "Gwen Pfeffer", email: "xspencer@goyette.com", date_joined, password: '' },
  { name: "Brent Smitham", email: "feeney.billy@gmail.com", date_joined, password: '' },
  { name: "Steve Klein", email: "zgoyette@gmail.com", date_joined, password: '' },
  { name: "Mr. Garrison Hartmann DDS", email: "earl.gaylord@gmail.com", date_joined, password: '' },
  { name: "Elise Ward", email: "eloy.smitham@hirthe.org", date_joined, password: '' },
  { name: "Crystal Hermiston", email: "sarina24@yahoo.com", date_joined, password: '' },
  { name: "Miss Syble Bernhard", email: "sadye81@kemmer.com", date_joined, password: '' },
  { name: "Merritt Vandervort", email: "amie.bailey@medhurst.net", date_joined, password: '' },
  { name: "Mr. Jan Davis IV", email: "ciara.haag@yahoo.com", date_joined, password: '' },
  { name: "Anna Mosciski", email: "ipacocha@goodwin.com", date_joined, password: '' },
  { name: "Mr. Roger Wiegand V", email: "unitzsche@gutmann.info", date_joined, password: '' },
  { name: "Alene Kiehn MD", email: "tyson.donnelly@prosacco.com", date_joined, password: '' },
  { name: "Anastacio Cole", email: "morgan25@gmail.com", date_joined, password: '' },
  { name: "Genevieve Murazik", email: "art72@ondricka.com", date_joined, password: '' },
  { name: "Dr. Myriam Runolfsdottir II", email: "haley.ahmed@turcotte.info", date_joined, password: '' },
  { name: "Prof. Verona Rempel Jr.", email: "lmcdermott@yahoo.com", date_joined, password: '' },
  { name: "Ms. Stephany Ritchie III", email: "zachery.bednar@ernser.com", date_joined, password: '' },
  { name: "Danielle Bahringer", email: "bartoletti.adrain@gmail.com", date_joined, password: '' },
  { name: "Administrator", email: "admin@abc.com", date_joined, password: '', role: 'admin' },
  { name: "Editor", email: "editor@abc.com", date_joined, password: '', role: 'editor' }
];

mongoose.connect(uri).then(async () => {
    const hash = await bcrypt.hash(defaultPass, 12)
    users.map(u => u.password = hash);
    User.insertMany(users).then(() => {
        console.log("Successfully added users!");
    })
    .catch((e) => {
        console.log(e);
    });
})



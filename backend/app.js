const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();

// Подключаем middleware
app.use(express.json({ extended: true }));
app.use('/api/auth/', require("./routes/auth.route"));
app.use('/api/user/', require("./routes/user.route"));
app.use('/api/location/', require("./routes/location.route"));
app.use(cors());

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(process.env.PORT, process.env.IP, () => {
      console.log(`Server started on port http://${process.env.IP}:${process.env.PORT}`)
    });
  } catch (e) {
    console.log(e);
  }
}

start();
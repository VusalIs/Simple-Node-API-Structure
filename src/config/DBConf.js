const mongoose = require('mongoose');

const dbConf = async () => {
    await mongoose
        .connect(process.env.MONGO_ATLAS_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        })
        .then(() => console.log(`MongoDB connected: ${mongoose.connection.host}`))
        .catch(err => {
            console.log(`MongoDB connection failed: ${err}`);
            process.exit(1);
        });
};

module.exports = dbConf;

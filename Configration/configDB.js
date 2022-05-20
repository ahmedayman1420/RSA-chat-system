/* ====================== /// <==> Variables Declaration <==> /// ====================== */
const mongoose = require('mongoose');

/* ====================== /// <==> Variables Declaration <==> /// ====================== */
const Connection = async() => {
    await mongoose.connect(`${process.env.CONNECTION_STRING_LOCAL}`, {}).then(
        (result) => { console.log('Node Connected With Mongo BD'); }).catch(
        (error) => { console.log('Error In Database Connection'); }
    );
};

/* ====================== /// <==> Export Connection Function <==> /// ====================== */
module.exports = Connection;
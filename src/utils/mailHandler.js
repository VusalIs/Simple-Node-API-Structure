const nodemailer = require('nodemailer');

exports.sendMail = ({ mailTo, mailType, options }) => {
    try {
        const mailOptions = setOptions(mailTo, mailType, options);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
        throw new ErrorResponse('Error occured while sending email :(', 500);
    }
};

const setOptions = (mailTo, mailType, options) => {
    const result = {
        from: `"Example" ${process.env.EMAIL}`,
        to: mailTo,
    };

    switch (mailType) {
        case 'REGISTRATION':
            result.subject = `Welcome ${options.username}!`;
            result.html = `
        Welcome to my site
        `;
            break;
    }

    return result;
};

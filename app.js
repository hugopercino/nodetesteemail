const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view engine setup
app.engine('handlebars', exphbs({
    extname: "handlebars",
    //defaultLayout: "main-layout",
    layoutsDir: "views/"
}));



app.set("view engine", "handlebars");


app.use("/public",express.static(path.join(__dirname, "public")));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.render('contact', {
        layout: false
    });
});
// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
    <p>Você foi contatado através do site</p>
    <h3>Detalhes</h3>
    <ul>  
      <li>Nome: ${req.body.name}</li>
      <li>Empresa: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Telefone: ${req.body.phone}</li>
    </ul>
    <h3>Mensagem</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'perbatista9@gmail.com', // generated ethereal user
        pass: '26hp1992'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'perbatista9@gmail.com', // sender address
      to: 'hugopercinosilva@gmail.com', // list of receivers
      subject: 'Você foi contatado através do site', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent', layout:false});
  });
});

app.listen(3000, () => console.log('Server started...'));
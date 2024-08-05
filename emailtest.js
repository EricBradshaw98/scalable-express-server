const formData = require('form-data');
const Mailgun = require('mailgun-js');
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: 'api', 
  apiKey: process.env.MAILGUN_API_KEY
});

const domain = 'sandbox4e722a41b9ee47169dc332aaaf84e31d.mailgun.org'; // Replace this with your actual Mailgun domain

mg.messages.create(domain, {
  from: "Excited User <mailgun@" + domain + ">",
  to: ["test@example.com"],
  subject: "Hello",
  text: "Testing some Mailgun awesomeness!",
  html: "<h1>Testing some Mailgun awesomeness!</h1>"
})
.then(msg => console.log(msg)) // logs response data
.catch(err => console.log(err)); // logs any error
const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer');
const { request } = require('express');

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.json("Estou funcionando!")
})

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
})

app.listen(port, () => {
    console.log(`Abrindo na porta: ${port}`)
})

const dialogflowFulfillment = (request, response) => {
    const agent = new WebhookClient({ request, response })

    function envio_email(agent){
        var nodemailer = require('nodemailer');
        var transporte = nodemailer.createTransport({
            service: 'Outlook', //servidor a ser usado
            auth: {
                user: "dorinhateste123@hotmail.com", // dizer qual o usuário
                pass: "Aqua1313" // senha da conta
            }
        });

        var email = {
            from:"dorinhateste123@hotmail.com", // Quem enviou este e-mail
            to: request.body.queryResult.parameters['email'], // Quem receberá
            subject: request.body.queryResult.parameters['assunto'], // Um assunto
            html: request.body.queryResult.parameters['mensagem'] // O conteúdo do e-mail
        };

        transporte.sendMail(email, function(error, info){
            if(error){
                console.log (error);
                throw error; // algo de errado aconteceu.
            }
            agent.add('Email enviado! Leia as informações adicionais: '+ info);
        });
    
    }
    let intentMap = new Map();
    intentMap.set("envio_email", envio_email)
    agent.handleRequest(intentMap)
}

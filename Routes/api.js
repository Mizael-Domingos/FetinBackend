require("dotenv").config();
const express = require('express');
const router = express.Router();
const Chronos = require('./../Utils/Chronos');
const utils = require('./../Utils/utils');
const Paciente = require('../models/Paciente');

//Função para registrar o paciente
router.post("/registrarPaciente", async(req, res)=> {
   
    const users = await Paciente.findAll({
        where: {
          email: req.body.email
         }
        }); 
        
    if(Object.keys(users).length > 0) {
        return res.status(400).json({
                erro: true,
                mensagem: "Erro: Email já cadastrado!"
            })
        }

    if(!Chronos.isFree(req.body.email))
    {
        return res.status(400).json({
            erro: true,
            mensagem: `Erro: Já enviamos o email de confirmação para o endereço ${req.body.email}.`
        })
    }
    
    var uuid = Chronos.checkEmail(req.body.email, req.body);
    utils.sendEmail(
        req.body.email,
        `<div style="padding: 5px; background-color: rgb(231, 231, 231); margin: 0px;">

        <div style="padding-left: 20px;">
        <h1 style="text-align: center; background-color: rgb(0, 128, 96); padding-top: 10px; padding-bottom: 10px;">Cadastro na Calorie Counter</h1></br>
            <p>Você iniciou o cadastro na Calorie Counter, para terminar, <a href="http://localhost:${process.env.PORT}/site/registro/${uuid}">clique aqui</a>.</p>
            <p>Obrigada pela preferência!</p></br></br>
        </div>
            
        </div>`,
        "Confirme seu cadastro."
    )

    return res.json({
        erro: false,
        mensagem: "Vá para o email!"
    })

    /*await Paciente.create(req.body) //aqui
    .then(()=> {
        return res.json({
            erro: false,
            mensagem: "Paciente cadastrado com sucesso!"
        })

    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Paciente não cadastrado!"
        })

    });*/


});

//Função para calcular IMC 
router.get("/calcularIMC", async(req, res)=> {
    
    const users = await Paciente.findAll({
        attributes: ['peso', 'altura'],
        where: {
          email: req.body.email
         }
        }); 

    if(Object.keys(users).length < 0) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Email não encontrado!"
            })
        }
    const imc = Utils.imc(users[0].dataValues.peso, users[0].dataValues.altura);    
    return res.json({
        imc: imc
    })       
    
});


//Exportando router
module.exports= router;
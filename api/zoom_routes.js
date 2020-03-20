const { Router } = require('express');
const router = Router();
const service = require('../services/zoom_service');
const nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'cabidomatias@gmail.com',
         pass: 'Kon979tracka'
     }
});


  // RETORNA OBJETO CON ID DE SALA DEL USUARIO //
router.get('/get_meeting_live/:id_user', async(req, res) => {
  var salas = [];
  if(service.verificarToken(req.query.tk)){
    await service.getMeetingLive(req.params.id_user,req.query.tk).
    then(result => {
      if(!result.code){
        result.meetings.forEach(element => {
          var meeting = {
            id   : element.id,
          }
          salas.push(meeting);
        });
      res.send(salas);
      }else{
        var error = {
          code : result.code,
          mensaje : 'El usuario no existe'
        }
        res.send(error);
      }
      
    }).catch();
  }else{
    var error = {
      code : 500,
      mensaje : 'Token invalido'
    }
    res.send(error);
  }
});

  // RETORNA ESTADO DE LA SALA //
router.get('/get_meeting/:id', async(req, res) => {
  if(service.verificarToken(req.query.tk)){
    await service.getstatusMeetings(req.params.id,req.query.tk).
    then(response =>{
      if(!response.code){
        var reunion = {
          id  : response.id,
          url : response.join_url,
          status : response.status,
        }
        res.send(reunion);
      }else{
        res.send(response);
      }
        
      }).catch(err => {});

    }else{
      var error = {
        code : 500,
        mensaje : 'Token invalido'
      }
      res.send(error);
    }
  
});

  // ELIMINA LA SALA //
router.get('/delete_meeting/:id', async (req, res) => {
  if(service.verificarToken(token)){
    await service.deleteMeeting(req.params.id,req.query.tk).
    then(result =>{
        var estado = { status : '',code:0 };
        if(!result.code){
          estado.status = 'Sala eliminada';
          estado.code = 200;
        }else{
          estado.code = 500;
          estado.status = 'Id de sala no valida / ya eliminada';
        }
        res.send(estado);

    }).catch();
  }else{
    var error = {
      code : 500,
      mensaje : 'Token invalido'
    }
    res.send(error);
  }
 
});

  // INVIO DE INVITACION A REUNION //
router.get('/invite/:id/:to', async (req, res) => {
  if(service.verificarToken(req.query.tk)){
    await service.getstatusMeetings(req.params.id,req.query.tk).then(response =>{
      transport.sendMail({
        from:response.settings.contact_email, // sender address
        to: req.params.to, // list of receivers
        subject: "Turno de VideoConsulta", // Subject line
        html: `<h3 style="font-weight:600">

        Su sala ya esta disponible, el dr./a ${response.settings.contact_name} lo espera.

        Ingrese dando click al siguiente link => ${response.join_url} </h3>
        
        <p>Recuerde tener bajada la aplicacion de zoom previamente</p>`, 
      }, 
      function (err, info) {
        if(info.rejected.length > 0)
          res.send(false);
        else
          res.send(true);    
      })
    }).catch(err => {});
  }else{
    var error = {
      code : 500,
      mensaje : 'Token invalido'
    }
    res.send(error);
  }
});

  // OBTENER USUARIO //
router.get('/user/:mail', async (req, res) => {  
  token = service.crearToken();
  await service.getUser(token). then(respo =>{
    if(!respo.code){
      respo.data.users.filter(user => {
        if(req.params.mail == user.email){
          usuario = {
            id : user.id,
            nombre : `${user.last_name} ${user.first_name}`,
            token : token
          }
          res.send(usuario);
        }else{
          res.send([]);
        }
      });
    }else{
      var error = {
        code : result.code,
        mensaje : result.message
      }
      res.send(error);
    }
   }).catch();
});


  // RETORNA LA SALA CREADA //
router.get('/:id_user',async (req, res, next)  =>  {
  if(service.verificarToken(req.query.tk)){
    await service.createMeeting(req.params.id_user,req.query.tk).
    then(response =>{
      if(!response.code){
        var new_sala = {
          id        : response.id,
          start_url : response.start_url,
          url       : response.join_url,
          status    : response.status
        }
        res.send(new_sala);
      }else{
        var error = {
          code : response.code,
          mensaje : 'El usuario no existe'
        }
        res.send(error); 
      }
    }).catch(err => {})
  }else{
    var error = {
      code : 500,
      mensaje : 'Token invalido'
    }
    res.send(error);
  }

});




router.get('/error', async (req, res) => { 
});

router.use((error, req, res, next) => {
    if(error) {
        res.sendStatus(500).json(error)
    }
})

router.use((error, req, res, next) => {
  res.sendStatus(404).json("no encontrado")
})

module.exports=router;




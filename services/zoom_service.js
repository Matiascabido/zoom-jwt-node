const axios = require("axios");
const jwt = require('jsonwebtoken');
const {api_key, api_secret, fecha_exp ,settings} = require('config').get('zoom'); 

module.exports = {
  /// FUNCIONES BASICAS ////
  
  // OBTENER USUARIO (Confirma si existe y genera id y token) //
  getUser: async (token) => {
    var result =  await getUser(token).catch();
    return result
  }, 
  // OBTENER SALAS DE ESE USUARIO (Retorna el id de las salas del usuario) // 
  getMeetingLive: async (id_user,token) => {
    var result =  await getMeetingsLive(id_user,token).catch();
     if(!result.code)
       return result.data;
     else
       return result
  },
  // OBTENER STATUS DE LAS SALAS DE ESE USUARIO (Retorna id, url) //
  getstatusMeetings: async (id,token) => {
    var response = await statusMeetings(id,token).catch();
    if(!response.code)
      return response.data;
    else
      return response
  },

  // FIN FUNCION BASICA //

  // MANDAR INVITACION POR MAIL //
  inviteMeetings: async (id,token) =>{
    var response = await inviteMeetings(id,token);
    //console.log( 'respuesta',response.data);
    return response.data;
  },

  // CREAR REUNION //
  createMeeting: async (id_user,token) => {
    var result =  await CreateMeeting(id_user,token).catch();
    if(!result.code)
      return result.data;
    else
      return result;
  },

  // ELIMINA UNA REUNION //
  deleteMeeting: async (id,token) =>{
    var result = await deleteMeeting(id,token).catch();
    if(result.data == ''){
      return true;
    }else{
      return result
    }
    
    
  },


  // FUNCION PARA SEGURIDAD //
    
    // VERIFICAR SI EL TOKEN ES VALIDO //
    verificarToken: (token) => {
      var verificado =  jwt.verify(token, api_secret, function(err, decoded) {
        if (err) {
         // console.log(err)
        }else{
        //  console.log('deco',decoded)
          if(decoded.iss == api_key){
            if(decoded.exp < new Date().getTime()){
            //  console.log(decoded.exp +' < ' +new Date().getTime())
              return false;
            }else{
           //   console.log(decoded.exp +' > ' +new Date().getTime())
              return true;
            }
          }
        } 
      });
      return verificado;
    },

    // CREAR TOKEN //
    crearToken: () => {
      return  jwt.sign({
        "aud": null,
        "iss": api_key,
        "exp": Date.parse(fecha_exp),
        "iat": Date.parse(new Date())
      }, api_secret );
    //  return  jwt.sign({
    //     "aud": null,
    //     "iss": api_key,
    //     "exp": Date.parse(new Date()),
    //     "iat": Date.parse(fecha_exp)
    //   }, api_secret );
    },
    

 // FIN FUNCION PARA SEGURIDAD //


  //NO UTILIZADA ACTUALMENTE
  endMeeting : async (id) =>{
    var response = await endMeeting(id);
    return response;
    
  },

};



  /// FUNCIONES BASICAS //

  // OBTENER USUARIO //
async function getUser(token) {
    var response = await axios.get('https://api.zoom.us/v2/users',{
      page_number: '1', 
      page_size: '30', 
      status: 'active',
      headers: {authorization: 'Bearer ' + token}
    }).catch(err =>  err.response.data);
    return response;

};

  // OBTENER SALAS DEL USUARIO //
async function getMeetingsLive(id_user,token) {
  var response = await axios.get(`https://api.zoom.us/v2/users/${id_user}/meetings`,{
      page_number: '1', 
      page_size: '100', 
      type: 'live',
      headers: {authorization: 'Bearer '+token}
    }).catch(err => err.response.data);
  return response;
}

  // OBTENER ESTADO DE SALA //
async function statusMeetings(id,token) {

  var response =  await axios.get(`https://api.zoom.us/v2/meetings/${id}`,{
     headers: {authorization: 'Bearer '+token}
   }).catch(err => err.response.data);
 
  return response;

}

  /// FIN FUNCION BASICA ///

  // ENVIAR INVITACION A SALA /
async function inviteMeetings(id,token) {
  return response = await axios.get(`https://api.zoom.us/v2/meetings/${id}/invitation`,{
    headers: {authorization: 'Bearer '+token}
  }).catch(err => err.data);

}

 
  // CREAR SALAS //
async function CreateMeeting(id_user,token) {
    var response =  await axios(`https://api.zoom.us/v2/users/${id_user}/meetings`,{
      method: 'post',
      page_number: '1', 
      page_size: '100', 
      data: settings,
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer '+token}
      }).catch(err =>  err.response.data);
    return response;
}

  // ELIMINAR SALA //
async function deleteMeeting(id,token) {

    var response = await axios.delete(`https://api.zoom.us/v2/meetings/${id}`,{
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer '+token
      }
    }).catch(err => err.response.data);

    return response;
   
}
























            //FUNCION PARA CERRAR SALA
 //NO SE UTILIZA ACTUALMENTE PORQUE FINALIZA CUANDO SE CIERRA DESDE ZOOM //
async function endMeeting(id) {
  try {
    return response = await axios.put(`https://api.zoom.us/v2/meetings/${id}/status`,{
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer '+token        
      },
      data: JSON.stringify({action: 'end'})
    }).catch(err => console.log('Error en endMeeting', err.data));
  } catch (error) {
    //console.error(error);
  }; 
}




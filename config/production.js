module.exports = {
    zoom:{
        //REEMPLAZAR POR CUENTA DE PROD
        api_key :'',
        api_secret : '',  
        fecha_exp : new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
        settings : {
            "topic": "Consulta Medica",
            "type": "8",
            "start_time": "2020-03-17T11:00:00Z",
            "duration": "60",
            "timezone": "America/Argentina/Buenos_Aires",
            "password": "",
            "agenda": "Consulta Medica Por Video llamada",
            "recurrence": {
              "type": "1",
              "repeat_interval": "90",
              "weekly_days": "3",
              "monthly_day": "3",
              "monthly_week": "3",
              "monthly_week_day": "3",
              "end_times": "1",
              "end_date_time": "s2020-10-17T11:00:00Z"
            },
            "settings": {
              "host_video": "false",
              "participant_video": "false",
              "cn_meeting": "false",
              "in_meeting": "false",
              "join_before_host": "true",
              "mute_upon_entry": "false",
              "watermark": "false",
              "use_pmi": "false",
              "approval_type": "1",
              "registration_type": "2",
              "audio": "both",
              "auto_recording": "none",
              "enforce_login": "false",
              "enforce_login_domains": "false",
              "registrants_email_notification": "true"
            }
          }
    },
    app:{
        port : 8443
    }
    
}
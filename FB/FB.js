/* Import configuraciones */
const {
    TOKEN_FACEBOOK,
    KEY_FACEBOOK,
} = require('./../config')

/*
 *Esta Clase nos ayuda apoder obtener id , que tipo es , obtener Mensajes ,url y engeneral muchas cosas
 * Se creo para poder Crear Una Herramienta Que faciliten algunas validacion y otras cosas
 * v1 - By arsevys :3
 */

const FBGraph = require("./FBGraph")
const Text = require("./Text")
const Typing = require("./Typing")
const Image = require("./Image")
const QuickReplies = require("./QuickReplies")
const QuickRepliesOption = require("./QuickRepliesOption")
const SendFacebook = require("./SendFacebook")

/**
 * Objeto que permite manejar el flujo de un bot con Facebook
 * @class
 */
class FB {

    /**
     * Llenar datos de REQUEST para ser manejados
     * @constructor
     * @param {Object} req - Datos de REQUEST de la solicitudes HTTP
     */
    constructor(req) {
        this.message = req.entry[0].messaging[0];
        this.responses = []
    }

    /**
     * Validar solucitud de configuracion de FACEBOOK
     * @function
     * @static
     * @param {Object} req - Datos de REQUEST de la solicitudes HTTP
     * @param {Object} res - Datos de RESPONSE de la solicitudes HTTP
     */
    static checkWebhook(req, res){
        if (req.query['hub.mode'] && req.query['hub.verify_token'] === KEY_FACEBOOK) {
            console.log("Enlazado con facebook");
            res.status(200).send(req.query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    }

    /**
     * Obtener ID sender del usuario de facebook
     * @function
     * @returns {String} ID sender del usuario de facebook
     */
    getId(){
        return this.message.sender.id;
    }

    /**
     * Obtener cantidad de mensajes
     * @function
     * @returns {Number} Cantidad de mensajes
     */
    getAmountMessage() { //la cantidad total de un mensaje
        let h = this.message;
        let c = 0;
        if (h.hasOwnProperty("message")) {
            if (h.message.text) {
                c++;
            } else {
                if (this.message.message.attachments) {
                    this.message.message.attachments.filter(function(l) {
                        if (l.type == "image") {
                            c++;
                        }
                        return true;
                    })
                }
            }
        }
        return c;
    }

    /**
     * Obtener un mensaje enviado por el usuario
     * @function
     * @returns {String} Mensaje enviado por el usuario
     */
    getMessage() { // solo funciona cuando envian solo un mensaje
        let h = this.message;
        let msg = null;
        if (h.hasOwnProperty("message")) {
            if (this.message.message.text) {
                msg = this.message.message.text;
            }
        }
        else if (h.hasOwnProperty("postback")){
            console.log(23444,this.message.postback);
            if(this.message.postback.payload){
                msg=this.message.postback.payload;

            }

        }
        return msg;
    }

    /**
     * Tiene mensajes disponibles para manejar
     * @function
     * @returns {Boolean} Es verdadero cuando si tiene mensajes con los cuales trabajar
     */
    hasMessage() { // solo funciona cuando envian solo un mensaje
        let h = this.message;
        let msg = false;
        if (h.hasOwnProperty("message")) {
            if (this.message.message.text) {
                msg = true;
            }
        }
        return msg;
    }

    /**
     * Tiene mensajes del tipo POSTBACK disponibles para manejar
     * @function
     * @returns {Boolean} Es verdadero cuando si tiene mensajes del tipo POSTBACK con los cuales trabajar
     */
    hasPostback() { // solo funciona cuando envian solo un mensaje
        let h = this.message;
        let msg = false;
        if (h.hasOwnProperty("postback")) {
            if (this.message.postback.payload) {
                msg = true;
            }
        }
        return msg;
    }

    /**
     * Obtener una url de una imagen  enviado por el usuario
     * @function
     * @returns {String} Url de una imagen enviado por el usuario
     */
    getImage() { // solo funciona cuando envian solo un mensaje
        let h = this.message;
        let msg = null;
        if (h.hasOwnProperty("message")) {
            if (this.message.message.attachments) {
                if (this.getAmountImages() > 1) {
                    console.log("Advertencia este mensaje tiene mas imagenes usar otro metodo que no sea getImage()");
                    msg = this.message.message.attachments[0].payload.url;
                } else if (this.getAmountImages() == 1) {
                    msg = this.message.message.attachments[0].payload.url;
                }
            }
        }
        return msg;
    }

    /**
     * Tiene mensajes de imagen enviado por el usuario
     * @function
     * @returns {Boolean} Es verdadero cuando si tiene imagenes con los cuales trabajar
     */
    hasImage() { // valida si dentro del mensaje tiene por lo menos una imagen
        let i = false;
        if (this.message.hasOwnProperty("message")) {
            if (this.message.message.attachments) {
                this.message.message.attachments.filter(function(l) {
                    if (l.type == "image") {
                        i = true;
                    }
                    return true;
                })
            }
        }
        return i;
    }

    /**
     * Tiene mensajes de FILE enviado por el usuario
     * @function
     * @returns {Boolean} Es verdadero cuando si tiene FILES con los cuales trabajar
     */
    hasFile() { // valida si dentro del mensaje tiene por lo menos un archivo
        let i = false;
        if (this.message.hasOwnProperty("message")) {
            if (this.message.message.attachments) {
                this.message.message.attachments.filter(function(l) {
                    if (l.type == "file") {
                        i = true;
                    }
                })
            }
        }
        return i;
    }
    
    /**
     * Obtener cantidad de imagenes del mensaje
     * @function
     * @returns {Number} Cantidad de imagenes
     */
    getAmountImages() { // cuantas imagenes tiene en ese mensaje
        let i = 0;
        if (this.message.hasOwnProperty("message")) {
            if (this.message.message.attachments) {
                this.message.message.attachments.filter(function(l) {
                    if (l.type == "image") {
                        i++;
                    }
                })
            }
        }
        return i;
    }

    /**
     * Obtener cantidad de files del mensaje
     * @function
     * @returns {Number} Cantidad de files
     */
    getAmountFiles() { // cuantas imagenes tiene en ese mensaje
        let i = 0;
        if (this.message.hasOwnProperty("message")) {
            if (this.message.message.attachments) {
                this.message.message.attachments.filter(function(l) {
                    if (l.type == "file") {
                        i++;
                    }
                })
            }
        }
        return i;
    }

    /**
     * Obtener Información del usuario
     * @function
     * @returns {Promise} promesa que devolvera la información del usuario
     */
    getInfoUser() {
        let fb_graph = new FBGraph(this.getId(), TOKEN_FACEBOOK)
        return fb_graph.getInfoUser()
    }

    /**
     * Imprimir reporte de mensaje tradato en el momento
     * @function
     */
    showReport() {
        console.log("Id del usuario : " + this.getId());
        console.log("Mensaje de Texto Unico : " + this.getMessage());
        console.log("Total de mensajes : " + this.getAmountMessage());
        console.log("Contiene Imagenes :  " + this.hasImage());
        console.log("Obtener imagen :  " + this.getImage());
        console.log("Cantidad de Imagenes Contenido : " + this.getAmountImages());
        console.log("Contiene Archivos : " + this.hasFile());
        console.log("Cantidad de Archivos Contenido  : " + this.getAmountFiles());
    }

    /**
     * Agregar un elemento de Respuesta
     * @function
     * @param {Object} response - Un objeto de respuesta (Quick Replies, Text, Typing, Image)
     */
    addResponse(response){
        response.setIdUser(this.getId())
        this.responses.push(response)
    }

    /**
     * Remplazar los elementos de Respuesta
     * @function
     * @param {Array|Object} responses - Un Array de objetos de respuesta (Quick Replies, Text, Typing, Image)
     */
    setResponses(responses){
        responses = responses.map(function(response){
            response.setIdUser(this.getId())
            return response
        })
        this.responses = responses
    }

    /**
     * Funcion para enviar todas las respuestas agregadas
     * @function
     * @returns {Promise} Promesa que devolvera el resultado de los mensajes enviados
     */
    sendResponse(){
        let sendFacebook = new SendFacebook(this.responses, TOKEN_FACEBOOK)
        return sendFacebook.send()
    }
     
}

module.exports = {
    FB,
    Text,
    Typing,
    Image,
    QuickReplies,
    QuickRepliesOption
};
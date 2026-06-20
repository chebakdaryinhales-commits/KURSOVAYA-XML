const express = require('express');
const soap = require('soap');
const fs = require('fs');

const app = express();

const myServiceImplementation = {
    MyService: {
        MyPort: {
            GetUserData: function(args, callback) {
                
                const id = args.userId; 
                console.log(`[Сервер] Мой Endpoint вызван! Ищем юзера с ID: ${id}`);

                
                if (id === "42") {
                    callback(null, {
                        name: "Vasya",
                        role: "Clown"
                    });
                } else {
                    callback({
                        Fault: {
                            faultcode: "Client.UserNotFound",
                            faultstring: "Тут нет такого!"
                        }
                    });
                }
            }
        }
    }
};


const wsdlXmlContent = fs.readFileSync('service.wsdl', 'utf8');

const PORT = 8000;
app.listen(PORT, function() {
    soap.listen(app, '/wsdl', myServiceImplementation, wsdlXmlContent, function() {
        console.log(`[Сервер] Отлично, я запустил XML веб-службу!`);
        console.log(`Ссылка на контракт: http://localhost:${PORT}/wsdl?wsdl`);
    });
});

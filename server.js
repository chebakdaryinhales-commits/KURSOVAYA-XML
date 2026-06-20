const express = require('express');
const fs = require('fs'); 
const path = require('path');
const app = express();

app.use(express.text({ type: 'text/xml' }));


app.all('/xml-service', (req, res) => {
    
    if (req.query.wsdl !== undefined) {
        console.log('[Сервер] Кто-то запросил WSDL контракт. Отдаю файл service.wsdl...');
        
        const wsdlPath = path.join(__dirname, 'service.wsdl');
        res.set('Content-Type', 'text/xml');
        return res.sendFile(wsdlPath);
    }

    if (req.method === 'POST') {
        const xmlRequest = req.body || '';
        console.log('\n[Сервер] Получен XML запрос от клиента!');

        const match = xmlRequest.match(/<userId>(.*?)<\/userId>/);
        const userId = match ? match[1] : null;

        console.log(`[Сервер] Из XML извлечен userId: "${userId}"`);

        let xmlResponse = '';

        if (userId === '42') {
            xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
            <soapenv:Envelope xmlns:soapenv="http://xmlsoap.org">
                <soapenv:Body>
                    <GetUserDataResponse xmlns="http://example.com">
                        <name>Ivan Ivanov</name>
                        <role>Administrator</role>
                    </GetUserDataResponse>
                </soapenv:Body>
            </soapenv:Envelope>`;
        } else {
            xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
            <soapenv:Envelope xmlns:soapenv="http://xmlsoap.org">
                <soapenv:Body>
                    <soapenv:Fault>
                        <faultcode>Client.UserNotFound</faultcode>
                        <faultstring>Пользователь с таким ID не найден!</faultstring>
                    </soapenv:Fault>
                </soapenv:Body>
            </soapenv:Envelope>`;
        }

        res.set('Content-Type', 'text/xml');
        return res.send(xmlResponse);
    }

    res.status(405).send('Используйте POST для отправки XML или ?wsdl для просмотра контракта.');
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`[Сервер] XML веб-служба запущена!`);
    console.log(`[Сервер] Контракт доступен тут: http://localhost:${PORT}/xml-service?wsdl`);
    console.log(`====================================================`);
});

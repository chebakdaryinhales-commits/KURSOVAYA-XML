console.log('[Клиент] Запуск приложения...');
console.log('[Клиент] Маршаллинг: собираем строгий XML SOAP-запрос...');

const userIdToSend = '42';

const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://xmlsoap.org">
    <soapenv:Body>
        <GetUserDataRequest xmlns="http://example.com">
            <userId>${userIdToSend}</userId>
        </GetUserDataRequest>
    </soapenv:Body>
</soapenv:Envelope>`;

console.log('[Клиент] Отправляем XML-пакет на Endpoint сервера...');

fetch('http://localhost:8000/xml-service', {
    method: 'POST',
    headers: {
        'Content-Type': 'text/xml' 
    },
    body: soapEnvelope
})
.then(response => response.text()) 
.then(xmlResponse => {
    console.log('[Клиент] Ответ получен! Начинаем десериализацию (парсинг) текста...');

    const nameMatch = xmlResponse.match(/<name>(.*?)<\/name>/);
    const roleMatch = xmlResponse.match(/<role>(.*?)<\/role>/);
    const faultMatch = xmlResponse.match(/<faultstring>(.*?)<\/faultstring>/);


    if (faultMatch) {
        console.error(`\n❌ [Клиент] Сервер вернул ошибку: "${faultMatch[1]}"`);
    } else if (nameMatch && roleMatch) {
        console.log(`\n✅ [Клиент] Успех! Данные из XML успешно извлечены:`);
        console.log(`----------------------------------------`);
        console.log(`ФИО пользователя: ${nameMatch[1]}`);
        console.log(`Роль в системе:   ${roleMatch[1]}`);
        console.log(`----------------------------------------`);
    } else {
        console.log('[Клиент] Неизвестный формат XML-ответа:', xmlResponse);
    }
})
.catch(err => {
    console.error('[Клиент] Ошибка сети (возможно, сервер не запущен):', err.message);
});

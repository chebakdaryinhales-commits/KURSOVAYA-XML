const soap = require('soap');


const wsdlUrl = 'http://localhost:8000/wsdl?wsdl';

console.log('[Клиент] Начинаю подключение к удаленному WSDL...');


soap.createClient(wsdlUrl, function(err, client) {
    if (err) {
        console.error('[Клиент] Ошибка при парсинге WSDL контракта:', err);
        return;
    }


    const requestArgs = { userId: '42' };

    console.log('[Клиент] Контракт прочитан. Вызываю удаленный метод GetUserData...');

    client.MyService.MyPort.GetUserData(requestArgs, function(err, response) {
        if (err) {
            console.error('[Клиент] Сервер вернул ошибку (SOAP Fault):', err);
            return;
        }

        console.log('[Клиент] Успех! Ответ от веб-службы получен:');
        console.log(`ФИО: ${response.name}`);
        console.log(`Статус в системе: ${response.role}`);
    });
});

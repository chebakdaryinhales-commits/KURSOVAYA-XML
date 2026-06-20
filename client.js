const soap = require('soap');

const wsdlUrl = 'http://localhost:8000/wsdl?wsdl';

console.log('[Клиент] Начинаю подключение к удаленному WSDL...');

soap.createClient(wsdlUrl, function(err, client) {
    if (err) {
        console.error('[Клиент] Ошибка при парсинге WSDL контракта:', err);
        return;
    }

    console.log('[Клиент] Контракт прочитан. Вызываю удаленный метод GetUserData...');


    const requestArgs = { userId: '42' };


    const handleResponse = function(err, response) {
        if (err) {
            console.error('[Клиент] Сервер вернул ошибку (SOAP Fault):', err);
            return;
        }
        console.log('[Клиент] Успех! Ответ от веб-службы получен:');
        console.log(`ФИО: ${response.name}`);
        console.log(`Статус в системе: ${response.role}`);
    };

    
    if (typeof client.GetUserData === 'function') {
        
        client.GetUserData(requestArgs, handleResponse);
    } else if (client.MyService && client.MyService.MyPort && typeof client.MyService.MyPort.GetUserData === 'function') {
        
        client.MyService.MyPort.GetUserData(requestArgs, handleResponse);
    } else {
        let methodFound = false;
        for (let serviceKey in client) {
            if (client[serviceKey] && typeof client[serviceKey] === 'object') {
                for (let portKey in client[serviceKey]) {
                    if (client[serviceKey][portKey] && typeof client[serviceKey][portKey].GetUserData === 'function') {
                        client[serviceKey][portKey].GetUserData(requestArgs, handleResponse);
                        methodFound = true;
                        break;
                    }
                }
            }
            if (methodFound) break;
        }


        if (!methodFound) {
            console.error('[Клиент] КРИТИЧЕСКАЯ ОШИБКА: Метод GetUserData не найден в структуре WSDL!');
            console.log('[Клиент] Вот доступная структура твоего WSDL:', Object.keys(client.describe()));
        }
    }
});

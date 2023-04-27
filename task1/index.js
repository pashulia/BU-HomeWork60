const ethers = require('ethers');

async function main() {
    let provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

    let list = await provider.listAccounts();
    let signer = provider.getSigner(list[0]);
    console.log("sig: ", signer);

    let privateKey = "0xf2e95bff7d599a25575ec89861e1e5855bdbaac354aa201e560f2f3489733401";
    let wallet = new ethers.Wallet(privateKey);

    // let txRequest = {
    //     to: list[1],
    //     value: 100
    // };

    // let txResponce = await signer.sendTransaction(txRequest);
    // await txResponce.wait();

    const hashTx = await provider.getTransaction("0xb7dc3fc9efc4f238e043bcf6c5a0a324bd05a90db04dc5b6d883eb909503db3a");
    // console.log(hashTx);

    // Получение подписи из транзакции
    // Получение объекта, содержащего v r s
    let expandedSig = {
        r: hashTx.r,
        s: hashTx.s,
        v: hashTx.v 
    };
    // Возвращает целую подпись из vrs
    let signature = ethers.utils.joinSignature(expandedSig);
    console.log(signature);

    const txRequest = {
        gasPrice: hashTx.gasPrice,
        gasLimit: hashTx.gasLimit,
        value: hashTx.value,
        nonce: hashTx.nonce,
        data: hashTx.data,
        to: hashTx.to
    }; 
    // Заполнение недостающих полей из параметров сети
    let rsTx = await ethers.utils.resolveProperties(txRequest); 
    console.log(rsTx);
    // Вычисление сериализованной raw-транзакции
    let raw = ethers.utils.serializeTransaction(rsTx); 
    console.log(raw);

    // Парсинг транзакции из raw-транзакции
    let txRaw = ethers.utils.parseTransaction(raw);
    console.log(txRaw);

    // рассчитываем хеш сообщения
    let msgHash = ethers.utils.hashMessage(raw); 
    console.log(msgHash);
    // преобразовываем его в байт-массив
    let digest = ethers.utils.arrayify(msgHash);
    // восстанавливаем публичный ключ
    let recPubKey = ethers.utils.recoverPublicKey(msgHash, signature); 
    console.log(recPubKey);
    // восстанавливаем адрес
    let recAddress = ethers.utils.recoverAddress(digest, signature); 
    console.log(recAddress);
}

main();
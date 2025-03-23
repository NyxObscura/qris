function removeLastFourDigits(qris) {
    return qris.slice(0, -4);
}

function ConvertCRC16(str) {
    let crc = 0xffff;
    let strlen = str.length;
    for (let c = 0; c < strlen; c++) {
        crc ^= str.charCodeAt(c) << 8;
        for (let i = 0; i < 8; i++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    let hex = crc & 0xffff;
    hex = hex.toString(16).toUpperCase();
    if (hex.length == 3) hex = "0" + hex;
    return hex;
}

function checkSum(newQris) {
    return newQris + ConvertCRC16(newQris);
}

function initNewQris(dataQrisOriginal, arrayMerchantBaru) {
    let newQris = dataQrisOriginal;
    dataQrisOriginal = removeLastFourDigits(dataQrisOriginal);

    const qrisPart = (dataQrisOriginal) => {
        return dataQrisOriginal.substring(0, dataQrisOriginal.length - 43);
    };

    const merchantName = (merchantName) => {
        let merchantNameLength = merchantName.length;
        if (merchantNameLength < 9) merchantNameLength = "0" + merchantNameLength;
        return "59" + merchantNameLength + merchantName;
    };

    const merchantCity = (merchantCity) => {
        let merchantCityLength = merchantCity.length;
        if (merchantCityLength < 9) merchantCityLength = "0" + merchantCityLength;
        return "60" + merchantCityLength + merchantCity;
    };

    const merchantPostalCode = (merchantPostalCode) => {
        let merchantPostalCodeLength = merchantPostalCode.length;
        if (merchantPostalCodeLength < 9) merchantPostalCodeLength = "0" + merchantPostalCodeLength;
        return "61" + merchantPostalCodeLength + merchantPostalCode;
    };

    newQris =
        qrisPart(dataQrisOriginal) +
        merchantName(arrayMerchantBaru[0]) +
        merchantCity(arrayMerchantBaru[1]) +
        merchantPostalCode(arrayMerchantBaru[2]) +
        "6304";

    return checkSum(newQris);
}

document.addEventListener("DOMContentLoaded", function () {
    const generateQRCodeBtn = document.getElementById("generate-qrcode-btn");
    const qrCodeContainer = document.getElementById("qrcode-container");

    generateQRCodeBtn.addEventListener("click", function () {
        const merchantName = document.getElementById("merchant-name").value;
        const merchantCity = document.getElementById("merchant-city").value;
        const postalCode = document.getElementById("postal-code").value;

        const arrayMerchantBaru = [merchantName, merchantCity, postalCode];

        let dataQrisOriginal =
            "00020101021126610014COM.GO-JEK.WWW01189360091436543333030210G6543333030303UMI51440014ID.CO.QRIS.WWW0215ID10243549664660303UMI5204593553033605802ID5917AV Plastik, MJWRN6007JOMBANG61056147562070703A016304CACB";

        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${initNewQris(
            dataQrisOriginal,
            arrayMerchantBaru
        )}&chs=300x300`;

        qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`;
    });
});

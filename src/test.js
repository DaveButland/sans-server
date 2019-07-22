const AWS = require('aws-sdk') ;
const config = require('./config') ;
const cookies = require('./cookies') ;

AWS.config.update({
	region: config.region
});

const s3 = new AWS.S3({signatureVersion: 'v4', signatureCache: false, accessKeyId: config.keys.accessKeyId, secretAccessKey: config.keys.secretAccessKey});

const images = [ {"size":13527298,"imageId":"92a85796-21ef-4d22-8f70-b005fd0adcee","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103265,"name":"Quyen023.jpg","type":"image/jpeg"}
							 , {"size":10482462,"imageId":"416709d5-b6ae-4702-bfbb-e0b7bfa6e7d6","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103184,"name":"Quyen out-73.jpg","type":"image/jpeg"}
							 , {"size":7740191,"imageId":"7cae46fc-a595-4340-a7e4-9cb95001629a","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103277,"name":"Quyen out-100.jpg","type":"image/jpeg"}
							 , {"size":9780022,"imageId":"c4e4f3a0-bb9a-439f-8392-cfc3e8c50664","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103188,"name":"Quyen out-22.jpg","type":"image/jpeg"}
							 , {"size":10661959,"imageId":"2f7027fb-d67c-4b69-a49c-35d11c3247d0","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103214,"name":"Quyen out-18.jpg","type":"image/jpeg"}
							 , {"size":7898604,"imageId":"5fda849c-10c5-4dfe-b71d-7f425495008c","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103240,"name":"Quyen005.jpg","type":"image/jpeg"}
							 , {"size":8835326,"imageId":"d911631f-0f6b-4809-b062-1fce2f56673a","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103225,"name":"Quyen119.jpg","type":"image/jpeg"}
							 , {"size":6012990,"imageId":"89d3c633-d70a-4ef7-861b-a5991b2b0321","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103228,"name":"Quyen093.jpg","type":"image/jpeg"}
							 , {"size":7880761,"imageId":"8456f25f-440f-4257-a5e8-ceef3bcc61fe","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103192,"name":"Quyen out-1.jpg","type":"image/jpeg"}
							 , {"size":7460492,"imageId":"f39ca84d-41f4-498a-899e-63d6679011e3","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103302,"name":"Quyen064.jpg","type":"image/jpeg"}
							 , {"size":10724813,"imageId":"07b63823-9ff6-4ccb-8593-244207e65179","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103312,"name":"Quyen087.jpg","type":"image/jpeg"}
							 , {"size":7974130,"imageId":"27e9435f-1621-4092-a04c-dbf8254e9d68","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103298,"name":"Quyen039.jpg","type":"image/jpeg"}
							 , {"size":9625537,"imageId":"d6c3c236-d637-4295-ae1b-eb11094e399f","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103201,"name":"Quyen out-68.jpg","type":"image/jpeg"}
							 , {"size":8225300,"imageId":"dee2f71c-d3b2-42b0-aba1-a8bb9b36cab2","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103267,"name":"Quyen050.jpg","type":"image/jpeg"}
							 , {"size":8660880,"imageId":"cb5535f5-1e7b-4c1f-947c-e78d7cace958","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103261,"name":"Quyen127.jpg","type":"image/jpeg"}
							 , {"size":7981912,"imageId":"637a21ef-96a0-43cf-be40-c9c3e3a5df80","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103218,"name":"Quyen086.jpg","type":"image/jpeg"}
							 , {"size":10748754,"imageId":"eab9ab72-000e-4195-afa1-297924dcde3f","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103366,"name":"Quyen070.jpg","type":"image/jpeg"}
							 , {"size":10503735,"imageId":"8bf64d56-f69f-4a6e-810b-b2bf319ef80e","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103264,"name":"Quyen033.jpg","type":"image/jpeg"}
							 , {"size":9979484,"imageId":"73ba7964-0d95-43b7-ac32-81903ac9f393","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103224,"name":"Quyen out-81.jpg","type":"image/jpeg"}
							 , {"size":8205645,"imageId":"b7723e8e-a788-41de-8ad3-2974ae0f6233","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103256,"name":"Quyen out-55.jpg","type":"image/jpeg"}
							 , {"size":11410907,"imageId":"a6a1752e-0a54-445d-91ce-1dbb737161e5","userId":"da508140-a652-4230-beea-c36f20cb6132","folderId":"711dccb3-75e1-4331-a2f6-0d5b79161e55","createdAt":1562231103211,"name":"Quyen out-50.jpg","type":"image/jpeg"}
							 ]

cookies.getImageCookies( images, "d3ml0ura1sl5yw.cloudfront.net", function( error, cookie ) {
	console.log( cookie ) ;
}) ;
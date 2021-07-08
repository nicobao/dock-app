import RNFS from 'react-native-fs';
import Share from 'react-native-share'
import DocumentPicker from 'react-native-document-picker';

async function main() {
  try {
    // const fileDirs = await RNFS.getAllExternalFilesDirs();
    // console.log(RNFS);
    // const path = RNFS.DocumentDirectoryPath + '/3GoLUwuovRemYomjQGqD5Wo7ZEY2mTgw95iJPPaKhnPTzVVW.json';
    // const jsonData = JSON.stringify({"encoded":"a94pnHfOuh/27N07XBFK+g2THMhuVxOJrpVOzEF+VHgAgAAAAQAAAAgAAAAKLbYS5ZcPQFvhrr6ZdPBk0qZyqEwSbp/LnCh6x/K3E7tEszYoh2/KrDmI+J7LZFvnEv2TQucr1c6Eg/Qup5pzLu/RLn0eaoBdFQ8BgGyo3c2zLye5P1XcRePfNVhw+APJ/Uqkv5LUqMFEEEJEzBJg/Flqz6ZG6S3iOV9PEV5v6xvKvzPATR4mZCA5UljXz+j7JKUEMyg5MxoPscEp","encoding":{"content":["pkcs8","sr25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"address":"3GoLUwuovRemYomjQGqD5Wo7ZEY2mTgw95iJPPaKhnPTzVVW","meta":{"genesisHash":"0xf73467c6544aa68df2ee546b135f955c46b90fa627e9b5d7935f41061bb8a5a9","name":"test","tags":[],"whenCreated":1622563948125,"meta":{"genesisHash":"0xf73467c6544aa68df2ee546b135f955c46b90fa627e9b5d7935f41061bb8a5a9"}}});
    // const mimeType = 'application/json';
    // const result = await RNFS.writeFile(path, jsonData);
    // // const base64Data = Buffer.from(jsonData).toString('base64');

    // Share.open({
    //   url: "file://" + path,
    //   type: mimeType,
    // });
    
    // const file = await DocumentPicker.pick({
    //   type: [DocumentPicker.types.allFiles],
    // });

    // const fileData = await RNFS.readFile(file.fileCopyUri);

    // debugger;
  } catch (err) {
    console.error(err);
    console.log(RNFS);
    debugger;
  }
}

main();

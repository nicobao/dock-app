import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {translate} from 'src/locales';
import {showToast} from './toast';

export function pickDocuments() {
  return DocumentPicker.pick({
    type: [DocumentPicker.types.allFiles],
  }).catch(err => {
    if (err.code === 'DOCUMENT_PICKER_CANCELED') {
      return [];
    }

    throw err;
  });
}

export async function pickFileData() {
  const files = await pickDocuments();

  if (!files.length) {
    return;
  }

  return RNFS.readFile(files[0].fileCopyUri);
}

export async function pickJSONFile() {
  const fileData = await pickFileData();

  try {
    return JSON.parse(fileData);
  } catch (err) {
    showToast({
      type: 'error',
      message: translate('globals.invalid_json_file'),
    });
    throw err;
  }
}

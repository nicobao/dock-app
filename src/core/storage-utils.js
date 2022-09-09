import assert from 'assert';
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

export function readFile(path) {
  assert(!!path, 'file path is required');

  try {
    return RNFS.readFile(path);
  } catch (err) {
    console.error(err);
    throw new Error(`Unable to read file ${path}`);
  }
}

export async function pickFileData() {
  const files = await pickDocuments();

  if (!files.length) {
    return;
  }

  const [file] = files;

  assert(!!file, 'file is not defined');
  assert(!!file.fileCopyUri, 'fileCopyUri is not defined');

  return readFile(file.fileCopyUri);
}

export async function pickJSONFile() {
  const fileData = await pickFileData();

  if (!fileData) {
    return;
  }

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

export function stringToJSON(data) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    return null;
  }
}

import DocumentPicker from 'react-native-document-picker';

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

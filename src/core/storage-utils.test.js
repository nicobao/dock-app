import DocumentPicker from 'react-native-document-picker';
import {pickDocuments, stringToJSON} from './storage-utils';

describe('storage utils', () => {
  it('expect to handle files', async () => {
    const result = [];
    jest
      .spyOn(DocumentPicker, 'pick')
      .mockImplementationOnce(() => Promise.resolve(result));

    const files = await pickDocuments();

    expect(files).toBe(result);
  });

  it('expect to handle cancel event on document picker', async () => {
    jest.spyOn(DocumentPicker, 'pick').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'DOCUMENT_PICKER_CANCELED',
      });
    });

    const files = await pickDocuments();

    expect(files).toStrictEqual([]);
  });

  it('expect to handle unexpected picker error', async () => {
    jest.spyOn(DocumentPicker, 'pick').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'OTHER_CODE',
      });
    });

    const err = await pickDocuments().catch(v => v);

    expect(err.code).toBe('OTHER_CODE');
  });

  it('parse string to JSON', () => {
    const res = stringToJSON('dockwallet://proof-request?url=https%3A%2F%2Fap');
    expect(res).toEqual({});

    const res2 = stringToJSON('{"type":"dockwallet"}');

    expect(res2).toHaveProperty('type', 'dockwallet');
  });
});

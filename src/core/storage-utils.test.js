import DocumentPicker from 'react-native-document-picker';
import {pickDocument, stringToJSON} from './storage-utils';

describe('storage utils', () => {
  it('expect to handle files', async () => {
    const result = 'some-data';
    jest
      .spyOn(DocumentPicker, 'pick')
      .mockImplementationOnce(() => Promise.resolve(result));

    const file = await pickDocument();

    expect(file).toBe(result);
  });

  it('expect to handle cancel event on document picker', async () => {
    jest.spyOn(DocumentPicker, 'pick').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'DOCUMENT_PICKER_CANCELED',
      });
    });

    const file = await pickDocument();

    expect(file).toStrictEqual(undefined);
  });

  it('expect to handle unexpected picker error', async () => {
    jest.spyOn(DocumentPicker, 'pick').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'OTHER_CODE',
      });
    });

    const err = await pickDocument().catch(v => v);

    expect(err.code).toBe('OTHER_CODE');
  });

  it('parse string to JSON', () => {
    const res = stringToJSON('dockwallet://proof-request?url=https%3A%2F%2Fap');
    expect(res).toBe(null);

    const res2 = stringToJSON('{"type":"dockwallet"}');

    expect(res2).toHaveProperty('type', 'dockwallet');
  });
});

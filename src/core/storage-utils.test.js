import DocumentPicker from 'react-native-document-picker';
import {pickDocument, stringToJSON} from './storage-utils';
import { setToast } from './toast';

describe('storage utils', () => {
  it('expect to handle files', async () => {
    const result = 'some-data';
    jest
      .spyOn(DocumentPicker, 'pickSingle')
      .mockImplementationOnce(() => Promise.resolve(result));

    const file = await pickDocument();

    expect(file).toBe(result);
  });

  it('expect to handle cancel event on document picker', async () => {
    jest.spyOn(DocumentPicker, 'pickSingle').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'DOCUMENT_PICKER_CANCELED',
      });
    });

    const file = await pickDocument();

    expect(file).toStrictEqual(undefined);
  });

  it('expect to handle unexpected picker error', async () => {
    jest.spyOn(DocumentPicker, 'pickSingle').mockImplementationOnce(() => {
      return Promise.reject({
        code: 'OTHER_CODE',
      });
    });

    const toastMock = {
      show: jest.fn(),
    };

    setToast(toastMock);

    const err = await pickDocument().catch(v => v);

    expect(err.code).toBe('OTHER_CODE');
    expect(toastMock.show).toBeCalled();
  });

  it('parse string to JSON', () => {
    const res = stringToJSON('dockwallet://proof-request?url=https%3A%2F%2Fap');
    expect(res).toBe(null);

    const res2 = stringToJSON('{"type":"dockwallet"}');

    expect(res2).toHaveProperty('type', 'dockwallet');
  });
});

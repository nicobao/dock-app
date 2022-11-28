import DocumentPicker from 'react-native-document-picker';
import {isValidUrl, pickDocument, stringToJSON} from './storage-utils';
import {setToast} from './toast';

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
  it('expect to be false when given invalid url', () => {
    expect(isValidUrl('test')).toBeFalsy();
    expect(isValidUrl()).toBeFalsy();
    expect(isValidUrl(null)).toBeFalsy();
    expect(isValidUrl('http://')).toBeFalsy();
    expect(isValidUrl('dockwallet://proof-request?url')).toBeFalsy();
    expect(isValidUrl('ftp://proof-request')).toBeFalsy();
    expect(isValidUrl('httpss://google.com')).toBeFalsy();
  });
  it('expect to be true when given valid url', () => {
    expect(isValidUrl('http://google.com')).toBeTruthy();
    expect(isValidUrl('https://google.com')).toBeTruthy();
  });
});

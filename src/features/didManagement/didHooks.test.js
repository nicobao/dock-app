import {renderHook, act} from '@testing-library/react-hooks';
import {useDIDManagementHandlers} from './didHooks';
import {useDIDManagement} from '@docknetwork/wallet-sdk-react-native/lib';

describe('DID hooks', () => {
  test('Handle on change', () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
    });
    expect(result.current.form.didType).toBe('didkey');
  });
  //
  test('Handle new DID key creation', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
    });

    await result.current.onCreateDID();

    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.createKeyDID).toBeCalledWith({
      derivePath: '',
      type: 'ed25519',
      name: '',
      didType: 'didkey',
    });
  });
  test('Handle new DID key creation with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
      result.current.handleChange('keypairType')('sr25519');
    });

    await expect(result.current.onCreateDID()).rejects.toMatch(
      'Only ed25519 keypair is supported.',
    );
  });
  //
  test('Delete DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    await result.current.onDeleteDID({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
    });
    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.deleteDID).toBeCalledWith({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
    });
  });
  //
  test('Update  DID', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    act(() => {
      result.current.handleChange('didName')('DockSocials');
      result.current.handleChange('id')(
        'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      );
    });
    await result.current.onEditDID();
    const {result: dIDManagementResult} = renderHook(() => useDIDManagement());
    expect(dIDManagementResult.current.editDID).toBeCalledWith({
      id: 'did:key:z6MkjjCpsoQrwnEmqHzLdxWowXk5gjbwor4urC1RPDmGeV8r',
      name: 'DockSocials',
    });
  });
  test('Update  DID with invalid params', async () => {
    const {result} = renderHook(() => useDIDManagementHandlers());
    act(() => {
      result.current.handleChange('id')('');
    });

    await expect(result.current.onEditDID()).rejects.toMatch(
      'Document ID is not set',
    );
  });
});

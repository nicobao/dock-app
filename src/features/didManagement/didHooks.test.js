import {renderHook, act} from '@testing-library/react-hooks';
import {useDIDManagement, useDIDManagementHandlers} from './didHooks';
import {createDefaultDID} from './didManagment-slice';

describe('DID hooks', () => {
  test('Can query set queried dids', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useDIDManagement());
    expect(result.current.didList.length).toBe(0);

    await createDefaultDID();

    result.current.queryDIDDocuments();
    await waitForNextUpdate();
    expect(result.current.didList.length).toBe(1);
  });

  test('Handle on change', () => {
    const {result} = renderHook(() => useDIDManagementHandlers());

    act(() => {
      result.current.handleChange('didType')('didkey');
    });
    expect(result.current.form.didType).toBe('didkey');
  });

  test('Handle new DID key creation', async () => {
    const {result, waitForNextUpdate: w1} = renderHook(() =>
      useDIDManagementHandlers(),
    );

    act(() => {
      result.current.handleChange('didType')('didkey');
    });
    expect(result.current.form.didType).toBe('didkey');
    result.current.onCreateDID();

    await w1({
      timeout: 5000,
    });

    const {result: dIDManagementResult, waitForNextUpdate: w2} = renderHook(
      () => useDIDManagement(),
    );
    //
    dIDManagementResult.current.queryDIDDocuments();
    await w2();
    expect(dIDManagementResult.current.didList.length).toBe(2);
    expect(
      dIDManagementResult.current.didList[1].didDocument.id.indexOf('did:key'),
    ).toBe(0);
  });

  test('Delete DID', async () => {
    const {result, waitForNextUpdate} = renderHook(() => useDIDManagement());

    result.current.queryDIDDocuments();
    await waitForNextUpdate();
    const previousLength = result.current.didList.length;

    result.current.onDeleteDID(result.current.didList[0]);

    result.current.queryDIDDocuments();
    await waitForNextUpdate();
    expect(result.current.didList.length).toBe(previousLength - 1);
  });
});

import {translate} from 'src/locales';
import {validateAndImport} from './wallet-slice';
import {WalletRpc} from '@docknetwork/react-native-sdk/src/client/wallet-rpc';

describe('Wallet Slice', () => {
  it('expect error message to be accurate', () => {
    expect('Invalid backup file or incorrect password').toBe(
      translate('import_wallet.import_error', {
        locale: 'en',
      }),
    );
  });

  it('expect import to work', async () => {
    const fileData =
      '{"@context":["https://www.w3.org/2018/credentials/v1","https://w3id.org/wallet/v1"],"id":"did:key:z6LSd1HEdsPzejHbcKpWH44bF5oA4ET2hvxRBGJK17m4EQgH#encrypted-wallet","type":["VerifiableCredential","EncryptedWallet"],"issuer":"did:key:z6LSd1HEdsPzejHbcKpWH44bF5oA4ET2hvxRBGJK17m4EQgH","issuanceDate":"2022-03-28T11:44:06.296Z","credentialSubject":{"id":"did:key:z6LSd1HEdsPzejHbcKpWH44bF5oA4ET2hvxRBGJK17m4EQgH","encryptedWalletContents":{"protected":"eyJlbmMiOiJYQzIwUCJ9","recipients":[{"header":{"kid":"did:key:z6LSd1HEdsPzejHbcKpWH44bF5oA4ET2hvxRBGJK17m4EQgH#z6LSd1HEdsPzejHbcKpWH44bF5oA4ET2hvxRBGJK17m4EQgH","alg":"ECDH-ES+A256KW","epk":{"kty":"OKP","crv":"X25519","x":"4m3aQnMdA5W8uRS5aOyL6hhCv4m2aYs37mgTb2TjSlA"},"apu":"4m3aQnMdA5W8uRS5aOyL6hhCv4m2aYs37mgTb2TjSlA","apv":"ZGlkOmtleTp6NkxTZDFIRWRzUHplakhiY0twV0g0NGJGNW9BNEVUMmh2eFJCR0pLMTdtNEVRZ0gjejZMU2QxSEVkc1B6ZWpIYmNLcFdINDRiRjVvQTRFVDJodnhSQkdKSzE3bTRFUWdI"},"encrypted_key":"tqLFSA1zptbY7q7lQwPrwcQUimszxVGAwbjH_tQiOnmvvlKq7_r4NA"}],"iv":"pOCWbAck7R5gTw-t2ERUu7KqYgcYvpxD","ciphertext":"VONhX8X_bXH4pxlqC7N6TIicq-GjO14b1ROgUF8JDHZC51Lco9zmUj-sfWZ-RUlOt6dP4aPg6LQQctZncSo3xhLtL5M8PcWkRaRW7fMDsknMO-6SHUUEx8MVPqL3Sh-KRSfduXxL82BZMgnY-vUqY2sU-RuVZvaxfisz7d7prqGPi4hdtWVu5zOZbdpIYU-yqXFfuwscygVUyJrdyPHMco4ZgZvJ4zIinetw_Da0VcjOCoi_5bHaSCatZDdMXhujkLgAd4AeOKm2ct9VmlzywSEAY946hhbgKmu0dzHaD49xhzQmQgKqB8OBm3TR8dCRxVUoyqYw_6JeWWgWUnnrcbSDBV5z69usuiXyaqj0q9ffL4BR9JnlDEykxlhq3rFSOiaBDB6dayP5IuRaQkna81GI3zBF0ywMFz1cOYisWEyf6zSEzdg4E0Odd1VG8RRBaU7Mr6hJ-IfBWvtQ2cfRtLuZabjWYNPGPV9sZxiN-3_QZP9F4NuxDJj8swsNDmGmT4JPf5NN2baLmgRrghnV-XiUu-lcJ9HznTfUxKqtl8erroXT-oK8q3Or_EI9Wxxzgz5Xxp-JiqCa8ZYET2iQh68vpCbqsaKs0hsRX1xVyQhT1guRllrly-BGp76ZAy-2cX1ZLZK_SlSWx2wfdfiIKjN-ZSR8vYOEXtShryG79WLshDn3t3-gTVFgBkB8bn3gp40VjwWy7XVX8P0INfIFf1-mmWHW7-SVn-FM5bFrFaqyK80sZCC_19Kp5sWYCW4e7hVblR5GHgSaSeG35gxAp95wE8bgKn9XqaLugq9f2Wel0D0YuuHBQ_xyedmiekESALLUOr47rZu_D90zkOQgO8SkrbDsNQKbjJMY2-EfAl4uRPW-LwhEdUEBdSB7R-DZ6xzb90l9mp-nfR9wGpzxaeq0Zu6aMjWxAMImuy1aK2fwISFb_zB8T_6cKHGkfJYU9zYy8W5-HtFf9ErXFUp3rkluCQDUZ05BnaeXF2MSvTdg_ZSRuV3-EOcmnlFZpwG4SVRttWEZPxzrO5vt0lBHhaOdmumj7Ot_pXdeD99GB_iNphx4SzIlQ0rV4KwE7_3y1X1TSYkmhCWbpDbfymLjoKd67BbY_XzRjL2n1gwtV3tGpyabj1A6mvrMMbwqW8rDbgTUaEAmnpw1ibbG8PgZd8CI0lyD426sXVLO3-JegZrqNllu-vaj-ffUoZn_ZNp9evnls1lg2RXmGfIun_zyLSTa34O_hXe5SQDRLvqrMhcFrcZcIAmzcSTmqjl54K8DzKjD-geLSfVAPMVqFYUtMn71h8Vv7Bq8puTk3pT0yiHhiA","tag":"Yk9KFp7RZWa3m2sYtUnRPQ"}}}';

    return expect(
      WalletRpc.importWallet(JSON.parse(fileData), 'Password1$'),
    ).resolves.toBe(undefined);
  });
});

import React, {useCallback} from 'react';
import {ScreenContainer} from '../../design-system';
import TransakPaymentProvider from './components/TransakProvider';

export function BuyDockScreenScreen({walletAddress, orderId}) {
  const getPaymentProvider = useCallback(() => {
    // Default payment provider is Transak
    return (
      <TransakPaymentProvider
        partnerOrderId={orderId}
        walletAddress={walletAddress}
      />
    );
  }, [orderId, walletAddress]);

  return (
    <ScreenContainer testID="BuyDockScreenScreen">
      {getPaymentProvider()}
    </ScreenContainer>
  );
}

export function BuyDockScreenContainer({route}) {
  const {id, orderId} = route.params;

  return <BuyDockScreenScreen walletAddress={id} orderId={orderId} />;
}

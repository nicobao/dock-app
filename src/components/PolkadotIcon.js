import React, {useEffect, useState} from 'react';
import {jsx as _jsx} from 'react/jsx-runtime';
import {Circle, Svg} from 'react-native-svg';
import { useDispatch } from 'react-redux';
import { accountOperations } from 'src/features/accounts/account-slice';

function renderCircle({cx, cy, fill, r}, key) {
  return <Circle cx={cx} cy={cy} fill={fill} r={r} key={key} />;
}

function Identicon({
  address,
  className = '',
  isAlternative = false,
  size,
  style,
}) {
  const dispatch = useDispatch();
  const [svgData, setSvgData] = useState();

  useEffect(() => {
    if (!address) {
      return;
    }

    dispatch(accountOperations.getPolkadotSvgIcon(address, isAlternative)).then(setSvgData);
  }, [address, isAlternative]);

  if (!svgData) {
    return null;
  }

  return (
    <Svg
      className={className}
      height={size}
      id={address}
      name={address}
      style={style}
      viewBox="0 0 64 64"
      width={size}>
      {svgData.map(renderCircle)}
    </Svg>
  );
}

export const PolkadotIcon = React.memo(Identicon);

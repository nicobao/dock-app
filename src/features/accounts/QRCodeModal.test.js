import React from 'react';
import {shallow} from 'enzyme';
import {QRCodeModal} from './QRCodeModal';

describe('QRCodeModal', () => {
  it('should render correctly with data', () => {
    const wrapper = shallow(
      <QRCodeModal onClose={jest.fn()} data="some data to be rendered" />,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should not break when data is undefined', () => {
    const wrapper = shallow(
      <QRCodeModal onClose={jest.fn()} data={undefined} />,
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});

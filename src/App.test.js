import React from 'react';
import {shallow} from 'enzyme';
import {GlobalComponents} from './App';
import {renderAppProviders} from './core/test-utils';

describe('App', () => {
  it('should render correctly', async () => {
    const wrapper = shallow(renderAppProviders(<GlobalComponents />));
    expect(wrapper.dive()).toMatchSnapshot();
  });
});

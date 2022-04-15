import React from 'react';
import {shallow} from 'enzyme';
import {AccountsScreen} from './AccountsScreen';
import {renderAppProviders} from '../../core/test-utils';

const mockAccounts = [
  {
    id: 'test',
    name: 'Account name',
    balance: 21,
  },
];

describe('AccountsScreen', () => {
  it('should render correctly with no accounts', () => {
    const tree = shallow(renderAppProviders(<AccountsScreen accounts={[]} />));
    expect(tree.dive()).toMatchSnapshot();
  });

  it('should render correctly with accounts', () => {
    const tree = shallow(
      renderAppProviders(<AccountsScreen accounts={mockAccounts} />),
    );
    expect(tree.dive()).toMatchSnapshot();
  });
});

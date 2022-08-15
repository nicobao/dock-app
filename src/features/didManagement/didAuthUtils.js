// Taken from https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&ss=chromium
import queryString from 'query-string';
import {translate} from '../../locales';

export const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const nameField = {
  name: translate('didAuth.name'),
  placeholder: 'John Doe',
  type: 'text',
  id: 'name',
};

const knownScopeFields = {
  public: [nameField],
  profile: [nameField],
  user: [nameField],
  email: [
    {
      name: translate('didAuth.email'),
      placeholder: 'johndoe@dock.io',
      type: 'email',
      id: 'email',
      required: true,
    },
  ],
};

export function getScopeFields(scope) {
  const scopeSplits = scope.split(' ');
  const result = [];
  scopeSplits.forEach(scopeSplit => {
    const knownFields = knownScopeFields[scopeSplit];
    if (knownFields) {
      result.push(...knownFields);
    }
  });
  return result.filter((item, i) => result.indexOf(item) === i);
}

export function extractClientInfo(url) {
  const parsed = queryString.parse(url.substr(url.indexOf('?')));
  const submitUrl = parsed.url || '';
  const submitParsed = queryString.parse(
    submitUrl.substr(submitUrl.indexOf('?')),
  );
  return {
    name: submitParsed.client_name || 'Unnamed App',
    website: submitParsed.client_website,
    scope: submitParsed.scope || 'public',
  };
}

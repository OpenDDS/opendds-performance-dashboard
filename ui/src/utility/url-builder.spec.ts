import {
  objectToQuery,
  queryToObject,
  resolveApiUrl,
  trimTrailingSlashes
} from './url-builder';

const queryObject = {
  hello: 'my friend',
  next: ['one', 'two', 'three'],
  count: 2
};

const queryString =
  '?hello=my%20friend&next[]=one&next[]=two&next[]=three&count=2';

describe('Url Builder Tests', () => {
  test('Test Complete Query to Object', () => {
    expect(queryToObject(queryString)).toMatchObject(queryObject);
  });

  test('Test Complete Object to Query', () => {
    expect(objectToQuery(queryObject)).toBe(queryString);
  });

  test('Test Empty Query', () => {
    expect(queryToObject()).toMatchObject({});
    expect(queryToObject('')).toMatchObject({});
    expect(queryToObject(null)).toMatchObject({});
    expect(queryToObject(undefined)).toMatchObject({});
  });

  test('Test Empty Object', () => {
    expect(objectToQuery()).toBe('?');
    expect(objectToQuery({})).toBe('?');
    expect(objectToQuery(null)).toBe('?');
    expect(objectToQuery(undefined)).toBe('?');
  });

  test('Test URL decoding', () => {
    expect(
      queryToObject(
        "?ugly=()(*%26%5E%25%24%23%23%23%23%40!%3F%3E%3C%3A%60%22'%3A%3B%7B%7D%7C"
      )
    ).toMatchObject({
      ugly: `()(*&^%$####@!?><:\`"':;{}|`
    });
  });

  test('Test Object encoding', () => {
    expect(
      objectToQuery({
        ugly: `()(*&^%$####@!?><:\`"':;{}|`
      })
    ).toBe(
      "?ugly=()(*%26%5E%25%24%23%23%23%23%40!%3F%3E%3C%3A%60%22'%3A%3B%7B%7D%7C"
    );
  });
});

describe('Test Base URL Cleanup', () => {
  test('Test strips off extra trailing slashes from the end', () => {
    expect(trimTrailingSlashes('http://test.com///')).toBe('http://test.com');
    expect(trimTrailingSlashes('http://test.com//')).toBe('http://test.com');
    expect(trimTrailingSlashes('http://test.com')).toBe('http://test.com');
    expect(trimTrailingSlashes('http://test.com/host/test/')).toBe(
      'http://test.com/host/test'
    );
  });
});

describe('Resolves Expected URL', () => {
  const locationMock = {
    ancestorOrigins: <DOMStringList>{},
    hash: '',
    host: '',
    href: '',
    port: '',
    search: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn()
  };

  test('Resolves localhost', () => {
    expect(
      resolveApiUrl({
        ...locationMock,
        origin: 'http://localhost:3000',
        protocol: 'http:',
        hostname: 'localhost',
        pathname: '/'
      })
    ).toBe('http://localhost:1919/bench2');
  });

  test('Resolves Production Site', () => {
    expect(
      resolveApiUrl({
        ...locationMock,
        origin: 'http://scoreboard.ociweb.com',
        protocol: 'http:',
        hostname: 'scoreboard.ociweb.com',
        pathname: '/bench2'
      })
    ).toBe('http://scoreboard.ociweb.com/bench2');
  });

  test('Resolves Proxy Site', () => {
    expect(
      resolveApiUrl({
        ...locationMock,
        origin: 'http://beetle.ociweb.com',
        protocol: 'http:',
        hostname: 'beetle.ociweb.com',
        pathname: '/www-docs/autobuild_logs/bench2/'
      })
    ).toBe('http://beetle.ociweb.com/www-docs/autobuild_logs/bench2');
  });
});

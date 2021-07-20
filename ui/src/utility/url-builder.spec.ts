import {
  objectToQuery,
  queryToObject,
  resolveApiUrl,
  trimTrailingSlashes
} from './url-builder';

const queryObject = {
  hello: 'my friend',
  next: ['one', 'two', 'three'],
  count: 2,
  isTrue: true,
  isFalse: false
};

const queryString =
  '?hello=my%20friend&next[]=one&next[]=two&next[]=three&count=2&isTrue=true&isFalse=false';

describe('Url Builder Tests', () => {
  test('Test Complete Query to Object', () => {
    expect(queryToObject(queryString)).toMatchObject(queryObject);
  });

  test('Test Complete Object to Query', () => {
    expect(objectToQuery(queryObject)).toBe(queryString);
  });

  test('Test Primitive Deserialization', () => {
    const {count, isTrue, isFalse} = queryToObject(queryString);

    expect(count).toBe(2);
    expect(count).not.toBe('2');

    expect(isTrue).toBe(true);
    expect(isTrue).not.toBe('true');

    expect(isFalse).toBe(false);
    expect(isFalse).not.toBe('false');
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
    port: '80',
    search: '',
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn()
  };

  test('Resolves dev localhost', () => {
    const localhost = {
      protocol: 'http:',
      hostname: 'localhost',
      pathname: '/'
    };
    expect(
      resolveApiUrl({
        ...locationMock,
        ...localhost,
        origin: 'http://localhost:3000',
        port: '3000'
      })
    ).toBe('http://localhost:1919/bench2');
    expect(
      resolveApiUrl({
        ...locationMock,
        ...localhost,
        origin: 'http://localhost:5000',
        port: '5000'
      })
    ).toBe('http://localhost:1919/bench2');
  });

  test('Resolves non-dev localhost (proxy server)', () => {
    expect(
      resolveApiUrl({
        ...locationMock,
        protocol: 'http:',
        hostname: 'localhost',
        pathname: '/',
        origin: 'http://localhost:8080',
        port: '8080'
      })
    ).toBe('http://localhost:8080');

    expect(
      resolveApiUrl({
        ...locationMock,
        protocol: 'http:',
        hostname: 'localhost',
        pathname: '/',
        origin: 'http://localhost:8080/bench2',
        port: '8080'
      })
    ).toBe('http://localhost:8080/bench2');
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

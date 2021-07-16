import {combinations} from './combinations';

describe('Explicit Combinations Tets', () => {
  test('Explicit Combinations', () => {
    const results = combinations(
      ['bilbo', 'frodo', 'sam'],
      ['ale', 'brandywine'],
      ['pony', 'foot']
    );
    const output = [
      ['bilbo', 'ale', 'pony'],
      ['bilbo', 'ale', 'foot'],
      ['bilbo', 'brandywine', 'pony'],
      ['bilbo', 'brandywine', 'foot'],
      ['frodo', 'ale', 'pony'],
      ['frodo', 'ale', 'foot'],
      ['frodo', 'brandywine', 'pony'],
      ['frodo', 'brandywine', 'foot'],
      ['sam', 'ale', 'pony'],
      ['sam', 'ale', 'foot'],
      ['sam', 'brandywine', 'pony'],
      ['sam', 'brandywine', 'foot']
    ];

    expect(JSON.stringify(results)).toMatch(JSON.stringify(output));
  });
});

describe('Dynamic Combinations Test', () => {
  const input = [
    [...Array(10)].map((u, i) => i + 100),
    [...Array(20)].map((u, i) => i + 200),
    [...Array(40)].map((u, i) => i + 300),
    [...Array(40)].map((u, i) => i + 400)
  ];
  const results = combinations(...input);

  test('Large dataset expected count matches results', () => {
    const total = input.reduce((count, array) => {
      count = count * array.length;
      return count;
    }, 1);
    expect(total).toEqual(results.length);
  });

  test('Large dataset snapshot', () => {
    expect(results).toMatchSnapshot();
  });
});

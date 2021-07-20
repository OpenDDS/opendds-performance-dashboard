/**
 * Create all possible combinations of entries form a given set of arrays, i.e. Cartesian Product
 * @example
 * ```
 * given : ["bilbo", "frodo", "sam"], ["sting", "ring"], ["horse", "foot"]
 * output : [
 *    ["bilbo", "sting", "horse"],
 *    ["bilbo", "sting", "foot"],
 *    ["bilbo", "ring",  "horse"],
 *    ["bilbo", "ring",  "foot"],
 *    ["frodo", "sting", "horse"],
 *    ["frodo", "sting", "foot"],
 *    ["frodo", "ring",  "horse"],
 *    ["frodo", "ring",  "foot"],
 *    ["sam",   "sting", "horse"],
 *    ["sam",   "sting", "foot"],
 *    ["sam",   "ring",  "horse"],
 *    ["sam",   "ring",  "foot"],
 * ]
 * ```
 * @param args Array or Arrays
 * @returns
 */
export function combinations(...args: unknown[][]): unknown[][] {
  if (!args || args.length == 0) return args;

  const collector = [];

  const [first, ...rest] = args;
  const x = combinations(...rest);
  for (let i = 0, l = first.length; i < l; i++) {
    if (x && x.length)
      for (let j = 0, m = x.length; j < m; j++)
        collector.push([first[i]].concat(x[j]));
    else collector.push([first[i]]);
  }
  return collector;
}

# cli-test

# Javascript

## Context

Your job is to write a command-line interface in Node.js.
This program has to filter a list of elements containing a pattern.

In the following file `data.js`, there are `Countries` containing `Peoples` containing `Animals`.

Sample of running the command and the expected output:

```bash
# Only animals containing `ry` are displayed. The order should be kept intact

$ node app.js --filter=ry
[
   { name: 'Satanwi',
     people:
      [ { name: 'Elmer Kinoshita',
          animals:
           [ { name: 'Wrysel' },
        { name: 'Cora Howell',
          animals:
           [ { name: 'Rrya' },
             { name: 'Pronryorn' } ] },
        { name: 'Anthony Bruno',
          animals:
           [ { name: 'Caryxcal' },
             { name: 'Tryantula' },
             { name: 'Oryx' } ] } ] } ]
...
]
```

`Bonus:`
As a bonus point, the next goal is to count People and Animals by adding the count of children in the name, eg. Satanwi [2].

Example:

```bash
node app.js --count
[
  { name: 'Satanwi [1]',
     people:
      [ { name: 'Elmer Kinoshita [1]',
          animals:
           [ { name: 'Wrysel' },
        { name: 'Cora Howell [2]',
          animals:
           [ { name: 'Rrya' },
             { name: 'Pronryorn' } ] },
        { name: 'Anthony Bruno [3]',
          animals:
           [ { name: 'Caryxcal' },
             { name: 'Tryantula' },
             { name: 'Oryx' } ] } ] } ]
...
]
```

## Requirements

- The code must be available in a GIT repository
- No library/modules should be used, except for the testing library

## Appreciation

- Code readability, structure and consistency
- Tests, how they are written
- Bonus: usage of Functional concepts

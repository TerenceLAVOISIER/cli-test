import arg from 'arg';
import { data } from './sample/data.js';
import util from 'util';

const DEFAULT_LOOP = ['countries', 'people', 'animals'];

class App {
  parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        '--filter': String,
        '--count': Boolean,
      },
      {
        argv: rawArgs.slice(2),
      },
    );
    return {
      filter: args['--filter'] || '',
      count: args['--count'] || false,
    };
  }

  browseAndFiltedData(datas = [], filter, loop = DEFAULT_LOOP) {
    loop.shift();
    const index = loop[0];
    if (index) {
      return datas
        .map((data) => {
          return data[index].length > 0
            ? Object.assign({}, data, {
                [index]: this.browseAndFiltedData(data[index], filter, [...loop]),
              })
            : null;
        })
        .filter((data) => data[index].length > 0);
    }
    return datas.filter((data) => data.name.includes(filter));
  }

  countChild(data) {
    const childrenKey = Object.keys(data).find((key) => data[key] instanceof Array);

    return childrenKey
      ? Object.assign({}, data, {
          name: `${data.name} [${data[childrenKey].length}]`,
          [childrenKey]: this.addChildrenLength(data[childrenKey]),
        })
      : Object.assign({}, data);
  }

  addChildrenLength(data) {
    return data.map((d) => this.countChild(d));
  }

  cli(args) {
    let options = this.parseArgumentsIntoOptions(args.argv);
    let filteredData = this.browseAndFiltedData(data, options.filter);

    if (options.count) {
      filteredData = this.addChildrenLength(filteredData);
    }

    // util.inspect used to display full object in console
    console.log(util.inspect(filteredData, { showHidden: false, depth: null }));
  }
}

const app = new App();
app.cli(process);

export default App;

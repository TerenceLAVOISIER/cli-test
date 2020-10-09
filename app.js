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
    const index = loop[0] || null;
    if (index) {
      datas.map((data) => {
        data[index] = this.browseAndFiltedData(data[index], filter, [...loop]);
        return data[index].length > 0 ? data : {};
      });
      return datas.filter((data) => data[index].length > 0);
    } else {
      return datas.filter((data) => data.name.includes(filter));
    }
  }

  countChild(data) {
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Array) {
        data.name += ` [${data[key].length}]`;
        data[key].map((child) => this.countChild(child));
      }
    });

    return data;
  }

  cli(args) {
    let options = this.parseArgumentsIntoOptions(args.argv);
    let filteredData = this.browseAndFiltedData(data, options.filter);

    if (options.count) {
      filteredData.map((data) => this.countChild(data));
    }

    // util.inspect used to display full object in console
    console.log(util.inspect(filteredData, { showHidden: false, depth: null }));
  }
}

const app = new App();
app.cli(process);

export default App;

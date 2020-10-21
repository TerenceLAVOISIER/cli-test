import arg from "arg";
import { data } from "./sample/data.js";
import util from "util";

const DEFAULT_LOOP = ["countries", "people", "animals"];

class App {
  parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        "--filter": String,
        "--count": Boolean,
      },
      {
        argv: rawArgs.slice(2),
      }
    );
    return {
      filter: args["--filter"] || "",
      count: args["--count"] || false,
    };
  }

  browseAndFiltedData(datas = [], filter, loop = DEFAULT_LOOP) {
    loop.shift();

    if (loop[0]) {
      return this.findAndFilter(datas, filter, loop);
    }

    return this.filterDataByName(datas, filter);
  }

  filterDataByName(datas, filter) {
    return datas.filter((data) => data.name.includes(filter));
  }

  findAndFilter(datas, filter, loop) {
    const index = loop[0];

    return datas
      .map((data) => {
        if (data && data[index] && data[index].length > 0) {
          return Object.assign(data, {
            [index]: this.browseAndFiltedData(data[index], filter, [...loop]),
          });
        }
        return;
      })
      .filter((data) => data && data[index].length > 0);
  }

  countChild = (data) => {
    const childrenKey = this.getChildrenKey(data);

    if (childrenKey) {
      return Object.assign(data, {
        name: `${data.name} [${data[childrenKey].length}]`,
        [childrenKey]: data[childrenKey].map(this.countChild),
      });
    }

    return Object.assign({}, data);
  };

  getChildrenKey(data) {
    return Object.keys(data).find((key) => data[key] instanceof Array);
  }

  cli(args) {
    let options = this.parseArgumentsIntoOptions(args.argv);
    let filteredData = this.browseAndFiltedData(data, options.filter);

    if (options.count) {
      filteredData = filteredData.map(this.countChild);
    }

    // util.inspect used to display full object in console
    console.log(util.inspect(filteredData, { showHidden: false, depth: null }));
  }
}

new App().cli(process);

export default App;

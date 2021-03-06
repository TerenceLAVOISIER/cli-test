import App from "../app.js";
import sinon from "sinon";
import chai from "chai";
import sinonChai from "sinon-chai";

const { expect } = chai;
chai.use(sinonChai);

describe("App", function () {
  let app;
  beforeEach(() => {
    app = new App();
  });

  context("Cli", () => {
    it("should call Filter", () => {
      // Given
      const parseArgumentsIntoOptionsFn = sinon
        .stub(app, "parseArgumentsIntoOptions")
        .returns({ filter: "", count: true });
      const browseAndFiltedDataFn = sinon.spy(app, "browseAndFiltedData");
      const countChildFn = sinon.spy(app, "countChild");

      // When
      app.cli({ argv: [] });

      // Then
      expect(parseArgumentsIntoOptionsFn).to.have.been.called;
      expect(browseAndFiltedDataFn).to.have.been.called;
      expect(countChildFn).to.have.not.been.called;
    });

    it("should call count 3 times", () => {
      // Given
      const parseArgumentsIntoOptionsFn = sinon
        .stub(app, "parseArgumentsIntoOptions")
        .returns({ filter: "", count: true });
      const browseAndFiltedDataFn = sinon
        .stub(app, "browseAndFiltedData")
        .returns([{}, {}, {}]);
      const countChildFn = sinon.spy(app, "countChild");

      // When
      app.cli({ argv: [] });

      // Then
      expect(parseArgumentsIntoOptionsFn).to.have.been.called;
      expect(browseAndFiltedDataFn).to.have.been.called;
      expect(countChildFn).to.have.been.callCount(3);
    });
  });

  context("ParseArgumentsIntoOptions", () => {
    it("should return default", () => {
      // When
      const result = app.parseArgumentsIntoOptions([]);

      // Then
      expect(result).deep.to.equal({ filter: "", count: false });
    });

    it("should return count", () => {
      // Given
      const args = ["0", "1", "--count"];

      // When
      const result = app.parseArgumentsIntoOptions(args);

      // Then

      expect(result.count).deep.to.be.true;
    });

    it("should return filter", () => {
      // Given
      const args = ["0", "1", "--filter=test"];

      // When
      const result = app.parseArgumentsIntoOptions(args);

      // Then
      expect(result).to.include({ filter: "test" });
    });
  });

  context("CountChild", () => {
    it("should return with count", () => {
      // Given
      const data = { name: "first", notArray: {} };
      const countChildFn = sinon.spy(app, "countChild");

      // When
      const result = app.countChild(data);

      // Then
      expect(result).to.include({ name: "first" });
      expect(countChildFn).to.have.been.callCount(1);
    });

    it("should call multi times count", () => {
      // Given
      const data = { name: "first", array: [{}, {}, {}] };
      const countChildFn = sinon.spy(app, "countChild");

      // When
      const result = app.countChild(data);

      // Then
      expect(result).to.include({ name: "first [3]" });
      expect(countChildFn).to.have.been.callCount(4);
    });
  });

  context("GetChildrenKey", () => {
    it("should return children key", () => {
      // Given
      const data = { name: "first", arr: [] };

      // When
      const result = app.getChildrenKey(data);

      // Then
      expect(result).to.equal("arr");
    });

    it("should not return children", () => {
      // Given
      const data = { name: "first" };

      // When
      const result = app.getChildrenKey(data);

      // Then
      expect(result).to.equal(undefined);
    });
  });

  context("findAndFilter", () => {
    it("should return empty array", () => {
      // Given
      const data = [];

      // When
      const result = app.findAndFilter(data, "", []);

      // Then
      expect(result).deep.to.equal([]);
    });

    it("should return value", () => {
      // Given
      const LOOP = ["animals"];
      const data = [
        {
          name: "Lillie Abbott",
          animals: [
            { name: "John Dory" },
            { name: "Gayal" },
            { name: "Henkel's Leaf-tailed Gecko" },
          ],
        },
      ];

      const browseAndFiltedDataFn = sinon.spy(app, "browseAndFiltedData");

      // When
      const result = app.findAndFilter(data, "yal", LOOP);

      // Then
      expect(browseAndFiltedDataFn).to.have.been.called;
      expect(result[0]).to.contain({ name: "Lillie Abbott" });
      expect(result[0].animals).deep.to.equal([{ name: "Gayal" }]);
    });
  });

  context("filterDataName", () => {
    it("should return empty array", () => {
      // Given
      const data = [];

      // When
      const result = app.filterDataByName(data, "");

      // Then
      expect(result).deep.to.equal([]);
    });

    it("should return value", () => {
      // Given
      const LOOP = ["people", "animals"];
      const data = [
        {
          name: "Lillie Abbott",
          animals: [
            { name: "John Dory" },
            { name: "Gayal" },
            { name: "Henkel's Leaf-tailed Gecko" },
          ],
        },
      ];

      // When
      const result = app.filterDataByName(data, "Abb", LOOP);

      // Then
      expect(result[0]).to.contain({ name: "Lillie Abbott" });
    });
  });

  context("browseAndFiltedData", () => {
    it("should call filterDataByName", () => {
      // Given
      const filterDataByNameFn = sinon.spy(app, "filterDataByName");

      // When
      app.browseAndFiltedData([], "", []);

      // Then
      expect(filterDataByNameFn).to.have.been.called;
    });

    it("should call findAndFilter", () => {
      // Given
      const LOOP = ["peoples", "animals"];
      const findAndFilterFn = sinon.spy(app, "findAndFilter");

      // When
      app.browseAndFiltedData([], "yal", LOOP);

      // Then
      expect(findAndFilterFn).to.have.been.called;
    });
  });
});

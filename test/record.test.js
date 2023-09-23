// health.spec.js contain a test for /sync endpoint
const recordService = require("../service/recordService");
const testRecord = require("./testRecord.json");
const testRecord1 = require("./testRecord1.json");
const expect = require('chai').expect;
describe('Test /record', () => {
    describe('create record', () => {
      it('event record should be created', () => {
        let result = {};
        const actualResult = recordService.createCall(
            {body: testRecord}, 
            {json: (body) => {result.body = body;}}
        );
        expect(result.body).to.be.a('object');
      });
      it('event record should fail with validation error', () => {
        let result = {};
        const actualResult = recordService.createCall(
            {body: testRecord1}, 
            {json: (body) => {result.body = body;}}
        );
        expect(result.body.success).equals(false);
      });
    });

    describe('search record', () => {
        it('search should return results', () => {
          let currentTime = Date.now();
          let request = {start: currentTime - (1000 * 60 * 15), end: currentTime - 1000};
          let result = {}
          const actualResult = recordService.searchCall(
              {body: request}, 
              {json: (body) => {result.body = body;}}
          );
          expect(result.body).to.be.a('object');
        });
        it('search should fail with validation error', () => {
          let result = {};
          let currentTime = Date.now();
          let request = {start: currentTime + (1000 * 60 * 15), end: currentTime - 1000};
          const actualResult = recordService.createCall(
              {body: testRecord1}, 
              {json: (body) => {result.body = body;}}
          );
          expect(result.body.success).equals(false);
        });
        it('search should fail with out of range error', () => {
            let result = {};
            let currentTime = Date.now();
            let request = {start: currentTime - (1000 * 60 * 45), end: currentTime - 1000};
            const actualResult = recordService.createCall(
                {body: testRecord1}, 
                {json: (body) => {result.body = body;}}
            );
            expect(result.body.success).equals(false);
          });
      });
});
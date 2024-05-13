const fs = require("fs");
const expect = require("chai").expect;

describe("Records", () => {
  let data;

  before(() => {
    data = JSON.parse(fs.readFileSync("records/records.json", "utf8"));
  });

  describe("Regex", () => {
    let test = function(recordName, value) {
      let regex;
      let match = false;
      for (let i = 0; i < data.records.length; i += 1) {
        if (data.records[i].name === recordName) {
          for (let key in data.records[i].regex) {
            regex = new RegExp("^" + data.records[i].regex[key] + "$", "g");
            if (regex.test(value)) {
              match = true;
            }
          }
        }
      }
      return match;
    };

    describe("EVM", () => {
      it("should work for lowercase EVM address", async () => {
        const address = "0xab5801a7d398351b8be11c439e05c5b3259aec9b";
        expect(test("EVM", address)).to.be.true;
      });

      it("should work for checksum EVM address", async () => {
        const address = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";
        expect(test("EVM", address)).to.be.true;
      });

      it("should work for null address", async () => {
        const address = "0x0000000000000000000000000000000000000000";
        expect(test("EVM", address)).to.be.true;
      });

      it("should fail for random data", async () => {
        const address = "alksdjfaso342";
        expect(test("EVM", address)).to.be.false;
      });
    });

    describe("VALIDATOR", () => {
      it("should succeed for NodeID", async () => {
        const value = "NodeID-Ccx7u3SwfPt52GxWbNc74kjVJvqktTkn8";
        expect(test("VALIDATOR", value)).to.be.true;
      });

      it("should succeed for NodeID", async () => {
        const value = "NodeID-MZJ7xQGtKcYWU3qJdB5LiLdasWHmJQTFQ";
        expect(test("VALIDATOR", value)).to.be.true;
      });

      it("should fail for other data", async () => {
        const value = "NodeID-";
        expect(test("VALIDATOR", value)).to.be.false;
      });
    });

    describe("DNS_CNAME", () => {
      it("should work for domain", async () => {
        const value = "test.com";
        expect(test("DNS_CNAME", value)).to.be.true;
      });
    });

    describe("DNS_A", () => {
      it("should work for IPv4 address", async () => {
        const value = "1.1.1.1";
        expect(test("DNS_A", value)).to.be.true;
      });

      it("should work for IPv6 address", async () => {
        const value = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
        expect(test("DNS_A", value)).to.be.true;
      });

      it("should fail for number", async () => {
        const value = "2333";
        expect(test("DNS_A", value)).to.be.false;
      });
    });

    describe("AVATAR", () => {
      it("should work for http", async () => {
        const value = "https://github.com/wensdomains/i-hate-regex";
        expect(test("AVATAR", value)).to.be.true;
      });

      it("should fail for random", async () => {
        const value = "xx/github.com/wensdomains/i-hate-regex";
        expect(test("AVATAR", value)).to.be.false;
      });
    });

    describe("CONTENT", () => {
      it("should work for http", async () => {
        const value = "https://github.com/wensdomains/i-hate-regex";
        expect(test("CONTENT", value)).to.be.true;
      });

      it("should work for ipfs", async () => {
        const value = "ipfs://QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB";
        expect(test("CONTENT", value)).to.be.true;
      });

      it("should fail for random", async () => {
        const value = "xx/github.com/wensdomains/i-hate-regex";
        expect(test("CONTENT", value)).to.be.false;
      });
    });

    describe("PHONE", () => {
      // too many different
    });
  });
});

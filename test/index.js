'use strict';

const Os = require('os');
const Code = require('code');
const Lab = require('lab');
const Manager = require('toolbag/lib/manager');
const StatsCollector = require('../lib');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

function getManager () {
  return new Manager({ errors: { policy: 'throw' } });
}

describe('Stats Collector', () => {
  it('reporter-get-report command', (done) => {
    const manager = getManager();
    const options = {
      enabled: false,
      period: 1000,
      eventLoopLimit: 30,
      features: {
        process: true,
        system: true,
        cpu: true,
        memory: true,
        gc: true,
        handles: true,
        requests: true,
        eventLoop: true,
        meta: {
          tags: ['foo', 'bar']
        }
      }
    };

    StatsCollector.register(manager, options, (err) => {
      expect(err).to.not.exist();
      const cmd = manager._cmds.get('reporter-get-report');

      cmd({}, (err, results) => {
        expect(err).to.not.exist();
        expect(results.source).to.equal('toolbag');
        expect(results.meta).to.deep.equal(options.features.meta);
        expect(results.timestamp).to.be.a.date();
        expect(results.process.argv).to.deep.equal(process.argv);
        expect(results.process.execArgv).to.deep.equal(process.execArgv);
        expect(results.process.execPath).to.equal(process.execPath);
        expect(results.process.mainModule).to.equal(process.mainModule);
        expect(results.process.pid).to.equal(process.pid);
        expect(results.process.title).to.equal(process.title);
        expect(results.process.uptime).to.be.a.number();
        expect(results.process.versions).to.deep.equal(process.versions);
        expect(results.system.arch).to.equal(process.arch);
        expect(results.system.freemem).to.be.a.number();
        expect(results.system.hostname).to.equal(Os.hostname());
        expect(results.system.loadavg).to.be.an.array();
        expect(results.system.platform).to.equal(process.platform);
        expect(results.system.totalmem).to.be.a.number();
        expect(results.system.uptime).to.be.a.number();
        expect(results.cpu).to.be.an.array();
        expect(results.memory.rss).to.be.a.number();
        expect(results.memory.heapTotal).to.be.a.number();
        expect(results.memory.heapUsed).to.be.a.number();
        expect(results.gc).to.be.an.array();
        expect(results.eventLoop.delay).to.be.a.number();
        expect(results.eventLoop.limit).to.equal(options.eventLoopLimit);
        expect(results.handles).to.be.an.array();
        expect(results.requests).to.be.an.array();
        done();
      });
    });
  });
});

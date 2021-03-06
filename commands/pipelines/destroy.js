'use strict';

const cli = require('heroku-cli-util');
const disambiguate = require('../../lib/disambiguate');

module.exports = {
  topic: 'pipelines',
  command: 'destroy',
  description: 'destroy a pipeline',
  help: 'Destroy a pipeline.\n\n  Example:\n  $ heroku pipelines:destroy example\n  Destroying example pipeline... done',
  needsApp: false,
  needsAuth: true,
  args: [
    {name: 'pipeline', description: 'name of pipeline', optional: false}
  ],
  run: cli.command(function* (context, heroku) {
    const pipeline = yield disambiguate(heroku, context.args.pipeline);

    const promise = heroku.request({
      method: 'DELETE',
      path: `/pipelines/${pipeline.id}`,
      body: {name: context.args.name},
      headers: { 'Accept': 'application/vnd.heroku+json; version=3.pipelines' }
    }); // heroku.pipelines(pipeline).destroy(body);

    yield cli.action(`Destroying ${context.args.pipeline} pipeline`, promise);
  })
};

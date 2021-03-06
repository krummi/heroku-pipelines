'use strict';

let cli = require('heroku-cli-util');
let co  = require('co');
let infer = require('../../lib/infer');
let prompt = require('../../lib/prompt');

function* run(context, heroku) {
  var name, stage;
  let guesses = infer(context.app);
  let questions = [];

  if (context.args.name) {
    name = context.args.name;
  } else {
    questions.push({
      type: "input",
      name: "name",
      message: "Pipeline name",
      default: guesses[0]
    });
  }
  if (context.flags.stage) {
    stage = context.flags.stage;
  } else {
    questions.push({
      type: "list",
      name: "stage",
      message: `Stage of ${context.app}`,
      choices: ["review", "development", "test", "qa", "staging", "production"],
      default: guesses[1]
    });
  }
  let answers = yield prompt(questions);
  if (answers.name) name = answers.name;
  if (answers.stage) stage = answers.stage;
  let promise = heroku.request({
    method: 'POST',
    path: '/pipelines',
    body: {name: name},
    headers: { 'Accept': 'application/vnd.heroku+json; version=3.pipelines' }
  }); // heroku.pipelines().create({name: name});
  let pipeline = yield cli.action(`Creating ${name} pipeline`, promise);
  promise = heroku.request({
    method: 'POST',
    path: `/apps/${context.app}/pipeline-couplings`,
    body: {pipeline: {id: pipeline.id}, stage: stage},
    headers: { 'Accept': 'application/vnd.heroku+json; version=3.pipelines' }
  }); // heroku.apps(app_id).pipline_couplings().create(body);
  yield cli.action(`Adding ${context.app} to ${pipeline.name} pipeline as ${stage}`, promise);
}

module.exports = {
  topic: 'pipelines',
  command: 'create',
  description: 'create a new pipeline',
  help: 'Create a new pipeline. An existing app must be specified as the first app in the pipeline. The pipeline name will be inferred from the app name if not specified. The stage of the app will be guessed based on its name if not specified.\n\nExample:\n  $ heroku pipelines:create -a example-staging\n  ? Pipeline name: example\n  ? Stage of example-staging: staging\n  Creating example pipeline... done\n  Adding example-staging to example pipeline as staging... done',
  needsApp: true,
  needsAuth: true,
  args: [
    {name: 'name', description: 'name of pipeline, defaults to basename of app', optional: true}
  ],
  flags: [
    {name: 'stage', char: 's', description: 'stage of first app in pipeline', hasValue: true}
  ],
  run: cli.command(co.wrap(run))
};

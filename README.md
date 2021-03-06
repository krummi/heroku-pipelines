# Pipelines Plugin for Heroku Toolbelt [![Circle CI](https://circleci.com/gh/heroku/heroku-pipelines/tree/master.svg?style=svg)](https://circleci.com/gh/heroku/heroku-pipelines/tree/master)

[![npm version](https://badge.fury.io/js/heroku-pipelines.svg)](http://badge.fury.io/js/heroku-pipelines)

An experimental Heroku CLI plugin for [continuous delivery](http://en.wikipedia.org/wiki/Continuous_delivery) on Heroku.

This plugin is used to set up a collection of apps sharing a common codebase where the latest slug of one app can be promoted to the app(s) in the following stage. The promotion only copies the upstream build artifact and leaves the downstream app's config vars, add-ons, and Git repo untouched.

Note: This is a second iteration on pipelines which is completely independent of the previous implementation. This plugin can be installed along side with the [previous one](https://github.com/heroku/heroku-pipeline). They will not conflict, nor interact at all. You will have to manually migrate your pipelines from the old experiment to the new one.

## How to install this plugin

```
$ heroku plugins:install heroku-pipelines
```

### [Using Pipelines](https://devcenter.heroku.com/articles/pipelines)

#### Create a pipeline

```bash
$ heroku pipelines:create -a example # NAME and -s STAGE are optional and implied from app name
? Pipeline name: example
? Stage of example: production
Creating example pipeline... done
Adding example to example pipeline as production... done
```

#### Fork production into new admin and staging apps

```bash
$ heroku fork --from example --to example-admin --skip-pg
$ git remote rename heroku admin
...
$ heroku fork --from example --to example-staging --skip-pg
$ git remote rename heroku staging
...
```

#### Add apps to a pipeline

```bash
$ heroku pipelines:add example -a example-admin -s production
Adding example-admin to example pipeline as production... done

$ heroku pipelines:add -a example-staging example
? Stage of example-staging: staging
Adding example-staging to example pipeline as staging... done
```

#### List pipelines

```bash
$ heroku pipelines:list # Repo isn't yet returned
example github:heroku/example
sushi   github:heroku/sushi
```

#### Show pipeline detail

```bash
$ heroku pipelines:info example # Source and Flow aren't returned yet
=== example
Source type: github
Source repo: heroku/example
Staging:     example-staging
Production:  example
             example-admin
Flow:        example-staging --> example, example-admin
```

#### Diff an app in a pipeline

```bash
$ heroku pipelines:diff -a my-app-staging
Fetching apps from pipeline... done
Fetching release info for all apps... done

my-app-staging is up to date with my-app
```

#### Promote an app in a pipeline

```bash
$ heroku pipelines:promote -r staging
Fetching app info... done
Fetching apps from my-pipeline... done
Starting promotion to production... done
Waiting for promotion to complete... done

Promotion successful
My-App:    succeeded
My-App-Eu: succeeded
```

#### Update apps in a pipeline

```bash
$ heroku pipelines:update -s staging -a example-admin
Changing example-admin to staging... done
```

#### Remove app from a pipeline

```bash
$ heroku pipelines:remove -a example-admin
Removing example-admin... done
```

#### Rename pipeline

```bash
$ heroku pipelines:rename example www
Renaming example pipeline to www... done
```

#### Destroy pipeline

```bash
$ heroku pipelines:destroy www
Destroying www pipeline... done
```

#### Open a pipeline in Dashboard

```bash
$ heroku pipelines:open example
Opening dashboard... done
```

### TODO

* `heorku pipelines:status [-a APP | -r REMOTE]`
* `heroku pipelines:list` with repo
* `heroku pipelines:info` with full information

# quick-start

It is simple scaffolding tool for node.js. When you have your own project structure, just add `.quickstartrc` config file, scan it, and you're ready to go.

## Usage

To install:

```
npm install -g quick-start
```

To scan project:

```
quick-start -s [project name] [src]
```

To run project:

```
quick-start -n [project name] [dest]
```

## Config file

* `commands` - commands to execute after project setup
* `exclude` - files to exclude on project setup
* `scanExclude` - filter to exclude on project scanning

Example config file:

```
{
    "exclude": ["node_modules", "__tests__"],
    "scanExclude": ["something.js"],
    "commands": [
        { "cmd": "echo", "args": ["Hello world"] },
        { "cmd": "git", "args": ["init"] }
    ]
}
```

## Options

* `--git` - initialize git after project setup
* `--npm-install` - install dependencies
* `--npm-init` - initialize npm module with package.json file
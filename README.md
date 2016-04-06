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

To create new project:

```
quick-start -n [project name] [dest]
```

## Config file

* `commands` - commands to execute after project setup
* `exclude` - files to exclude on project setup
* `scanExclude` - filter to exclude on project scanning

*You can use wildcards in file names*

Example config file:

```
{
    "exclude": ["node_modules", "__tests__", "./private/**/*.js"],
    "scanExclude": ["something.js"],
    "commands": [
        { "cmd": "git", "args": ["init"] },
        { "cmd": "npm", "args": ["install"] }
    ]
}
```

## Options

* `-n, --new` - creates new project
* `-s, --scan` - scans given directory and saves it as a project
* `-l, --list` - show the list of your projects
* `-d, --delete` - deletes project

## Testing

There is `__test-env__/` directory which serves as testing environment file system. You can think of it like it is `$HOME`.
Before each `npm test` I copy whole directory into `test_env/` in order to keep same testing structure every time I run tests.
After testing, `test_env/` is removed.

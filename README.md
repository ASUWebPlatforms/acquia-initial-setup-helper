# Acquia Setup Helper (ASU)
=================

A comprehensive CLI tool that streamlines the setup process for Acquia development environments. This tool automates and guides you through the often complex process of setting up Acquia CLI, configuring SSH keys, and preparing your local development environment for Acquia Site Factory projects.


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/acquia-setup-helper.svg)](https://npmjs.org/package/acquia-setup-helper)
[![Downloads/week](https://img.shields.io/npm/dw/acquia-setup-helper.svg)](https://npmjs.org/package/acquia-setup-helper)

## Overview

The Acquia Setup Helper (ASU) was created to simplify the setup process for Acquia development environments. It provides an interactive command-line interface that guides developers through:

- **Configuration Management**: Automatically configures DDEV settings with your Acquia credentials
- **SSH Key Setup**: Checks for existing SSH keys, generates new ones if needed, and helps you add them to Acquia services
- **Repository Management**: Simplifies cloning the Acquia Site Factory repository
- **Development Environment**: Guides you through setting up a local development environment with DDEV
- **Authentication**: Streamlines the authentication process for Acquia CLI and Acquia Site Factory

This tool is especially helpful for new developers joining an Acquia Site Factory project, as it reduces the setup time from hours to minutes.

## Prerequisites

Before using this tool, you should have:

1. **Node.js**: Version 18 or higher
2. **Git**: Installed and configured with your user email
3. **DDEV**: Installed for local development environment setup
4. **Acquia Credentials**: Access to Acquia Site Factory and Acquia Cloud Platform
5. **Acquia CLI**: Installed

## Requirements

To successfully complete the setup, you'll need:

- **Acquia Site Factory Key**: From your Site Factory user API tab
- **Acquia Site Factory Username**: Your ASURITE email
- **Acquia Cloud API Client ID**: From Acquia Cloud Platform
- **Acquia Cloud API Secret**: From Acquia Cloud Platform

<!-- toc -->
* [Acquia Setup Helper (ASU)](#acquia-setup-helper-asu)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g acquia-setup-helper
$ asu-acquia-dev-setup COMMAND
running command...
$ asu-acquia-dev-setup (--version)
acquia-setup-helper/0.0.0 darwin-arm64 node-v20.15.1
$ asu-acquia-dev-setup --help [COMMAND]
USAGE
  $ asu-acquia-dev-setup COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`asu-acquia-dev-setup help [COMMAND]`](#asu-acquia-dev-setup-help-command)
* [`asu-acquia-dev-setup plugins`](#asu-acquia-dev-setup-plugins)
* [`asu-acquia-dev-setup plugins add PLUGIN`](#asu-acquia-dev-setup-plugins-add-plugin)
* [`asu-acquia-dev-setup plugins:inspect PLUGIN...`](#asu-acquia-dev-setup-pluginsinspect-plugin)
* [`asu-acquia-dev-setup plugins install PLUGIN`](#asu-acquia-dev-setup-plugins-install-plugin)
* [`asu-acquia-dev-setup plugins link PATH`](#asu-acquia-dev-setup-plugins-link-path)
* [`asu-acquia-dev-setup plugins remove [PLUGIN]`](#asu-acquia-dev-setup-plugins-remove-plugin)
* [`asu-acquia-dev-setup plugins reset`](#asu-acquia-dev-setup-plugins-reset)
* [`asu-acquia-dev-setup plugins uninstall [PLUGIN]`](#asu-acquia-dev-setup-plugins-uninstall-plugin)
* [`asu-acquia-dev-setup plugins unlink [PLUGIN]`](#asu-acquia-dev-setup-plugins-unlink-plugin)
* [`asu-acquia-dev-setup plugins update`](#asu-acquia-dev-setup-plugins-update)
* [`asu-acquia-dev-setup setup`](#asu-acquia-dev-setup-setup)

## `asu-acquia-dev-setup help [COMMAND]`

Display help for asu-acquia-dev-setup.

```
USAGE
  $ asu-acquia-dev-setup help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for asu-acquia-dev-setup.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `asu-acquia-dev-setup plugins`

List installed plugins.

```
USAGE
  $ asu-acquia-dev-setup plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ asu-acquia-dev-setup plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/index.ts)_

## `asu-acquia-dev-setup plugins add PLUGIN`

Installs a plugin into asu-acquia-dev-setup.

```
USAGE
  $ asu-acquia-dev-setup plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into asu-acquia-dev-setup.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ASU_ACQUIA_DEV_SETUP_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ASU_ACQUIA_DEV_SETUP_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ asu-acquia-dev-setup plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ asu-acquia-dev-setup plugins add myplugin

  Install a plugin from a github url.

    $ asu-acquia-dev-setup plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ asu-acquia-dev-setup plugins add someuser/someplugin
```

## `asu-acquia-dev-setup plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ asu-acquia-dev-setup plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ asu-acquia-dev-setup plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/inspect.ts)_

## `asu-acquia-dev-setup plugins install PLUGIN`

Installs a plugin into asu-acquia-dev-setup.

```
USAGE
  $ asu-acquia-dev-setup plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into asu-acquia-dev-setup.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the ASU_ACQUIA_DEV_SETUP_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ASU_ACQUIA_DEV_SETUP_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ asu-acquia-dev-setup plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ asu-acquia-dev-setup plugins install myplugin

  Install a plugin from a github url.

    $ asu-acquia-dev-setup plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ asu-acquia-dev-setup plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/install.ts)_

## `asu-acquia-dev-setup plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ asu-acquia-dev-setup plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ asu-acquia-dev-setup plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/link.ts)_

## `asu-acquia-dev-setup plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asu-acquia-dev-setup plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asu-acquia-dev-setup plugins unlink
  $ asu-acquia-dev-setup plugins remove

EXAMPLES
  $ asu-acquia-dev-setup plugins remove myplugin
```

## `asu-acquia-dev-setup plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ asu-acquia-dev-setup plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/reset.ts)_

## `asu-acquia-dev-setup plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asu-acquia-dev-setup plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asu-acquia-dev-setup plugins unlink
  $ asu-acquia-dev-setup plugins remove

EXAMPLES
  $ asu-acquia-dev-setup plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/uninstall.ts)_

## `asu-acquia-dev-setup plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ asu-acquia-dev-setup plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ asu-acquia-dev-setup plugins unlink
  $ asu-acquia-dev-setup plugins remove

EXAMPLES
  $ asu-acquia-dev-setup plugins unlink myplugin
```

## `asu-acquia-dev-setup plugins update`

Update installed plugins.

```
USAGE
  $ asu-acquia-dev-setup plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.38/src/commands/plugins/update.ts)_

## `asu-acquia-dev-setup setup`

Guide the user through Acquia CLI and Code Studio setup.

```
USAGE
  $ asu-acquia-dev-setup setup

DESCRIPTION
  Guide the user through Acquia CLI and Code Studio setup.
```

_See code: [src/commands/setup/index.ts](https://github.com/davidornelas11/acquia-setup-helper/acquia-setup-helper/blob/v0.0.0/src/commands/setup/index.ts)_
<!-- commandsstop -->

## Troubleshooting

### SSH Key Issues

If you encounter SSH-related errors when cloning the repository:
- Make sure your SSH key has been properly added to Acquia Code Studio
- Verify your SSH agent is running with `ssh-add -l`
- Try manually connecting to Acquia Git with `ssh git@gitcode.acquia.com`

### DDEV Configuration

If DDEV commands fail:
- Ensure DDEV is properly installed and in your PATH
- Check that the global config file at `~/.ddev/global_config.yaml` has the correct permissions
- Verify your Acquia credentials are correctly set in the config file

### Repository Cloning

If repository cloning fails:
- Verify you have the necessary permissions to access the repository
- Check your SSH key setup with Acquia Code Studio
- Ensure the Git URL is correct

### Acquia CLI Authentication

If authentication fails:
- Verify your Acquia Cloud API credentials
- Check your internet connection
- Ensure you have the necessary permissions on Acquia Cloud Platform

## Contributing

Contributions to improve the Acquia Setup Helper are welcome! Please feel free to submit pull requests or open issues to suggest improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
$ npm install -g acquia-setup-helper-tester
$ asu-acquia-dev-setup COMMAND
running command...
$ asu-acquia-dev-setup (--version)
acquia-setup-helper-tester/0.0.0 darwin-arm64 node-v20.15.1
$ asu-acquia-dev-setup --help [COMMAND]
USAGE
  $ asu-acquia-dev-setup COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`asu-acquia-dev-setup help [COMMAND]`](#asu-acquia-dev-setup-help-command)
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

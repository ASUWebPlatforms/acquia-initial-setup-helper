import {Command, Errors} from '@oclif/core'
import inquirer from 'inquirer'
import * as yaml from 'js-yaml'
import {spawnSync, execSync} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import chalk from 'chalk'
import terminalImage from 'terminal-image'
import {spawn} from 'node:child_process'

import {fileURLToPath} from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONSTANTS = {
  DEFAULT_ACQUIA_FACTORY_URL: 'https://www.asufactory1.acsitefactory.com',
  DEFAULT_ORGANIZATION_UUID: '8e1fbfbf-e743-48ec-b9b8-3048964ef3aa',
  GIT_REPOSITORY_URL: 'git@gitcode.acquia.com:ArizonaBoardofRegentsSiteFactoryACSFSites/asufactory1.git',
  ACQUIA_CODE_STUDIO_SSH_URL: 'https://code.acquia.com/-/user_settings/ssh_keys',
  ACQUIA_CLOUD_SSH_URL: 'https://cloud.acquia.com/a/profile/ssh-keys',
  ACQUIA_CLOUD_API_URL: 'https://profile.acquia.com/tokens',
  REPO_NAME: 'asufactory1',
}

type AcliResultSitesOutput = {
  count: string | number
  sites: Array<{
    id: number
    site: string
    domain: string
    owner: string
    db_name: string
  }>
}

export default class Setup extends Command {
  static description = 'Guide the user through Acquia CLI and Code Studio setup.'

  // Class-level constants
  static readonly SCREENSHOT_PATH = {
    ACQUIA_SF_API: (dirname: string) => path.join(dirname, '..', '..', '..', 'assets', 'acsf_example.png'),
    ACQUIA_CLOUD_API: (dirname: string) => path.join(dirname, '..', '..', '..', 'assets', 'acquia_api_example.png'),
  }

  static readonly HEADING_STYLES = {
    WELCOME: chalk.bgMagentaBright.bold.white,
    SSH_SETUP: chalk.bgCyanBright.bold.white,
    REPO_SETUP: chalk.bgYellowBright.bold.black,
    DEV_ENV_SETUP: chalk.bgCyanBright.bold.white,
    COMPLETION: chalk.bgGreenBright.bold,
  }

  private getAllSSHKeys(): Array<{name: string; path: string; content: string}> {
    const sshPath = path.join(os.homedir(), '.ssh')
    const sshKeys: Array<{name: string; path: string; content: string}> = []

    if (!fs.existsSync(sshPath)) {
      return sshKeys
    }

    try {
      const files = fs.readdirSync(sshPath)
      const publicKeyFiles = files.filter((file) => file.endsWith('.pub'))

      for (const file of publicKeyFiles) {
        const fullPath = path.join(sshPath, file)
        try {
          const content = fs.readFileSync(fullPath, 'utf8').trim()
          sshKeys.push({
            name: file,
            path: fullPath,
            content: content,
          })
        } catch (error) {
          // Skip files that can't be read
          continue
        }
      }
    } catch (error) {
      // If we can't read the .ssh directory, return empty array
      return sshKeys
    }

    return sshKeys
  }

  private hasExistingSSHKey(): boolean {
    return this.getAllSSHKeys().length > 0
  }

  private getPublicSSHKey(): string | null {
    const sshKeys = this.getAllSSHKeys()
    if (sshKeys.length === 0) {
      return null
    }

    // Return the first key found (maintaining backwards compatibility)
    return sshKeys[0].content
  }

  // Generates a new SSH key
  private generateSSHKey(): boolean {
    try {
      // Check if ssh-keygen is available
      if (!this.checkCommandAvailability('ssh-keygen')) {
        this.log(chalk.redBright('❌ ssh-keygen command not found. Please install OpenSSH or Git for Windows.'))
        return false
      }

      const sshPath = path.join(os.homedir(), '.ssh')

      // Create .ssh directory if it doesn't exist
      if (!fs.existsSync(sshPath)) {
        fs.mkdirSync(sshPath, {recursive: true})
        // Set permissions on Unix-like systems only
        if (process.platform !== 'win32') {
          try {
            fs.chmodSync(sshPath, 0o700)
          } catch (error) {
            // Ignore permission errors on systems that don't support it
          }
        }
      }

      let email = 'user@example.com'
      try {
        email = execSync('git config --get user.email', {encoding: 'utf8'}).toString().trim();
      } catch (error) {
        // Git not configured or not available, use default email
        this.log(chalk.yellow('⚠️  Could not get git user email, using default: user@example.com'))
      }

      // Construct ssh-keygen command with proper path quoting for cross-platform compatibility
      const keyPath = path.join(sshPath, 'id_ed25519')
      const sshKeygenCmd = `ssh-keygen -t ed25519 -C "${email}" -f "${keyPath}" -N ""`

      execSync(sshKeygenCmd, {stdio: 'inherit'})

      return true
    } catch (error) {
      this.log(
        chalk.redBright(`❌ Failed to generate SSH key: ${error instanceof Error ? error.message : 'Unknown error'}`),
      )
      return false
    }
  }

  private openBrowser(url: string): void {
    let command
    let args: string[] = []

    switch (process.platform) {
      case 'darwin':
        command = 'open'
        args = [url]
        break
      case 'win32':
        command = 'cmd'
        args = ['/c', 'start', '""', url]
        break
      default:
        command = 'xdg-open'
        args = [url]
        break
    }

    try {
      const child = spawn(command, args, {
        detached: true,
        stdio: 'ignore',
      })
      child.unref()
    } catch (error) {
      this.log(chalk.yellow(`Could not open browser automatically. Please visit: ${url}`))
    }
  }

  private getSSHKeyInfo(keyContent: string): {type: string; fingerprint: string; comment: string} {
    const parts = keyContent.split(' ')
    const type = parts[0] || 'unknown'
    const comment = parts[2] || 'no comment'

    // Generate a short fingerprint for display purposes
    let fingerprint = 'unknown'
    try {
      const keyData = parts[1] || ''
      if (keyData.length > 8) {
        // Show first 8 and last 8 characters of the key data
        fingerprint = `${keyData.substring(0, 8)}...${keyData.substring(keyData.length - 8)}`
      }
    } catch (error) {
      fingerprint = 'unknown'
    }

    return {type, fingerprint, comment}
  }

  private checkCommandAvailability(command: string): boolean {
    try {
      execSync(`${command} --version`, {stdio: 'ignore'})
      return true
    } catch (error) {
      return false
    }
  }

  async run(): Promise<void> {
    this.log(Setup.HEADING_STYLES.WELCOME('Welcome to the Acquia Setup Helper! 🎉'))
    const ACQUIA_SF_API_SCREENSHOT: string = Setup.SCREENSHOT_PATH.ACQUIA_SF_API(__dirname)
    const ACQUIA_CLOUD_API_SCREENSHOT: string = Setup.SCREENSHOT_PATH.ACQUIA_CLOUD_API(__dirname)
    const DEFAULT_AH_ORGANIZATION_UUID = CONSTANTS.DEFAULT_ORGANIZATION_UUID
    try {
      if (fs.existsSync(ACQUIA_SF_API_SCREENSHOT)) {
        this.log(await terminalImage.file(ACQUIA_SF_API_SCREENSHOT, {height: '75%', width: '75%'}))
      } else {
        this.log(chalk.yellow('Optional Acquia Site Factory screenshot image not found, skipping.'))
      }
    } catch (error) {
      this.log(
        chalk.yellow(
          'Could not display Acquia SIte factory screenshot image. Your terminal might not support it or the image is missing.',
        ),
      )
      // For debugging: console.error(error);
    }

    // Prompt for all required values
    const answers = await inquirer.prompt([
      {
        message: `Enter your Acquia Site Factory Key (from site factory user API tab. Url is ${CONSTANTS.DEFAULT_ACQUIA_FACTORY_URL}):`,
        name: 'ACQUIA_ACSF_KEY',
        type: 'password',
        validate: Boolean,
        mask: '*',
      },
      {
        message: 'Enter your ACQUIA SIte Factory USERNAME (ASURITE email):',
        name: 'ACQUIA_ACSF_USERNAME',
        type: 'input',
        validate: Boolean,
      },
      {
        message: async () => {
          this.log(await terminalImage.file(ACQUIA_CLOUD_API_SCREENSHOT, {height: '75%', width: '75%'}))
          return `Enter your Acquia Cloud API Client ID (from Acquia Cloud Platform. See screenshot above for reference or click here ${CONSTANTS.ACQUIA_CLOUD_API_URL}):`
        },
        name: 'ACQUIA_API_KEY',
        type: 'input',
        validate: Boolean,
      },
      {
        message: 'Enter your ACQUIA_API_SECRET (from Acquia Cloud Platform):',
        name: 'ACQUIA_API_SECRET',
        type: 'password',
        validate: Boolean,
        mask: '*',
      },
      {
        message: 'Enter your ACQUIA_FACTORY_URL (site factory URL) or accept default:',
        name: 'ACQUIA_FACTORY_URL',
        type: 'input',
        validate: Boolean,
        default: CONSTANTS.DEFAULT_ACQUIA_FACTORY_URL,
      },
      {
        message: 'AH_ORGANIZATION_UUID set to 8e1fbfbf-e743-48ec-b9b8-3048964ef3aa. Continue?',
        name: 'AH_ORGANIZATION_UUID',
        type: 'confirm',
      },
      // TODO: Add a section to list sites you have access to. Might be added after the git pull section?
      // {
      //   message:
      //     'If you are in the directory of where you want to pull in a site, would you like to list all the aliases?',
      //   name: 'LIST_ORGANIZATIONS',
      //   type: 'confirm',
      // },
    ])

    // Path to global_config.yaml
    const ddevDir = path.join(os.homedir(), '.ddev')
    const configPath = path.join(ddevDir, 'global_config.yaml')

    // Ensure .ddev directory exists
    if (!fs.existsSync(ddevDir)) {
      fs.mkdirSync(ddevDir)
    }

    // Read or initialize config
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let config: any = {}
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8')
      config = yaml.load(fileContents) || {}
    }

    // Update web_environment
    // eslint-disable-next-line camelcase
    config.web_environment = [
      `ACQUIA_ACSF_KEY=${answers.ACQUIA_ACSF_KEY}`,
      `ACQUIA_ACSF_USERNAME=${answers.ACQUIA_ACSF_USERNAME}`,
      `ACQUIA_API_KEY=${answers.ACQUIA_API_KEY}`,
      `ACQUIA_API_SECRET=${answers.ACQUIA_API_SECRET}`,
      `ACQUIA_FACTORY_URL=${answers.ACQUIA_FACTORY_URL}`,
      `AH_ORGANIZATION_UUID=${answers.AH_ORGANIZATION_UUID ? DEFAULT_AH_ORGANIZATION_UUID : ''}`,
    ]

    // Write back to YAML
    const isDebug = process.argv.includes('--debug') || process.argv.includes('-d')

    if (isDebug) {
      this.log(chalk.magentaBright('[DEBUG] Writing config to:'), configPath)
      this.log(chalk.magentaBright('[DEBUG] Config content:'), yaml.dump(config))
    }

    if (!isDebug) {
      fs.writeFileSync(configPath, yaml.dump(config), 'utf8')
      this.log(chalk.greenBright(`Updated ${configPath} with your Acquia credentials.`))
    }

    /*---- SSH key setup section ----*/
    this.log(chalk.bgCyanBright.bold.white('\n🔑 SSH Key Setup for Acquia Services 🔑'))

    // Check if user has an existing SSH key
    let hasKey = this.hasExistingSSHKey()
    if (!hasKey) {
      const {generateKey} = await inquirer.prompt({
        default: true,
        message: 'No SSH key found. Would you like to generate a new SSH key?',
        name: 'generateKey',
        type: 'confirm',
      })

      if (generateKey) {
        this.log(chalk.cyan('Generating new SSH key...'))
        hasKey = this.generateSSHKey()
        if (hasKey) {
          this.log(chalk.greenBright('✅ SSH key generated successfully!'))
        } else {
          this.log(chalk.redBright('❌ Failed to generate SSH key. Please generate it manually using ssh-keygen.'))
        }
      }
    }

    // Display the public key if it exists
    if (hasKey) {
      const allSSHKeys = this.getAllSSHKeys()

      if (allSSHKeys.length === 1) {
        // If only one key, display it directly
        const publicKey = allSSHKeys[0].content
        this.log(chalk.yellowBright(`\nYour public SSH key (${allSSHKeys[0].name}):`))
        this.log(chalk.bgBlackBright.white(publicKey))
        this.log(chalk.yellowBright('\nCopy the above key to add to Acquia services.'))
      } else if (allSSHKeys.length > 1) {
        // If multiple keys, let user choose
        this.log(chalk.yellowBright(`\nFound ${allSSHKeys.length} SSH keys:`))

        // Display all available keys with brief info
        allSSHKeys.forEach((key, index) => {
          const {type, fingerprint, comment} = this.getSSHKeyInfo(key.content)
          this.log(chalk.gray(`  ${index + 1}. ${key.name} (${type}) - ${comment} (Fingerprint: ${fingerprint})`))
        })

        const {selectedKeyIndex} = await inquirer.prompt({
          type: 'list',
          name: 'selectedKeyIndex',
          message: 'Which SSH key would you like to display and use?',
          choices: allSSHKeys.map((key, index) => {
            const {type, fingerprint, comment} = this.getSSHKeyInfo(key.content)
            return {
              name: `${key.name} (${type}) - ${comment} (Fingerprint: ${fingerprint})`,
              value: index,
            }
          }),
        })

        const selectedKey = allSSHKeys[selectedKeyIndex]
        this.log(chalk.yellowBright(`\nSelected SSH key (${selectedKey.name}):`))
        this.log(chalk.bgBlackBright.white(selectedKey.content))
        this.log(chalk.yellowBright('\nCopy the above key to add to Acquia services.'))
      }

      // Add ssh key to current agent
      this.log(chalk.cyan('Adding SSH key to current SSH agent...'))
      // Remove ".pub" extension to get the private key path
      const privateKeyPath = allSSHKeys[0].path.replace(/\.pub$/, '')
      const addKeyResult = spawnSync('ssh-add', [privateKeyPath], {stdio: 'inherit'})
      if (addKeyResult.error || addKeyResult.status !== 0) {
        this.log(
          chalk.redBright(`❌ Error adding SSH key: ${addKeyResult.error?.message || 'Exit code: ' + addKeyResult.status}`),
        )
        this.log(chalk.yellow('Make sure your SSH agent is running and try again.'))
        Errors.exit(1)
      } else {
        this.log(chalk.greenBright('✅ SSH key added to current SSH agent successfully!'))
      }

      if (allSSHKeys.length > 0) {
        // Prompt to open SSH key management pages in browser
        const {openAcquiaCodeStudio} = await inquirer.prompt({
          default: true,
          message: 'Would you like to open Acquia Code Studio SSH key management page in your browser?',
          name: 'openAcquiaCodeStudio',
          type: 'confirm',
        })

        if (openAcquiaCodeStudio) {
          this.log(chalk.cyan('Opening Acquia Code Studio SSH key management page...'))
          this.openBrowser(CONSTANTS.ACQUIA_CODE_STUDIO_SSH_URL)
        }

        const {openAcquiaCloud} = await inquirer.prompt({
          default: true,
          message: 'Would you like to open Acquia Cloud SSH key management page in your browser?',
          name: 'openAcquiaCloud',
          type: 'confirm',
        })

        if (openAcquiaCloud) {
          this.log(chalk.cyan('Opening Acquia Cloud SSH key management page...'))
          this.openBrowser(CONSTANTS.ACQUIA_CLOUD_SSH_URL)
        }
      }
    }
    /*---- End SSH key setup section ----*/

    /*---- Repository cloning section ----*/
    this.log(chalk.bgYellowBright.bold.black('\n📦 Repository Setup 📦'))

    // Ask if they want to clone the repository
    const {cloneRepo} = await inquirer.prompt({
      default: true,
      message: 'Would you like to clone the Acquia Site Factory repository?',
      name: 'cloneRepo',
      type: 'confirm',
    })

    let repoPath = ''
    if (cloneRepo) {
      // Check if git is available
      if (!this.checkCommandAvailability('git')) {
        this.log(chalk.redBright("❌ Git command not found. Please install Git and ensure it's in your PATH."))
        this.log(chalk.yellow('You can download Git from: https://git-scm.com/downloads'))
        return
      }

      // Get current directory
      const currentDir = process.cwd()

      // Ask for the directory to clone into
      const {cloneDir} = await inquirer.prompt({
        default: currentDir,
        message: 'Where would you like to clone the repository? (current location: ' + currentDir + ')',
        name: 'cloneDir',
        type: 'input',
        validate: (input) => Boolean(input) || 'Please provide a valid directory path',
      })

      // Clone the repository
      this.log(chalk.cyan(`Cloning repository to ${cloneDir}...`))
      const repoDestination = path.join(cloneDir, CONSTANTS.REPO_NAME)
      const cloneResult = spawnSync('git', ['clone', CONSTANTS.GIT_REPOSITORY_URL, repoDestination], {stdio: 'inherit'})

      if (cloneResult.error || cloneResult.status !== 0) {
        this.log(
          chalk.redBright(
            `Error cloning repository: ${cloneResult.error?.message || 'Exit code: ' + cloneResult.status}`,
          ),
        )
        this.log(chalk.yellow('Make sure your SSH key is properly set up with Acquia Code Studio.'))
        Errors.exit(1)
      } else {
        this.log(chalk.greenBright('✅ Repository cloned successfully!'))
        repoPath = path.join(cloneDir, CONSTANTS.REPO_NAME)

        // Change to the repository directory for further commands
        process.chdir(repoPath)

        // Now run the ddev and acli commands in the context of the cloned repository
        this.log(chalk.bgCyanBright.bold.white('\n🛠️ Setting up development environment 🛠️'))

        // Check for ddev availability
        const hasDdev = this.checkCommandAvailability('ddev')
        if (!hasDdev) {
          this.log(chalk.yellow('⚠️  DDEV not found. Please install DDEV from: https://ddev.readthedocs.io/en/stable/'))
          Errors.exit(1)
        }

        // Check for acli availability
        const hasAcli = this.checkCommandAvailability('acli')
        if (!hasAcli) {
          this.log(
            chalk.yellow('⚠️  Acquia CLI not found. Please install Acquia CLI from: https://github.com/acquia/cli'),
          )
          Errors.exit(1)
        }

        if (hasDdev) {
          const {setupDdevConfig} = await inquirer.prompt({
            default: true,
            message: 'Would you like to set up DDEV configuration for this repository?',
            name: 'setupDdevConfig',
            type: 'confirm',
          })

          if (setupDdevConfig) {
            this.log(chalk.cyan('Setting up DDEV configuration...'))
            const result = spawnSync('ddev', ['config'], {
              cwd: repoPath,
              stdio: 'inherit',
            })
            if (result.error || result.status !== 0) {
              this.log(
                chalk.redBright(`Error running ddev config: ${result.error?.message || 'Exit code: ' + result.status}`),
              )
              Errors.exit(1)
            } else {
              this.log(chalk.greenBright('✅ DDEV configuration set up successfully!'))
            }
          }

          const {runDdevAuth} = await inquirer.prompt({
            default: true,
            message: 'Would you like to run "ddev auth ssh" now?',
            name: 'runDdevAuth',
            type: 'confirm',
          })

          if (runDdevAuth) {
            this.log(chalk.cyanBright('Running: ddev auth ssh'))
            const result = spawnSync('ddev', ['auth', 'ssh'], {stdio: 'inherit'})
            if (result.error) {
              this.log(chalk.redBright(`Error running ddev auth ssh: ${result.error.message}`))
              Errors.exit(1)
            }
          }
        }

        if (hasAcli) {
          const {runAcliLogin} = await inquirer.prompt({
            default: true,
            message: 'Would you like to run "acli auth:login" now?',
            name: 'runAcliLogin',
            type: 'confirm',
          })

          if (runAcliLogin) {
            this.log(chalk.cyan('Running: acli auth:login'))
            const result = spawnSync('acli', ['auth:login'], {stdio: 'inherit'})
            if (result.error) {
              this.log(chalk.redBright(`Error running acli auth:login: ${result.error.message}`))
            }
          }

          // TODO: Do we need to run acli auth:acsf-login?
          // const {runAcliAcsfLogin} = await inquirer.prompt({
          //   default: true,
          //   message: 'Would you like to run "acli auth:acsf-login" now?',
          //   name: 'runAcliAcsfLogin',
          //   type: 'confirm',
          // })

          // if (runAcliAcsfLogin) {
          //   this.log(chalk.cyan('Running: acli auth:acsf-login'))
          //   const result = spawnSync('acli', ['auth:acsf-login'], {stdio: 'inherit'})
          //   if (result.error) {
          //     this.log(chalk.redBright(`Error running acli auth:acsf-login: ${result.error.message}`))
          //   }
          // }
        }

        // Ask about additional setup steps that might be needed for the repository
        if (hasDdev) {
          const {runDdevStart} = await inquirer.prompt({
            default: true,
            message: 'Would you like to run "ddev start" to initialize the local development environment?',
            name: 'runDdevStart',
            type: 'confirm',
          })

          if (runDdevStart) {
            this.log(chalk.cyan('Running: ddev start'))
            const result = spawnSync('ddev', ['start'], {stdio: 'inherit'})
            if (result.error) {
              this.log(chalk.redBright(`Error running ddev start: ${result.error.message}`))
            } else {
              this.log(chalk.greenBright('✅ Local development environment started!'))
            }
          }
        }

        const {listSites} = await inquirer.prompt({
          default: true,
          message: 'Would you like to list all sites you have access to in Acquia Site Factory?',
          name: 'listSites',
          type: 'confirm',
        })

        if (listSites) {
          this.log(chalk.cyan('Fetching available sites from Acquia Site Factory...'))
          const result = spawnSync('acli', ['acsf:sites:find', '--limit=250'], {
            stdio: ['inherit', 'pipe', 'inherit']
          })
          
          if (result.error || result.status !== 0) {
            this.log(chalk.redBright(`Error fetching sites: ${result.error?.message || 'Exit code: ' + result.status}`))
          } else {
            try {
              const output = result.stdout.toString('utf8')
              const sitesData: AcliResultSitesOutput = JSON.parse(output)
              
              if (sitesData.sites && Array.isArray(sitesData.sites)) {
                this.log(chalk.greenBright(`✅ Found ${sitesData.sites.length} sites!`))
                
                // Extract site information for selection
                const siteChoices = sitesData.sites.map((site: any) => ({
                  name: `${site.site} (${site.domain})`,
                  value: site.site,
                }))
                
                // First ask if they want to search/filter
                const {useFilter} = await inquirer.prompt({
                  type: 'confirm',
                  name: 'useFilter',
                  message: `Found ${siteChoices.length} sites. Would you like to filter by site name first?`,
                  default: true
                })
                
                let filteredChoices = siteChoices;
                
                if (useFilter) {
                  const {filterTerm} = await inquirer.prompt({
                    type: 'input',
                    name: 'filterTerm',
                    message: 'Enter search term to filter sites (e.g., "visitasu"):',
                    validate: (input) => input.length > 0 || 'Please enter at least one character'
                  })
                  
                  // Filter the choices based on the search term
                  filteredChoices = siteChoices.filter((choice: any) => 
                    choice.value.toLowerCase().includes(filterTerm.toLowerCase()) ||
                    choice.name.toLowerCase().includes(filterTerm.toLowerCase())
                  )
                  
                  if (filteredChoices.length === 0) {
                    this.log(chalk.yellow(`No sites found matching "${filterTerm}". Showing all sites.`))
                    filteredChoices = siteChoices
                  } else {
                    this.log(chalk.green(`Found ${filteredChoices.length} sites matching "${filterTerm}"`))
                  }
                }
                
                // Use regular list prompt with filtered choices
                const {selectedSite} = await inquirer.prompt({
                  type: 'list',
                  name: 'selectedSite',
                  message: 'Select a site to work with:',
                  choices: filteredChoices,
                  pageSize: 10  // Show 10 items at a time
                })
                
                this.log(chalk.greenBright(`✅ Selected site: ${selectedSite}`))
                
                this.log(chalk.cyan('Initializing DDEV ASU SF configuration...'))
                const initResult = spawnSync('ddev', ['asusf:init'], {
                  cwd: repoPath,
                  stdio: 'inherit'
                })
                
                if (initResult.error || initResult.status !== 0) {
                  this.log(chalk.redBright(`Error running ddev asusf:init: ${initResult.error?.message || 'Exit code: ' + initResult.status}`))
                  return
                } else {
                  this.log(chalk.greenBright('✅ DDEV ASU SF initialized successfully!'))
                }
                
                this.log(chalk.cyan(`Pulling site: ${selectedSite}...`))
                const pullSiteResult = spawnSync('ddev', ['asusf:pull', selectedSite], {
                  cwd: repoPath,
                  stdio: 'inherit',
                })
                if (pullSiteResult.error || pullSiteResult.status !== 0) {
                  this.log(chalk.redBright(`Error pulling site: ${pullSiteResult.error?.message || 'Exit code: ' + pullSiteResult.status}`))
                } else {
                  this.log(chalk.greenBright(`✅ Successfully pulled site: ${selectedSite}`))
                }
                
              } else {
                this.log(chalk.yellow('⚠️  No sites found or unexpected response format'))
              }
              
            } catch (parseError) {
              this.log(chalk.redBright('❌ Failed to parse sites data. Make sure you are logged in to Acquia CLI.'))
              this.log(chalk.gray('Raw output:', result.stdout.toString('utf8')))
            }
          }
        }
      }
    }

    /*---- End Repository cloning section ----*/

    this.log(chalk.bgGreenBright.bold('✨ Setup complete! ✨'))
  }
}

Ultimate Hacking Keyboard electronics
=====================================

[![Changelog #186](https://img.shields.io/badge/changelog-%23186-lightgrey.svg)](https://changelog.com/186)

Contained are the schematics and board layout KiCad files for the [Ultimate Hacking Keyboard](https://ultimatehackingkeyboard.com/).

# Contributing

Thanks for being willing to contribute to the Ultimate Hacking Keyboard!

Considerations:

- Please make changes on a new feature branch inside your fork (not master)

## Validation

Ensure that the design rules checks pass. The button looks like this:

![](https://www.dropbox.com/s/hjh96bu8io5f3u8/Screenshot%202015-12-23%2013.12.04.png?dl=1)

Errors will be displayed below

![](https://www.dropbox.com/s/atjm122jz3q8hv6/Screenshot%202015-12-23%2015.29.48.png?dl=1)

## Visualizing Changes

Before opening the merge request, please run the `generate-png-diff.sh` script located in the `scripts` directory.
generate-png-diff.sh will automatically a directory named `plots` and generate about a dozen plots of the pcb 'before' and 'after' the change.

**Please include some of the diffs inside the comment section of github**

```bash
# Assuming you are on a linux system (OSX and Windows users, see Vagrant instructions below)
./scripts/generate-png-diff.sh
```

The script takes zero, one or two git references to compare against. Arguments can be short/long git refs, branches, or tags. Providing no argument is the same as running `generate-png-diff.sh $(git rev-parse --short HEAD)`

e.g
`./scripts/generate-png-diff.sh`

`./scripts/generate-png-diff.sh 123456` # Compare current changes against git commit 123456

`./scripts/generate-png-diff.sh 67890 123456` # Compare git commit 67890 against git commit 123456

`./scripts/generate-png-diff.sh master`

`./scripts/generate-png-diff.sh $(git rev-parse HEAD^1)`

For those who are running OSX / Windows, a Vagrantfile is provided to create an ubuntu 14.04 VM with a shared directory of: `/vagrant`

- Install [Vagrant](https://www.vagrantup.com/)
- Install Virtualbox or VMWare Player

```bash
vagrant up
vagrant ssh

cd /vagrant
./scripts/1-add-repos.sh
./scripts/2-install-dependencies.sh
./scripts/generate-png-diff.sh
```

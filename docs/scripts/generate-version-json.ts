/* eslint-disable ts/no-restricted-types */
/* eslint-disable unicorn/no-null */

import { execa } from 'execa'
import { readPackageUp } from 'read-package-up'
import { parse } from 'semver'

type GitInfo = {
	branch: null | string
	commit: null | string
	commitDate: null | string
	tag: null | string
}

async function getGitInfo(): Promise<GitInfo> {
	const info: GitInfo = {
		branch: null,
		commit: null,
		commitDate: null,
		tag: null,
	}

	try {
		// Get the most recent tag
		const { stdout: tag } = await execa('git', ['describe', '--tags', '--abbrev=0'])
		info.tag = tag
	} catch {
		// If tag retrieval fails, tag will remain null
	}

	try {
		// Always try to get the short commit hash
		const { stdout: hash } = await execa('git', ['rev-parse', '--short', 'HEAD'])
		info.commit = hash
	} catch {
		// If commit hash retrieval fails, it will remain null
	}

	try {
		// Get the current branch name
		const { stdout: branch } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
		info.branch = branch
	} catch {
		// If branch retrieval fails, it will remain null
	}

	try {
		// Get the date of the latest commit
		const { stdout: commitDate } = await execa('git', ['log', '-1', '--format=%cI'])

		const date = new Date(commitDate.trim())
		info.commitDate = date.toISOString()
	} catch {
		// If last commit date retrieval fails, it will remain null
	}

	return info
}

type PackageInfo = {
	name: null | string
	version: null | string
}

async function getPackageInfo(): Promise<PackageInfo> {
	const packageInfo: PackageInfo = {
		name: null,
		version: null,
	}

	const info = await readPackageUp()
	if (info) {
		packageInfo.name = info.packageJson.name
		packageInfo.version = info.packageJson.version
	}

	return packageInfo
}

const packageInfo = await getPackageInfo()
const parsedVersion = parse(packageInfo.version)

const versionJson = {
	date: new Date().toISOString(),
	deployment: parsedVersion?.prerelease.length === 0 ? 'main' : 'preview',
	git: await getGitInfo(),
	package: packageInfo,
}

console.log(JSON.stringify(versionJson, undefined, 2))

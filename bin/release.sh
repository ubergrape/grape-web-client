#!/bin/bash

if [ -z "$1" ]; then
    echo "Please supply the version to be released as first argument"
    echo "e.g. ./bin/release.sh 4.0.0"
    exit 1
fi

release_version=$1

# make sure we have clean git working directory
if [ -z "$(git status --porcelain)" ]; then
    echo "Working directory clean."
else
    echo "Uncommitted changes in git. Please stash or commit them first."
    exit 1
fi

# set env vars for untis, based on version name
# note: double brackets "if" is bash specific syntax
if [[ $release_version == *"unicorn"* ]]; then
    echo "Releasing unicorn version"
    export THEME='unicorn'
    export PRODUCT_NAME='Untis Messenger'
fi

# inform user about current and release version
current_version=$(cat package.json | jq ".version" --raw-output)
echo "Current version: $current_version"
echo "Release version: $release_version"

# check for some edge cases and ask user for confirmation before continuing
if [ "${release_version}" = "${current_version}" ]; then
    npm_version=$(npm show grape-web-client version)

    if [ "${release_version}" = "${npm_version}" ]; then
        echo "You have already published this version to npm. You can't change a published version."
        exit 1
    else
        echo "You have already created this version but not published to npm yet. We will build the version again and publish it."
        echo "Press any key to continue"
        read -n 1
    fi
else
    echo "You are creating a new version."
    echo "Press any key to continue"
    read -n 1
    echo "Creating new version..."
    npm version $release_version
fi

echo "Deleting node_modules..."
rm -rf node_modules

echo "Downloading everything again..."
yarn

echo "Building..."
yarn build

echo "Publishing the new version on npm..."
npm publish

echo "Pushing changes and tags to git origin"
git push
git push origin v$release_version

echo "Done."

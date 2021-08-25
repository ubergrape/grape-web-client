#!/bin/bash

if ! hash jq 2>/dev/null; then
    echo "jq is not installed. Please install it"
    echo "https://stedolan.github.io/jq/download/"
    exit 1
fi

for i in "$@"; do
    case $i in
        -f|--force)
        force=YES
        shift # past argument with no value
        ;;
        *)
              # unknown option
        ;;
    esac
done

if [ -z "$1" ]; then
    echo "Please supply the version to be released as first argument"
    echo "e.g. ./bin/release.sh 4.0.0"
    exit 1
fi

release_version=$1

# make sure we are logged in to npm
npm_user=$(npm whoami 2>/dev/null)
if [ $? == 0 ]; then
    echo "Logged in to npm with user: ${npm_user}"
else
    echo "You are not logged in to npm. Run 'npm adduser' to login"
    exit 1
fi


# make sure we have clean git working directory
if [ -z "$(git status --porcelain)" ]; then
    echo "Working directory clean."
elif [ "$force" = YES ]; then
    echo "Uncommitted changes in git. Continuing anyway"
else
    echo "Uncommitted changes in git. Please stash or commit them first."
    echo "You can also force it with --force but this is dangerous, npm will probably fail to create a new tag in git and fail to make a commit for the new version."
    echo "e.g. ./bin/release.sh --force 4.0.0"
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
    if [ "$force" = YES ]; then
        npm version $release_version --force
    else
        npm version $release_version
    fi
fi

echo "Deleting node_modules..."
rm -rf node_modules

echo "Downloading everything again..."
yarn

echo "Building..."
yarn build

echo "Publishing the new version on npm..."
npm publish

echo "Committing version number changes and tags to git"
git diff

echo ""
echo "Press any key to continue"
read -n 1

git package.json
git commit -m "v$release_version"
git tag v$release_version

echo "Pushing git changes to remote"
git push
git push origin v$release_version

echo "Done."

#!/usr/bin/env bash
set -ex

DIR_BOOKWORM=~/personal/bookworm-pinned
DIR_BOOKWORM_DIST=~/personal/bookworm-pinned/dist/bookworm
DIR_BOOKWORM_GHPAGES=~/personal/bookworm-pinned.gh-pages

PACKAGE_VERSION=$(node -p "require('./package.json').version")


cd $DIR_BOOKWORM
npx ng build --prod --base-href "https://prendradjaja.github.io/bookworm-pinned/"

rm -f $DIR_BOOKWORM_GHPAGES/*
cp $DIR_BOOKWORM_DIST/* $DIR_BOOKWORM_GHPAGES

cd $DIR_BOOKWORM_GHPAGES

git add .
git commit -m "$PACKAGE_VERSION(+)"
git show --name-status
git push

#!/usr/bin/env bash
set -ex

DIR_BOOKWORM=~/personal/bookworm-2
DIR_BOOKWORM_ANGULAR=~/personal/bookworm-2/friendlog-web
DIR_BOOKWORM_DIST=~/personal/bookworm-2/friendlog-web/dist/friendlog-web
DIR_BOOKWORM_GHPAGES=~/personal/bookworm-2.gh-pages

PACKAGE_VERSION=$(node -p "require('./package.json').version")


cd $DIR_BOOKWORM_ANGULAR
npx ng build --prod --base-href "https://prendradjaja.github.io/bookworm/"

rm -f $DIR_BOOKWORM_GHPAGES/*
cp $DIR_BOOKWORM_DIST/* $DIR_BOOKWORM_GHPAGES

cd $DIR_BOOKWORM_GHPAGES

git add .
git commit -m "$PACKAGE_VERSION(+)"
git show --name-status
git push

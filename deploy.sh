#!/usr/bin/env bash
set -ex

DIR_BOOKWORM=~/personal/bookworm-2
DIR_BOOKWORM_ANGULAR=~/personal/bookworm-2/friendlog-web
DIR_BOOKWORM_DIST=~/personal/bookworm-2/friendlog-web/dist/friendlog-web
DIR_BOOKWORM_GHPAGES=~/personal/bookworm-2.gh-pages

cd $DIR_BOOKWORM_ANGULAR
npx ng build --prod --base-href "https://prendradjaja.github.io/bookworm/"

rm -f $DIR_BOOKWORM_GHPAGES/*
cp $DIR_BOOKWORM_DIST/* $DIR_BOOKWORM_GHPAGES

set +x

echo
echo Done. Now:
echo - cd to $DIR_BOOKWORM_GHPAGES
echo - commit and push

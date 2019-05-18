#!/usr/bin/env bash
set -ex

DIR_BOOKWORM=~/personal/bookworm-2
DIR_BOOKWORM_DIST=~/personal/bookworm-2/dist/bookworm
DIR_BOOKWORM_FIREBASE=~/personal/bookworm-2.firebase-hosting/public

COMMIT_HASH=$(git rev-parse --short=7 HEAD)


cd $DIR_BOOKWORM
npx ng build --prod --base-href "https://bookworm-232006.firebaseapp.com/"

rm -f $DIR_BOOKWORM_FIREBASE/*
cp $DIR_BOOKWORM_DIST/* $DIR_BOOKWORM_FIREBASE

cd $DIR_BOOKWORM_FIREBASE
echo Built from commit $COMMIT_HASH.
echo Next: firebase deploy

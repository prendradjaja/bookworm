## 2/17: DRY? What's that?

**v0.1.0:** Forked my
[Friendlog](https://github.com/prendradjaja/friendlog-web) project and
basically just search-and-replaced to turn it into a reading tracker. It
feels a little silly because there's so much duplicate code (and parallel
changes I'll be making in both), but I think while there is a lot in common
in these project now, they'll end up diverging and it doesn't really make
sense to abstract (make reusable) much of any of this stuff.

**v0.1.1:** Oops, I didn't update the "New Entry" link.

**v0.1.2:** Color-coded book titles! This is pretty ugly, but functional for
now.

I also now have easier deploys with `deploy.sh`!

**v0.1.3:** Changed colors to be more distinguishable from Friendlog.

**v0.1.4:** Small tweak: Moved page numbers to same row as book title. (Easier
deploys encourage me to make small tweaks!)

**v0.1.5:** Added some AWFUL caching that comes with some new tech debt:

- [ ] Use Observable instead of this silly get/getCached thing
- [ ] \(Probably will get handled when I do the above) Dedupe repeated code in get/getCached etc

## 3/7

**v0.1.6:** Added FAB -- and it's smart, it guesses which book you want!

- When not filtering, use the first book
- When filtering, use the book you're filtering by (which, of course, will also be the first book)

**v0.1.7:** Add GitHub link

## 3/9-15

**v0.1.8:**

- Favicon
- Calendar view

## 3/15

**v0.1.9:**

- Calendar: Two colors in one day!
- Calendar: End-of-book marker (p ugly rn but w/e)

**v0.1.10:** End-of-book marker style

**v0.1.11:** Color service

## 3/18-24

**v0.1.12:**

- Line break support (both paragraphs and newlines, unlike Friendlog)
- Fix z-index bug for multi-book days
- Changing filter removes "active calendar day" styling
    - I wonder why I then had to do `.toString()` comparison in the <calendar-view> template instead of `===` like before. Or why didn't `==` work? Check 7e3d8ab
- Prefill "Other"
    - there's no easy way to tell if it's an "Other" or not, and it doesn't really matter if I just assume everything's an Other, so I did that.
- Placeholder for 3+ colors

## 3/24

- Learned: For Services and other `@Injectable`s, initialization happens in ctor not oninit https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
- Tried using a color palette instead of hash colors, but my color palette was ugly and I still don't know how I would deal with collisions (maybe manual reassignment, just like with hashing?). I have some almost-usable code if I ever want to come up with a better color palette, though.

**v0.1.13:**

- Left border
- Manually reassign color for title "The Gamer" -- too close to "Norse Mythology"

**v0.1.14:** Custom colors!

## 3/25

**v0.1.15:** Top color (for 2-book days) is the first book

## 3/27

**v0.1.16:** Fix directory structure


----

Next (meta):
- [ ] Move inline todos into this list
- [ ] If I document exactly how to repro the font size changing bug, I can defer fixing it and immediately do max-width 400

Next (refactor/cleanup):
- [x] Prettier all .ts
- [ ] Prettier all .scss
- [ ] Can I prettier .html?
- [ ] makeDay could be simpler
- [ ] Sizes and colors
- [ ] Calendar styles are getting out of hand (z indexes!!!)
- [ ] Rename event card
- [ ] Remove app prefix from selectors

Next (main):
- [ ] Calendar: Don't show future dates (like GitHub commit graph)
- [ ] "When" support
- [x] Colors: Manually choose all? Use a palette? (WIP branch: `color-palette`) Palette is probably harder, maybe not needed
- [ ] Better handling for light colors
- [ ] Group repeated similar posts
- [ ] Keep all URLs secret (like Friendlog)
    - [ ] And then link to responses sheet
- [ ] Font size changing bug (And don't do max-width 400 until you figure that out)
- [x] Line break support
- [x] Rethink fab color when filtering by date. (Maybe: Fab color code remains unchanged, but change multi-color days so the top color is the most recent entry?)
- [ ] Remove "New entry"?
- [ ] Book cover images

Next (big):
- [ ] My own backend
- [ ] My own data entry
- [ ] Offline mode with Session Workers or App Cache
- [ ] TOC checklist
- [ ] Integrate page mapper

Next (infra):
- [x] Prettier
- [ ] Show version number and/or commit hash

Next (requires my own data entry and/or backend):
- [ ] Offline mode with Session Workers or App Cache

Wishlist:
- [ ] Integrate Twilio or something for SMS
- [ ] Camera & OCR

See also [ARCHIVE.md](./ARCHIVE.md)

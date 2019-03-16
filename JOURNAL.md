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

----

Next (features):
- [x] Calendar view (`calendar` branch)
    - [ ] Multi-book days
    - [x] If no book, gray fab
- [ ] Keep all URLs secret (like Friendlog)
    - [ ] And then link to responses sheet
- [ ] Offline mode with Session Workers or App Cache
- [ ] After creating a new entry, auto-reload until updated
- [ ] Group by date/book/etc
- [ ] Integrate page mapper
- [ ] Tap anywhere on a card to filter?
- [x] Smart FAB (The color of the most recently read book [or the book you're filtering by] -- this indicates that you're creating an entry for that book specifically)
    - [ ] Prefill with last read page
- [ ] Figure out what's up with the font size changing thing (And don't do max-width 400 until you figure that out)
- [ ] Streak graph

Next (requires my own data entry and/or backend):
- [ ] Offline mode with Session Workers or App Cache

Feature wishlist:
- [ ] Integrate Twilio or something for SMS
- [ ] Camera & OCR

Next (infra):
- [x] Almost one-button deploy

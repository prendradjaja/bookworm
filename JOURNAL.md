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

----

Next (features):
- [ ] After creating a new entry, auto-reload until updated
- [ ] Group by date/book/etc
- [ ] Integrate page mapper
- [ ] FAB
- [ ] max-width 400

Feature wishlist:
- [ ] Integrate Twilio or something for SMS
- [ ] Camera & OCR

Next (infra):
- [x] Almost one-button deploy

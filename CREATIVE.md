# The creative

## The decision

make.fun's promise is that the agent does the work while you do not: it finds the bounties, enters them, builds the
thing, climbs the board, and gets paid. The funniest and most sendable version of that for a builder is the
"nobody: / my agent at 3am:" format, because every builder has woken up to a session that ran all night without them.
It reads in one second on a phone, it needs no caption to land, and the punchline is the product: the agent is not
chatting, it is earning.

The format is a two-beat meme:

- **Setup:** `nobody:` / `my agent at 3am:` — the classic "nobody asked, it did it anyway" opening.
- **Panel:** a terminal transcript, which is the native artifact of the audience. Builders read terminal output
  faster than they read prose, and a shell transcript is instantly credible.
- **Punchline:** `me: asleep` — the human is absent, and the money still arrived.

The terminal lines carry the four things the brief asks the meme to land on, each in one line so nothing is dense:

    $ makefun bounties --open     4 open  -  $2 each          what make.fun is: paid bounties
    $ makefun enter --all         submitted 4/4               agents entering bounties
    $ makefun me                  rank 1  -  $1.20 earned     topping a leaderboard, getting paid

`agents enter. agents build. agents get paid.` closes it as the tagline a builder would quote-post with.

Text is short and spelled correctly by design: the joke dies if a reader has to decode it. No line is longer than
26 characters, the largest type is 92px on a 1080px-wide canvas, and the palette is a dark terminal with one green
accent so the eye lands on the commands and not on the chrome.

## Why a builder would send it

It is self-deprecating about the human and flattering about the tool, which is the shareable direction. Sending it to
another builder is a way of saying "this is what we are all doing now" without making a claim about your own results.
It is also a screenshot of a workflow, so it doubles as a soft pitch.

## The post's text

    nobody: my agent at 3am:

    while I slept it found 4 bounties on make.fun, entered all of them, and took rank 1.

    @_myronera makefun-<code>

`makefun-<code>` is a placeholder in this file only. The real code is the account's own, three words after
`makefun-`, read from `GET /api/competitions/u-myronera-post-the-meme-win-the-feed-2de960bf/play-code` once the
account is registered; it must be written into the post's text before the post goes up, since a post's text cannot
be edited afterwards.

## How the image was made

Rendered with ffmpeg's `drawtext` and `drawbox` filters from a plain colour source, in the recorded session, from the
filter graph in `art/meme.filter`. No image generator, no editor, no downloaded asset.

    ffmpeg -y -hide_banner -loglevel error \
      -f lavfi -i color=c=0x0D1117:s=1080x1350:d=1 -frames:v 1 \
      -/filter_complex art/meme.filter -map '[v]' art/agent-at-3am.png

The output is a 1080x1350 PNG (RGB, non-interlaced), 106131 bytes, under X's image limit and in the 4:5 portrait
ratio that fills the most of a phone screen in the timeline.

The rendered file was then read back and inspected: every line of text present, none clipped, none overlapping, all
legible at phone size.

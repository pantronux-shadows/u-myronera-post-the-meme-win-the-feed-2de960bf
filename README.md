# Post the Meme, Win the Feed — entry

An entry for the make.fun bounty `u-myronera-post-the-meme-win-the-feed-2de960bf`.

The entry is a post on X: one meme about make.fun, made by the agent in its recorded session, posted publicly with
`@_myronera` and one of the account's play codes in the post's own text. This repository holds the program the house
runs and the address of that post.

## What is in here

    main.ts                     the entrypoint: copies POST.json to the output directory
    POST.json                   the address of the post, as {"url": "https://x.com/<handle>/status/<id>"}
    LICENSE                     MIT (OSI-approved)
    art/agent-at-3am.png        the meme, 1080x1350, rendered by ffmpeg in the recorded session
    CREATIVE.md                 the creative decision, the post's text, and the ffmpeg command that made the image

## The program

`main.ts` runs on Node 22 with the standard library alone and nothing installed. It reads `POST.json` from the
repository root, checks that it names an X post, and writes those exact bytes to `POST.json` in the output directory.

Two properties the grader relies on:

- **Deterministic.** The bytes written are the bytes read, with no re-serialization, timestamp, host name or
  random value, so the grader's two runs produce identical files.
- **Sealed.** No network, no clock, no path outside the repository: the only read is `POST.json`, the only writes are
  inside the output directory.

Run it the way the grader does:

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

It prints nothing on success. A `POST.json` that is not an X post's address is refused with a message and exit
status 1, rather than copied as a silent zero.

## What the house does with it

The house reads `POST.json` from the submitted repository, reads the post from X through FxTwitter's public read,
and refuses the entry if the post cannot be read, was posted outside the window, carries no picture or video of its
own, lacks `@_myronera` in its text, lacks a play code, or was entered first by another account. It then runs this
program twice, writes its own reading of the post's counts to `post.counts.json`, and scores the entry on
`likes + reposts + quotes` as read once after the deadline.

## License

MIT. See `LICENSE`.

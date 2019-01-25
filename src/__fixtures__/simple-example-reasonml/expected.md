This is a test of the plugin

Should not include language or range in code block:

```
open Core;

let readdir = dir =>
  switch (Sys.readdir(dir)) {
  | x => Ok(x)
  | exception (Sys_error(error)) => Error(error)
  };

let writeFile = (path, contents) => {
  let%lwt x = Lwt_unix.openfile(path, [Unix.O_RDWR, Unix.O_CREAT], 777);
  let%lwt _ =
    Lwt.finalize(
      () => Lwt_unix.write_string(x, contents, 0, String.length(contents)),
      () => Lwt_unix.close(x),
    );
  Lwt.return();
};

let realpath = Filename.realpath;

```

Should include language but not range in code block:

```reason
/**
 * https://github.com/Schniz/fnm/blob/8cb998759ef969685d711eb4299d91d2b78fe37e/library/Fs.re
 */
open Core;

let readdir = dir =>
  switch (Sys.readdir(dir)) {
  | x => Ok(x)
  | exception (Sys_error(error)) => Error(error)
  };

let writeFile = (path, contents) => {
  let%lwt x = Lwt_unix.openfile(path, [Unix.O_RDWR, Unix.O_CREAT], 777);
  let%lwt _ =
    Lwt.finalize(
      () => Lwt_unix.write_string(x, contents, 0, String.length(contents)),
      () => Lwt_unix.close(x),
    );
  Lwt.return();
};

let realpath = Filename.realpath;

```

Should include language and range in code block:

```reason
/**
 * https://github.com/Schniz/fnm/blob/8cb998759ef969685d711eb4299d91d2b78fe37e/library/Fs.re
 */
open Core;
/* ... */
let readdir = dir =>
  switch (Sys.readdir(dir)) {
  | x => Ok(x)
  | exception (Sys_error(error)) => Error(error)
  };
  /* ... */
let realpath = Filename.realpath;
```

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed

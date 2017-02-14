---
title: EASE Web Version 2 Documentation Readme
---

# Ease Web Version 2 Github page

## What is GitHub Pages?

GitHub Pages is a static site hosting service. It is designed to host personal, organization, or project pages directly from a GitHub repository.

They are powered by [Jekyll](https://jekyllrb.com/) behind the scenes, and in addition of supporting [Markdown](https://daringfireball.net/projects/markdown/), regular HTML content is supported.

### So what is Jekyll, exactly?

Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through a converter (like Markdown) and Jekyll's template engine called Liquid, and spits out a complete, ready-to-publish static website.

## Installation

To get up and running with a local jekyll site that mimics the main site, you will need to install Ruby & jekyll on your machine.

### Automated

If you're on a Mac, The following yarn command installs both dependencies and launches the doc site:

```bash
$ yarn docs
```

You should see an output similar to what's described in [how to run the site](#how-to-run-the-site)

### Manual

If you prefer to install both Ruby and Jekyll manually, here are the steps to follow:

Install Ruby (>2.0.0)

```bash
$ brew install ruby   # Installs the latest version using Homebrew
```

```bash
$ ruby -v   # Checks the ruby version
```

Install Jekyll:

```bash
$ gem install jekyll    # Uses ruby to install Jekyll
```

If you're on a Windows machine, follow the instructions [here](https://jekyllrb.com/docs/windows/#installation) and good luck!

## How to run the site

Now that you have ruby and jekyll installed. you need to start the server to get the site running. You **must run the command to start the server from the `docs` directory.**
 Run in a terminal:

```bash
$ cd path/to/docs/folder/in/your/repo
$ jekyll serve
```

You should see an output similar this the following:

```text
Configuration file: /docs/_config.yml
Configuration file: /docs/_config.yml
            Source: /docs
       Destination: /docs/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 0.294 seconds.
 Auto-regeneration: enabled for '/docs'
Configuration file: /docs/_config.yml
    Server address: http://127.0.0.1:4000/pages/ease-ui/ease-web-v2/
  Server running... press ctrl-c to stop.
```

The server is now running **on port 4000** and will restart everytime you make any modifications.

You also will notice a new folder `_site` was generated. That's the compiled site code that's being served.

Browse to the `Server address` location displayed in the terminal **http://127.0.0.1:4000/pages/ease-ui/ease-web-v2/**

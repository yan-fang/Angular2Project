---
title: How to use jekyll
---

# Jekyll

## Configuration

For information about configuration, you can find good information at the Jekyll [website](https://jekyllrb.com/docs/configuration/){:target="_blank"}.

A few things to remember:

> The configuration file `_config.yml` controls the site.
>
> **Do not use tabs in configuration files**.
> This will either lead to parsing errors, or Jekyll will revert to the default settings. Use spaces instead.
>
> When you make changes to the `_config.yml`, **you have to stop and restart the server**.

> Note: The destination folder `_site` is cleaned on site builds.
>
> The contents of `_site` are automatically cleaned, by default, when the site is built. Files or folders
> that are not created by the site will be removed.
> Some files could be retained by specifying them within the <keep_files> configuration directive.

## Front Matter

For information about Front Matter, you can find good information [here](http://jekyllrb.com/docs/frontmatter/){:target="_blank"}.

***Any file*** (HTML, Markdown etc) that contains **a YAML front matter block** will be processed by Jekyll as a special file. The front matter must be the first thing in the file and must take the form of valid YAML set between triple-dashed lines.

Ex:

```bash
---
layout: default
title: This is an example
---
```

This says that we're using the `default.html` file located in the folder `_layouts` as the basis for the current markdown file.

In most the files in docs, you don't need to put `layout: default` since our current `_config.yml` file contains a default section where we predefined the default layout of all markdown files.

So you would just need to use `{% raw %}{{ page.title }}{% endraw %}` in your markdown or html file to get the page title we define above.


A few things to remember:

> Note: You would need to specify the layout only if you're trying to use a different one than `default.html`.

> If you use UTF-8 encoding, make sure that no BOM header characters exist in your files or Jekyll will fail.
>
> This is especially relevant if you’re running Jekyll on Windows.

> Front Matter variables are optional
> If you want to use Liquid tags and variables but don’t need anything in your front matter, just leave it empty!
> ***The set of triple-dashed lines with nothing in between will still get Jekyll to process your file***.
>
> (This is useful for things like CSS and RSS feeds!)

> Don't repeat yourself
> If you don't want to repeat your frequently used front matter variables over and over,
> just define defaults for them and only override them where necessary (or not at all).
> This works both for predefined and custom variables.


## Additional Information

 - [Templates](http://jekyllrb.com/docs/templates/){:target="_blank"}: Jekyll uses the Liquid templating language to process templates. All of the standard Liquid tags and filters are supported. Jekyll even adds a few handy filters and tags of its own to make common tasks easier
 - [Variables](http://jekyllrb.com/docs/variables/){:target="_blank"}: Jekyll traverses your site looking for files to process. Any files with YAML front matter are subject to processing. For each of these files, Jekyll makes a variety of data available via the Liquid templating system. The following is a reference of the available data
 - [Includes](http://jekyllrb.com/docs/includes/){:target="_blank"}
 - [Collections](http://jekyllrb.com/docs/collections/){:target="_blank"}
 - [Troubleshooting](http://jekyllrb.com/docs/troubleshooting/){:target="_blank"}
 - [Jekyll Github Page](https://github.com/jekyll/jekyll){:target="_blank"}



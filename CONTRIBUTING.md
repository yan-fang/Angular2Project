# Contributing to Ease Web Version 2

<!---

Note: This is commented out util the documentation site is actually available to use.

Want to contribute to Ease Web Version 2? There are a few things you need to know.

We wrote a **[contribution guide](https://github.kdc.capitalone.com/pages/ease-ui/ease-web-v2/contributing/how-to-contribute)** to help you get started.
-->


We'd love for you to contribute to our source code! Here are the guidelines we'd like you to follow:

 - [Prerequisites](#prerequisites)
 - [Write privileges](#write)
 - [Question or Problem?](#question)
 - [Issues and Bugs](#issue)
 - [Feature Requests](#feature)
 - [Submission Guidelines](#submit)
 - [Coding Rules](#rules)
 - [Commit Message Guidelines](#commit)
 - [Help Wanted!](#help)

## <a name="prerequisites"></a> Prerequisites

In order to contribute, we would love it if the contributor has some strong fundamentals in the following technologies:

 - [Angular][angular]
 - [Webpack][webpack]
 - [Typescript][typescript]
 - [Accessibility][accessibility]

Capital One offers great resources to learn these technologies, such as [Pluralsight][pluralsight], [Code School][codeschool] and [Safari Books][safari-books].

The following is a list of recommended classes and books:

 - [Angular 2 Fundamentals By Jim Cooper and Joe Eames][angular-2-fundamentals]
 - [Typescript Fundamentals By Dan Wahlin and John Papa][typescript-fundamentals]
 - [Test-Driven Development By Example Kent Beck, Three Rivers Institute][unit-testing]
 - [e2e, BDD and ATDD testing - Specification by Example: How Successful Teams Deliver the Right Software][e2e]
    - [Anecdote][anecdote]

Also, we follow the same [angular][angular-styleguide] and [scss][scss-styleguide] style guide. Please make sure you go over those as well.

## <a name="write"></a> Write privileges

If you are interested in getting write privileges, please email us at x-wing@CapitalOne.com

## <a name="question"></a> Got a Question or Problem?

Please, do not open issues for the general support questions as we want to keep GitHub issues for bug reports and feature requests.

You've got much better chances of getting your question answered on [Capital One StackExchange](https://questions.kdc.capitalone.com/) where the questions should be tagged with tag `angular`.

Capital One StackExchange is a much better place to ask questions since:

- there are hundreds of engineers willing to help on Capital One StackExchange
- questions and answers stay available for public viewing so your question / answer might help someone else
- Capital One StackExchange's voting system assures that the best answers are prominently visible.

To save your and our time we will be systematically closing all the issues that are requests for general support and redirecting people to [Capital One StackExchange](https://questions.kdc.capitalone.com/).

If you would like to chat about the question in real-time, you can slack us on `ease-web-2` or email us at `x-wing@CapitalOne.com`.

## <a name="issue"></a> Found a Bug?
If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?
You can *request* a new feature by [submitting an issue](#submit-issue) to our GitHub
Repository. If you would like to *implement* a new feature, please submit an issue with
a proposal for your work first, to be sure that we can use it.
Please consider what kind of change it is:

* For a **Major Feature**, first open an issue and outline your proposal so that it can be
discussed. This will also allow us to better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
* **Small Features** can be crafted and directly [submitted as a Pull Request](#submit-pr).

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the [github issue tracker][issue-tracker] and [team x-wing JIRA][jira], maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it.
In order to reproduce bugs we will systematically ask you to provide a minimal reproduction scenario using a standalone git repository demonstrating the problem.
Having a live, reproducible scenario gives us wealth of important information without going back & forth to you with additional questions.

We will be insisting on a minimal reproduce scenario in order to save maintainers time and ultimately be able to fix more bugs.
Interestingly, from our experience engineers often find coding problems themselves while preparing a minimal test case scenario.
We understand that sometimes it might be hard to extract essentials bits of code from a larger code-base but we really need to isolate the problem before we can fix it.

You can file new issues by filling out our [new issue form][new-issue-form].


### <a name="submit-pr"></a> Submitting a Pull Request (PR)
Before you submit your Pull Request (PR) consider the following guidelines:

* Search [GitHub](https://github.kdc.capitalone.com/ease-ui/ease-web-v2/pulls) for an open or closed PR
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch development
     ```

* Create your patch, **including appropriate test cases**.
* Follow our [Coding Rules](#rules).
* Run the full Ease Web Version 2 test suite, as described in the [developer documentation][dev-doc],
  and ensure that all tests pass.
* Commit your changes using a descriptive commit message.

     ```shell
     git add --all
     yarn commit
     ```

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `ease-web-v2:development`.
* If we suggest changes then:
  * Make the required updates.
  * Re-run the Ease Web Version 2 test suites to ensure tests are still passing.
  * Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase development -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-fix-branch
    ```

* Check out the development branch:

    ```shell
    git checkout development -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-fix-branch
    ```

* Update your development with the latest upstream version:

    ```shell
    git pull --ff upstream development
    ```

## <a name="rules"></a> Coding Rules
To ensure consistency throughout the source code, keep these rules in mind as you are working:

* All features or bug fixes **must be tested** by one or more specs (unit-tests).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the Angular change log**.

### Commit Message Format
Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **JIRA#**, a **scope** and a **subject**:

```
<type>(<scope>): <JIRA#> - <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.


Running ` yarn commit` will walk you through the commit process.

### Revert
If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

### Body
Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer
The footer should contain any information about **Breaking Changes**

If any content is added to the footer, the prefix `BREAKING CHANGE:` is automatically appended to the footer.

## <a name="help">Help Wanted!</a>

We are looking for contributors!!
If you would like to help, please check our [help wanted section][help-wanted-section].


[pluralsight]: https://pulse.kdc.capitalone.com/docs/DOC-143657
[codeschool]: https://pulse.kdc.capitalone.com/docs/DOC-146806
[new-issue-form]: https://github.kdc.capitalone.com/ease-ui/ease-web-v2/issues/new
[issue-tracker]: https://github.kdc.capitalone.com/ease-ui/ease-web-v2/issues
[dev-doc]: https://github.kdc.capitalone.com/ease-ui/ease-web-v2/development/DEVELOPER.md
[github]: https://github.kdc.capitalone.com/ease-ui/ease-web-v2
[jira]: https://jira.kdc.capitalone.com/secure/Dashboard.jspa?selectPageId=33200
[accessibility]: https://pulse.kdc.capitalone.com/community/resources/ease/ease-web/projects/ease-accessibility-development-resources
[angular]: https://angular.io/docs/ts/latest/
[webpack]: https://webpack.js.org/configuration/
[typescript]: https://www.typescriptlang.org/docs/tutorial.html
[angular-2-fundamentals]: https://www.pluralsight.com/courses/angular-fundamentals
[typescript-fundamentals]: https://www.pluralsight.com/courses/typescript
[angular-styleguide]: https://angular.io/styleguide
[scss-styleguide]: http://sass-lang.com/guide
[help-wanted-section]: https://github.kdc.capitalone.com/ease-ui/ease-web-v2/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22
[safari-books]: https://pulse.kdc.capitalone.com/docs/DOC-146808
[unit-testing]: http://www.eecs.yorku.ca/course_archive/2003-04/W/3311/sectionM/case_studies/money/KentBeck_TDD_byexample.pdf
[e2e]: https://gojko.net/books/specification-by-example/
[anecdote]: https://www.thoughtworks.com/insights/blog/specification-example

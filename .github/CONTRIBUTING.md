# Contributing to Trade Finance

:+1::tada: Thanks for contributing to the best project ever! :tada::+1:

## Adding Features and Squashing Bugs

### Git Branching and Pivotal Workflow
1. Start a feature, bug, or chore in Pivotal.
2. Create a branch following this naming convention:
  * f/{feature ID}-feature-description
  * b/{bug ID}-bug-description
  * c/{chore ID}-chore-description

  note: The feature, bug, or chore ID can be found in Pivotal Tracker at the top of any ticket next to the `ID` button.

  example:
    ```bash
      git checkout -b f/138175551-mobile-header-styling
    ```
3. Push the empty branch to GitHub.

  example:
    ```bash
      git push origin f/138175551-mobile-header-styling
    ```
4. Copy and paste the link to that branch in the comments section of the story.

    note: The link will look like this: `https://github.com/{org name}/{repo name}/tree/{branch name}`

### Committing and Pull Requests

Make sure to run tests and the linter locally.
When commits are pushed, open a Pull Request and fill in the required
[template](.github/PULL_REQUEST_TEMPLATE.md).
It is crucial that screenshots and GIFs are provided whenever possible.
Once the changes are ready, add the 'Ready for Review' label.
Typically two reviewers will look over the changes and make comments where necessary.
The first reviewer that approves will add the 'Approved +1' label.
Once the second reviewer is satisfied they add the 'Last Call' label.
After a few minutes and no one has interjected, close the Pull Request by `squashing and merging`
and deleting the branch.

## Styleguides

### Git Commit Messages

* Consider starting the commit message with an applicable emoji:
* :art: `:art:` when improving the format/structure of the code
* :racehorse: `:racehorse:` when improving performance
* :non-potable_water: `:non-potable_water:` when plugging memory leaks
* :memo: `:memo:` when writing docs
* :penguin: `:penguin:` when fixing something on Linux
* :apple: `:apple:` when fixing something on macOS
* :checkered_flag: `:checkered_flag:` when fixing something on Windows
* :bug: `:bug:` when fixing a bug
* :fire: `:fire:` when removing code or files
* :green_heart: `:green_heart:` when fixing the CI build
* :white_check_mark: `:white_check_mark:` when adding tests
* :lock: `:lock:` when dealing with security
* :arrow_up: `:arrow_up:` when upgrading dependencies
* :arrow_down: `:arrow_down:` when downgrading dependencies
* :shirt: `:shirt:` when removing linter warnings
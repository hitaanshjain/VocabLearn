# Guide to Contributing

## Team Values
### How will the team work together?
The team will work together using tools such as GitHub, and Discord along with frequent SCRUM meetings. Tasks will be discussed and allocated during these meetings, and will be visible on the project boards. A member who needs help with their task may reach out to other members on the discord. If the member cannot complete their task, they are expected to let the team know ASAP. If any member is inable to complete their task, other members will decide how to allocate the work as soon as possible. The team will also resolve any conflicts during these meetings. All team members must respect each others opinions and come to an understanding on resolving the conflict. Team members are expected to respond to messages directed towards them within 24 hours. 

### Sprint Cadence
A sprint should take about 2 weeks.

### Daily Standups
Standups will occur every Monday, Wednesday, and Friday during the evenings. They will last about 15-20 minutes. All members are expected to attend synchronously and must let the team know in advance if they cannot make it. A member that does not make any progress on a task for two standups in a row or more will be reported to management. 

### Coding Standards
Code Editor: VS Code  
Code Linter: Undecided

## Git Workflow

### Cloning the Repository

Please clone the repository to their local machine before starting development.

```bash
git clone https://github.com/agile-students-spring2026/final-subparallel.git
cd <final-subparallel>
```
---
### Keep Your Main Branch Updated

Before starting any new work, make sure your local `main` is in sync with the remote:

```bash
git checkout main
git pull origin main
```

---
### Branches

Never work directly on `main`. Always create a dedicated branch for your changes, named to reflect what you're working on:

```bash
git checkout -b featurename
```
---
### Updating the Repository

Once you've made your changes, stage and commit them with a message that clearly explains what was done and why:
```bash
git add .
git commit -m "Clear and descriptive commit message"
```
> Commit messages should be concise but meaningful. Avoid vague messages like `"fix"` or `"update"`.

---

### Pushing Your Branch

When your changes are ready, push your branch up to the main branch on GitHub:

```bash
git push origin featurename
```

---

### Creating a Pull Request

Once your branch is pushed, open a pull request (PR) to get your changes reviewed:

1. Navigate to the repository on GitHub
2. Click Compare & pull request
3. Set the base branch to `main` and the compare branch to your feature branch
4. Write a clear title and description explaining your changes
5. Link any related issues using `Closes #<issue-number>`
6. Submit the pull request
7. After it's merged, delete your branch

---

### Pull Request Review Policy

All PRs must meet the following criteria before merging:

- At least one other team member must review and approve the PR
- No failing tests or lint errors
- All requested changes must be addressed before the PR can be merged

---


### Important Rules

- Never work directly on `main`
- Sync `main` before branching
- Name branches clearly
- Write meaningful commit messages
- Do not accept your own pull request
- All checks must pass
- Delete your branch after merging

## Contributing Rules
Only contribute tasks that are not in progress or have been delegated to you. Anyone who contributes must follow all workflow rules. 
## Setting up the local development environment
More information on this later.

## Building and testing the project
More information on this later.
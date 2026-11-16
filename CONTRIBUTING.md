# Contributing
To add a compiler, there are 3 places to edit:
- web/compiler_list.txt; Use '=' to separate name and VCS url,
- web/compiler_list.js; follow the existing format; the load function should return a callable that takes the source code and returns the compiled mlog
- THIRD-PARTY-NOTICES,
npm run build:lib
npm version patch
cd dist/headlessui-angular
npm version patch
git add . && git commit --amend
npm login
npm publish

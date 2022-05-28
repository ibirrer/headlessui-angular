echo "build and test"
npm run build
npm run build:demo
npm run test:ci

echo "update package version"
npm version patch --no-git-tag-version
new_version=$(npm pkg get version | sed 's/"//g')
npm --prefix projects/headlessui-angular version --no-git-tag-version $new_version

echo "commit and tag"
git commit -am v$new_version
git tag v$new_version

echo "publish"
cd dist/headlessui-angular
npm login
npm publish


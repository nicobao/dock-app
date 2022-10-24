git config --global url."https://".insteadOf git://
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
# yarn install
# yarn postinstall
git clone "https://${{ secrets.ACCESS_TOKEN }}@github.com/docknetwork/react-native-sdk.git" ../wallet-sdk
# yarn --cwd ../wallet-sdk install
# yarn sync-sdk
# yarn build-sdk
rm -rf ./certs
git clone "https://${{ secrets.ACCESS_TOKEN }}@github.com/docknetwork/dock-app-certs.git" ./certs
# mv ./certs/google-play.json ./
# cp -rf ./certs/google-services.json ./android/app/
rm -rf ./android/gradle.properties
cp -rf ./certs/gradle.properties ./android/gradle.properties
# inject distro configs variables
cat ./packaging.config >> ./android/gradle.properties
cat ./android/gradle.properties
# Pull env variables from certs repo
# It will inject sentry token in the JS thread
cp -rf ./certs/.env ./
rm -rf /tmp/google-play-cert
cp -rf ./certs/google-play-cert /tmp/google-play-cert
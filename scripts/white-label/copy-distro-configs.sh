git clone "https://${{ secrets.ACCESS_TOKEN }}@github.com/docknetwork/${{ matrix.app }}.git" ../distro_configs
ls -R ../distro_configs
cp -rv ../distro_configs/* .

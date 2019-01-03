** GarageScript Submit **

* Steps to install

1) `cd  Apps/garageScript/lib/gsSubmit/` // from the garage-script base folder
2) `sudo npm install -g`

** Note: **

The symlink (creates a virtual link between the filepath) is executed
on the absolute filepath it is installed from.

Changes branches in git will change this package if it is edited.

This means that only Jenkins should be installing this package.

Furthermore, any moving of this file will cause the symlink to break

** Jenkins Script **

```
cd Apps/garageScript/lib/gsSubmit/
sudo npm install -g
```
